/* #region Backend: dependencias de rutas de modelos */
import {
  getModelCatalogResponse,
  startModelDownload,
} from "../controllers/modelsController.js";
/* #endregion Backend: dependencias de rutas de modelos */

/* #region Backend: utilidades de rutas de modelos */
function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(payload));
}

async function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let rawBody = "";

    request.setEncoding("utf8");
    request.on("data", (chunk) => {
      rawBody += chunk;
    });
    request.on("end", () => {
      if (!rawBody) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(rawBody));
      } catch (_error) {
        reject(new Error("El cuerpo JSON no es valido."));
      }
    });
    request.on("error", reject);
  });
}
/* #endregion Backend: utilidades de rutas de modelos */

/* #region Backend: rutas de modelos */
export async function handleModelsRoutes(request, response) {
  const requestUrl = new URL(request.url, "http://localhost");

  if (request.method === "GET" && requestUrl.pathname === "/api/models") {
    const payload = await getModelCatalogResponse();
    sendJson(response, 200, payload);
    return;
  }

  if (request.method === "POST" && requestUrl.pathname === "/api/models/download") {
    try {
      const body = await readRequestBody(request);
      const payload = await startModelDownload(body.modelId);
      sendJson(response, 202, payload);
    } catch (error) {
      sendJson(response, 400, { error: error.message });
    }

    return;
  }

  sendJson(response, 404, { error: "Ruta de modelos no encontrada." });
}
/* #endregion Backend: rutas de modelos */
