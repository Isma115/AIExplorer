/* #region Componentes Pagina Inicio: panel de modelos locales */
function formatBytes(byteCount) {
  if (!byteCount) {
    return "0 B";
  }

  const units = ["B", "KB", "MB", "GB", "TB"];
  const unitIndex = Math.min(Math.floor(Math.log(byteCount) / Math.log(1024)), units.length - 1);
  const value = byteCount / 1024 ** unitIndex;

  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function getStatusLabel(model) {
  switch (model.status) {
    case "installed":
      return "Instalado";
    case "downloading":
      return "Descargando";
    case "failed":
      return "Error";
    case "unavailable":
      return "Pendiente";
    default:
      return "Disponible";
  }
}

export function ModelLibraryPanel({
  availableModels,
  selectedModelId,
  selectedModel,
  isLoadingModels,
  errorMessage,
  onSelectModel,
  onDownloadSelectedModel,
  onRefreshModels,
}) {
  const isDownloadDisabled =
    !selectedModel ||
    selectedModel.status === "installed" ||
    selectedModel.status === "downloading" ||
    !selectedModel.downloadSupported;
  const progressRatio = selectedModel?.progressRatio ?? 0;

  return (
    <section className="model-library panel">
      <div className="model-library-header">
        <div>
          <p className="model-library-label">Modelos locales</p>
          <p className="model-library-caption">
            Descarga modelos GGUF bajo demanda en <code>backend/models/local</code>.
          </p>
        </div>

        <button className="ghost-button" type="button" onClick={onRefreshModels}>
          Actualizar
        </button>
      </div>

      <div className="model-library-toolbar">
        <label className="model-library-select-wrapper" htmlFor="model-selector">
          <span className="model-library-select-label">Selector de modelos</span>
          <select
            id="model-selector"
            className="model-library-select"
            value={selectedModelId}
            onChange={(event) => onSelectModel(event.target.value)}
            disabled={isLoadingModels || !availableModels.length}
          >
            {availableModels.map((model) => (
              <option key={model.id} value={model.id}>
                {model.selectorLabel}
              </option>
            ))}
          </select>
        </label>

        <button
          className="sidebar-button model-download-button"
          type="button"
          onClick={onDownloadSelectedModel}
          disabled={isDownloadDisabled}
        >
          {selectedModel?.status === "downloading" ? "En progreso" : "Descargar"}
        </button>
      </div>

      {errorMessage ? <p className="model-library-feedback model-library-error">{errorMessage}</p> : null}
      {isLoadingModels ? <p className="model-library-feedback">Cargando catalogo...</p> : null}

      {selectedModel ? (
        <article className="model-library-card">
          <div className="model-library-card-header">
            <div>
              <p className="model-library-card-title">{selectedModel.name}</p>
              <p className="model-library-card-copy">{selectedModel.note}</p>
            </div>

            <span className={`model-status-badge model-status-${selectedModel.status}`}>
              {getStatusLabel(selectedModel)}
            </span>
          </div>

          <div className="model-library-metadata">
            <span>{selectedModel.requestedSizeLabel}</span>
            <span>{selectedModel.quantization}</span>
            <span>{selectedModel.runtime}</span>
            <span>{selectedModel.format}</span>
          </div>

          <div className="model-library-details">
            <p>
              Fuente: <a href={selectedModel.sourceUrl} target="_blank" rel="noreferrer">{selectedModel.sourceLabel}</a>
            </p>
            <p>Archivo: {selectedModel.fileName}</p>
            <p>Tamano de referencia: {selectedModel.expectedSizeLabel}</p>
            <p>Ruta local: {selectedModel.localPath ?? "Sin descargar"}</p>
          </div>

          {selectedModel.status === "downloading" ? (
            <div className="model-progress">
              <div className="model-progress-bar">
                <span style={{ width: `${Math.max(progressRatio * 100, 6)}%` }}></span>
              </div>
              <p className="model-progress-copy">
                {formatBytes(selectedModel.downloadedBytes)} / {formatBytes(selectedModel.totalBytes)}
              </p>
            </div>
          ) : null}
        </article>
      ) : null}
    </section>
  );
}
/* #endregion Componentes Pagina Inicio: panel de modelos locales */
