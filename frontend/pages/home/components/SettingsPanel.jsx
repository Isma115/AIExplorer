/* #region Componentes Pagina Inicio: panel de ajustes */
import { ModelLibraryPanel } from "./ModelLibraryPanel.jsx";

export function SettingsPanel({
  uiSettings,
  availableModels,
  selectedModelId,
  selectedModel,
  isLoadingModels,
  errorMessage,
  onSettingChange,
  onSelectModel,
  onDownloadSelectedModel,
  onRefreshModels,
}) {
  return (
    <section className="settings-panel">
      <section className="settings-overview">
        <div className="settings-overview-header">
          <div>
            <p className="settings-overview-caption">
              Configura el comportamiento local del chat y gestiona los modelos descargables.
            </p>
          </div>
        </div>

        <div className="settings-grid">
          <article className="settings-card">
            <div>
              <p className="settings-card-title">Comportamiento del chat</p>
              <p className="settings-card-copy">
                Preferencias guardadas en este navegador para adaptar el flujo de uso.
              </p>
            </div>

            <label className="settings-toggle">
              <div>
                <span>Enviar con Enter</span>
                <p>Shift + Enter mantiene el salto de linea cuando esta opcion esta activa.</p>
              </div>
              <input
                type="checkbox"
                checked={uiSettings.sendOnEnter}
                onChange={(event) => onSettingChange("sendOnEnter", event.target.checked)}
              />
            </label>

            <label className="settings-toggle">
              <div>
                <span>Autoscroll del historial</span>
                <p>Desplaza automaticamente el historial hasta el ultimo mensaje recibido.</p>
              </div>
              <input
                type="checkbox"
                checked={uiSettings.autoScrollEnabled}
                onChange={(event) => onSettingChange("autoScrollEnabled", event.target.checked)}
              />
            </label>
          </article>

          <article className="settings-card">
            <div>
              <p className="settings-card-title">Interfaz</p>
              <p className="settings-card-copy">
                Ajustes visuales ligeros para el panel lateral y el resumen de conversaciones.
              </p>
            </div>

            <label className="settings-toggle">
              <div>
                <span>Sidebar compacto</span>
                <p>Reduce la densidad vertical del historial lateral para ver mas conversaciones.</p>
              </div>
              <input
                type="checkbox"
                checked={uiSettings.compactSidebar}
                onChange={(event) => onSettingChange("compactSidebar", event.target.checked)}
              />
            </label>

            <label className="settings-toggle">
              <div>
                <span>Mostrar previsualizacion</span>
                <p>Enseña el ultimo fragmento del mensaje en cada tarjeta del historial lateral.</p>
              </div>
              <input
                type="checkbox"
                checked={uiSettings.showConversationPreview}
                onChange={(event) => onSettingChange("showConversationPreview", event.target.checked)}
              />
            </label>
          </article>
        </div>
      </section>

      <ModelLibraryPanel
        availableModels={availableModels}
        selectedModelId={selectedModelId}
        selectedModel={selectedModel}
        isLoadingModels={isLoadingModels}
        errorMessage={errorMessage}
        onSelectModel={onSelectModel}
        onDownloadSelectedModel={onDownloadSelectedModel}
        onRefreshModels={onRefreshModels}
      />
    </section>
  );
}
/* #endregion Componentes Pagina Inicio: panel de ajustes */
