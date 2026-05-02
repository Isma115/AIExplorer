/* #region Pagina Inicio: dependencias */
import { useHomeChat } from "./logic/home.js";
import { ChatHeader } from "./components/ChatHeader.jsx";
import { ChatHistory } from "./components/ChatHistory.jsx";
import { ChatComposer } from "./components/ChatComposer.jsx";
import { ChatSidebar } from "./components/ChatSidebar.jsx";
import "./styles/home.css";
/* #endregion Pagina Inicio: dependencias */

/* #region Pagina Inicio: componente principal */
export default function HomePage() {
  const {
    draft,
    messages,
    conversations,
    activeConversationId,
    isSending,
    setDraft,
    sendMessage,
    clearMessages,
    createConversation,
    selectConversation,
  } = useHomeChat();

  return (
    <div className="app-shell">
      <div className="ambient ambient-left" aria-hidden="true"></div>
      <div className="ambient ambient-right" aria-hidden="true"></div>

      <main className="chat-experience">
        <div className="chat-layout">
          <ChatSidebar
            conversations={conversations}
            activeConversationId={activeConversationId}
            onCreateConversation={createConversation}
            onSelectConversation={selectConversation}
          />

          <section className="chat-main">
            <ChatHeader />

            <section className="chat-panel panel">
              <div className="chat-toolbar">
                <div>
                  <p className="toolbar-label">Historial</p>
                  <p className="toolbar-caption">
                    Mensajes enviados a la derecha y respuestas a la izquierda.
                  </p>
                </div>

                <button className="ghost-button" type="button" onClick={clearMessages}>
                  Limpiar
                </button>
              </div>

              <ChatHistory messages={messages} />
            </section>

            <ChatComposer
              draft={draft}
              isSending={isSending}
              onDraftChange={setDraft}
              onSubmit={sendMessage}
            />
          </section>
        </div>
      </main>
    </div>
  );
}
/* #endregion Pagina Inicio: componente principal */
