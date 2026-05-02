/* #region Backend: dependencias del servidor */
import http from "node:http";
import { handleModelsRoutes } from "./routes/modelsRoutes.js";
/* #endregion Backend: dependencias del servidor */

/* #region Backend: utilidades de respuesta */
function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Content-Type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(payload));
}
/* #endregion Backend: utilidades de respuesta */

/* #region Backend: servidor principal */
const backendPort = Number(process.env.AIEXPLORER_BACKEND_PORT ?? 3001);
const backendHost = "127.0.0.1";

const server = http.createServer(async (request, response) => {
  if (!request.url) {
    sendJson(response, 400, { error: "La peticion no incluye URL." });
    return;
  }

  if (request.method === "OPTIONS") {
    sendJson(response, 204, {});
    return;
  }

  if (request.url.startsWith("/api/models")) {
    await handleModelsRoutes(request, response);
    return;
  }

  sendJson(response, 404, { error: "Ruta no encontrada." });
});

server.listen(backendPort, backendHost, () => {
  console.log(`AIExplorer backend escuchando en http://${backendHost}:${backendPort}`);
});
/* #endregion Backend: servidor principal */
