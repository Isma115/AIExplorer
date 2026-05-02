/* #region Componentes Pagina Inicio: modal de ajustes */
import { useEffect } from "react";
import { SettingsPanel } from "./SettingsPanel.jsx";

export function SettingsModal({
  isOpen,
  uiSettings,
  availableModels,
  selectedModelId,
  selectedModel,
  isLoadingModels,
  errorMessage,
  onClose,
  onSettingChange,
  onSelectModel,
  onDownloadSelectedModel,
  onRefreshModels,
}) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="settings-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="settings-modal panel"
        role="dialog"
        aria-modal="true"
        aria-label="Ajustes"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="settings-modal-header">
          <div>
            <p className="settings-modal-label">Ajustes</p>
            <p className="settings-modal-caption">
              Gestiona modelos locales y preferencias de esta sesion.
            </p>
          </div>

          <button className="ghost-button" type="button" onClick={onClose}>
            Cerrar
          </button>
        </div>

        <SettingsPanel
          uiSettings={uiSettings}
          availableModels={availableModels}
          selectedModelId={selectedModelId}
          selectedModel={selectedModel}
          isLoadingModels={isLoadingModels}
          errorMessage={errorMessage}
          onSettingChange={onSettingChange}
          onSelectModel={onSelectModel}
          onDownloadSelectedModel={onDownloadSelectedModel}
          onRefreshModels={onRefreshModels}
        />
      </section>
    </div>
  );
}
/* #endregion Componentes Pagina Inicio: modal de ajustes */
