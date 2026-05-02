/* #region Backend: dependencias del orquestador de desarrollo */
import { spawn } from "node:child_process";
/* #endregion Backend: dependencias del orquestador de desarrollo */

/* #region Backend: orquestador de desarrollo */
function spawnProcess(command, args) {
  return spawn(command, args, {
    stdio: "inherit",
    shell: true,
  });
}

const backendProcess = spawnProcess("npm", ["run", "dev:backend"]);
const frontendProcess = spawnProcess("npm", ["run", "dev:frontend"]);

function stopProcesses() {
  backendProcess.kill("SIGTERM");
  frontendProcess.kill("SIGTERM");
}

process.on("SIGINT", stopProcesses);
process.on("SIGTERM", stopProcesses);
/* #endregion Backend: orquestador de desarrollo */
