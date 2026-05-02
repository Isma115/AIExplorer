/* #region Pagina Inicio: panel lateral de conversaciones */
function formatConversationTimestamp(timestamp) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

export function ChatSidebar({
  conversations,
  activeConversationId,
  onCreateConversation,
  onSelectConversation,
}) {
  return (
    <aside className="chat-sidebar panel">
      <div className="sidebar-header">
        <div>
          <p className="sidebar-label">Conversaciones</p>
          <p className="sidebar-caption">
            Historial local del usuario guardado en este navegador.
          </p>
        </div>

        <button className="sidebar-button" type="button" onClick={onCreateConversation}>
          Nueva
        </button>
      </div>

      <div className="conversation-list" aria-label="Historial de conversaciones">
        {conversations.map((conversation) => {
          const isActive = conversation.id === activeConversationId;

          return (
            <button
              key={conversation.id}
              type="button"
              className={`conversation-card ${isActive ? "conversation-card-active" : ""}`}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <span className="conversation-card-title">{conversation.title}</span>
              <span className="conversation-card-preview">{conversation.preview}</span>
              <span className="conversation-card-meta">
                {conversation.messageCount} mensajes · {formatConversationTimestamp(conversation.updatedAt)}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
/* #endregion Pagina Inicio: panel lateral de conversaciones */
