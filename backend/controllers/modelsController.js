/* #region Backend: dependencias del controlador de modelos */
import fs from "node:fs";
import fsp from "node:fs/promises";
import http from "node:http";
import https from "node:https";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { languageModelCatalog } from "../models/registry.js";
/* #endregion Backend: dependencias del controlador de modelos */

/* #region Backend: constantes del controlador de modelos */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localModelsDirectory = path.resolve(__dirname, "../models/local");
const downloadStates = new Map();
/* #endregion Backend: constantes del controlador de modelos */

/* #region Backend: utilidades del controlador de modelos */
function ensureHttpSuccess(statusCode) {
  return typeof statusCode === "number" && statusCode >= 200 && statusCode < 300;
}

function createModelPaths(model) {
  const modelDirectory = path.join(localModelsDirectory, model.id);

  return {
    modelDirectory,
    filePath: path.join(modelDirectory, model.fileName),
    tempFilePath: path.join(modelDirectory, `${model.fileName}.part`),
    metadataPath: path.join(modelDirectory, "model.json"),
  };
}

function serializeProgress(downloadedBytes, totalBytes) {
  if (!totalBytes) {
    return 0;
  }

  return Number((downloadedBytes / totalBytes).toFixed(4));
}

function requestStream(downloadUrl, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    const transport = downloadUrl.startsWith("https:") ? https : http;
    const request = transport.get(
      downloadUrl,
      {
        headers: {
          "User-Agent": "AIExplorer/1.0",
        },
      },
      (response) => {
        const statusCode = response.statusCode ?? 0;
        const location = response.headers.location;

        if (
          [301, 302, 307, 308].includes(statusCode) &&
          location &&
          redirectCount < 5
        ) {
          response.resume();
          const nextUrl = new URL(location, downloadUrl).toString();
          resolve(requestStream(nextUrl, redirectCount + 1));
          return;
        }

        if (!ensureHttpSuccess(statusCode)) {
          response.resume();
          reject(
            new Error(`La fuente remota respondio con estado ${statusCode}.`),
          );
          return;
        }

        resolve(response);
      },
    );

    request.on("error", reject);
  });
}

async function loadInstalledMetadata(model) {
  const { filePath, metadataPath } = createModelPaths(model);

  try {
    const [rawMetadata, fileStats] = await Promise.all([
      fsp.readFile(metadataPath, "utf8"),
      fsp.stat(filePath),
    ]);

    const parsedMetadata = JSON.parse(rawMetadata);

    return {
      status: "installed",
      localPath: filePath,
      downloadedBytes: fileStats.size,
      totalBytes: fileStats.size,
      progressRatio: 1,
      installedAt: parsedMetadata.installedAt,
      errorMessage: "",
    };
  } catch (_error) {
    return null;
  }
}

async function createCatalogItem(model) {
  const installedMetadata = await loadInstalledMetadata(model);
  const activeDownload = downloadStates.get(model.id);

  if (installedMetadata) {
    return {
      ...model,
      ...installedMetadata,
    };
  }

  if (activeDownload) {
    return {
      ...model,
      status: activeDownload.status,
      localPath: activeDownload.localPath,
      downloadedBytes: activeDownload.downloadedBytes,
      totalBytes: activeDownload.totalBytes,
      progressRatio: serializeProgress(
        activeDownload.downloadedBytes,
        activeDownload.totalBytes,
      ),
      installedAt: "",
      errorMessage: activeDownload.errorMessage ?? "",
    };
  }

  return {
    ...model,
    status: model.downloadSupported ? "not-installed" : "unavailable",
    localPath: "",
    downloadedBytes: 0,
    totalBytes: 0,
    progressRatio: 0,
    installedAt: "",
    errorMessage: "",
  };
}
/* #endregion Backend: utilidades del controlador de modelos */

/* #region Backend: controlador de catalogo de modelos */
export async function getModelCatalogResponse() {
  await fsp.mkdir(localModelsDirectory, { recursive: true });
  const models = await Promise.all(languageModelCatalog.map(createCatalogItem));

  return { models };
}
/* #endregion Backend: controlador de catalogo de modelos */

/* #region Backend: controlador de descarga de modelos */
export async function startModelDownload(modelId) {
  const model = languageModelCatalog.find((catalogModel) => catalogModel.id === modelId);

  if (!modelId || !model) {
    throw new Error("Selecciona un modelo valido antes de iniciar la descarga.");
  }

  if (!model.downloadSupported || !model.downloadUrl) {
    throw new Error("Este modelo sigue en el selector, pero su fuente GGUF no esta configurada todavia.");
  }

  const installedMetadata = await loadInstalledMetadata(model);

  if (installedMetadata) {
    return {
      message: "El modelo ya esta descargado.",
      modelId,
      status: "installed",
    };
  }

  if (downloadStates.get(modelId)?.status === "downloading") {
    return {
      message: "La descarga ya esta en curso.",
      modelId,
      status: "downloading",
    };
  }

  const { modelDirectory, filePath, tempFilePath, metadataPath } = createModelPaths(model);
  await fsp.mkdir(modelDirectory, { recursive: true });

  downloadStates.set(modelId, {
    status: "downloading",
    localPath: filePath,
    downloadedBytes: 0,
    totalBytes: 0,
    errorMessage: "",
  });

  queueMicrotask(async () => {
    const downloadState = downloadStates.get(modelId);

    try {
      const response = await requestStream(model.downloadUrl);
      const totalBytes = Number(response.headers["content-length"] ?? 0);
      const fileWriter = fs.createWriteStream(tempFilePath);

      downloadState.totalBytes = totalBytes;

      response.on("data", (chunk) => {
        downloadState.downloadedBytes += chunk.length;
      });

      await new Promise((resolve, reject) => {
        response.pipe(fileWriter);
        response.on("error", reject);
        fileWriter.on("finish", resolve);
        fileWriter.on("error", reject);
      });

      await fsp.rename(tempFilePath, filePath);
      await fsp.writeFile(
        metadataPath,
        JSON.stringify(
          {
            id: model.id,
            installedAt: new Date().toISOString(),
            fileName: model.fileName,
            sourceUrl: model.sourceUrl,
          },
          null,
          2,
        ),
        "utf8",
      );

      downloadStates.set(modelId, {
        status: "installed",
        localPath: filePath,
        downloadedBytes: downloadState.downloadedBytes,
        totalBytes: downloadState.downloadedBytes,
        errorMessage: "",
      });
    } catch (error) {
      await fsp.rm(tempFilePath, { force: true }).catch(() => {});
      downloadStates.set(modelId, {
        status: "failed",
        localPath: filePath,
        downloadedBytes: 0,
        totalBytes: 0,
        errorMessage: error.message,
      });
    }
  });

  return {
    message: "Descarga iniciada.",
    modelId,
    status: "downloading",
  };
}
/* #endregion Backend: controlador de descarga de modelos */
