/* #region Componentes Pagina Inicio: dependencias */
import { useHomeChat } from "./logic/home.js";
import { ChatHistory } from "./components/ChatHistory.jsx";
import { ChatComposer } from "./components/ChatComposer.jsx";
import { ChatSidebar } from "./components/ChatSidebar.jsx";
import { SidebarUserPanel } from "./components/SidebarUserPanel.jsx";
import { SettingsModal } from "./components/SettingsModal.jsx";
import "./styles/home.css";
/* #endregion Componentes Pagina Inicio: dependencias */

/* #region Componentes Pagina Inicio: componente principal */
export default function HomePage() {
  const {
    draft,
    messages,
    conversations,
    activeConversationId,
    isSending,
    currentUser,
    uiSettings,
    availableModels,
    selectedModelId,
    selectedModel,
    isLoadingModels,
    modelsError,
    isSettingsOpen,
    setDraft,
    sendMessage,
    createConversation,
    selectConversation,
    updateUiSetting,
    selectModel,
    downloadSelectedModel,
    refreshModels,
    openSettings,
    closeSettings,
  } = useHomeChat();

  return (
    <div className="app-shell">
      <div className="ambient ambient-left" aria-hidden="true"></div>
      <div className="ambient ambient-right" aria-hidden="true"></div>

      <main className="chat-experience">
        <div className="chat-layout">
          <section className="sidebar-column">
            <SidebarUserPanel currentUser={currentUser} onOpenSettings={openSettings} />

            <ChatSidebar
              conversations={conversations}
              activeConversationId={activeConversationId}
              isCompact={uiSettings.compactSidebar}
              showPreview={uiSettings.showConversationPreview}
              onCreateConversation={createConversation}
              onSelectConversation={selectConversation}
            />
          </section>

          <section className="chat-main">
            <section className="chat-panel panel">
              <ChatHistory messages={messages} shouldAutoScroll={uiSettings.autoScrollEnabled} />
            </section>

            <ChatComposer
              draft={draft}
              isSending={isSending}
              sendOnEnter={uiSettings.sendOnEnter}
              onDraftChange={setDraft}
              onSubmit={sendMessage}
            />
          </section>
        </div>
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        uiSettings={uiSettings}
        availableModels={availableModels}
        selectedModelId={selectedModelId}
        selectedModel={selectedModel}
        isLoadingModels={isLoadingModels}
        errorMessage={modelsError}
        onClose={closeSettings}
        onSettingChange={updateUiSetting}
        onSelectModel={selectModel}
        onDownloadSelectedModel={downloadSelectedModel}
        onRefreshModels={refreshModels}
      />
    </div>
  );
}
/* #endregion Componentes Pagina Inicio: componente principal */
