/* #region Componentes Pagina Inicio: listado de mensajes */
import { useEffect, useRef } from "react";

export function ChatHistory({ messages }) {
  const historyRef = useRef(null);

  useEffect(() => {
    if (!historyRef.current) {
      return;
    }

    historyRef.current.scrollTop = historyRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="chat-history" ref={historyRef} aria-live="polite">
      {messages.length === 0 ? (
        <article className="chat-empty-state">
          <p className="chat-empty-title">Conversacion vacia</p>
          <p className="chat-empty-copy">
            Escribe un mensaje para empezar a guardar el estado de esta conversacion en local.
          </p>
        </article>
      ) : null}

      {messages.map((message) => (
        <article
          key={message.id}
          className={`message-row message-row-${message.side}`}
        >
          <div className={`message-bubble message-bubble-${message.side}`}>
            <span className="message-author">{message.author}</span>
            <p>{message.content}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
/* #endregion Componentes Pagina Inicio: listado de mensajes */
