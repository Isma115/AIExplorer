/* #region Componentes Pagina Inicio: formulario de envio */
import { useEffect, useRef } from "react";

export function ChatComposer({ draft, isSending, sendOnEnter, onDraftChange, onSubmit }) {
  const inputRef = useRef(null);

  function adjustTextareaHeight(textarea) {
    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }

  function handleChange(event) {
    onDraftChange(event.target.value);
    adjustTextareaHeight(event.target);
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit();
  }

  function handleKeyDown(event) {
    if (sendOnEnter && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  }

  function handleFocus() {
    if (inputRef.current) {
      adjustTextareaHeight(inputRef.current);
    }
  }

  useEffect(() => {
    if (inputRef.current) {
      adjustTextareaHeight(inputRef.current);
    }
  }, [draft]);

  return (
    <section className="composer panel">
      <form className="composer-form" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="chat-input">
          Escribe un mensaje
        </label>

        <div className="composer-input-container">
          <textarea
            id="chat-input"
            ref={inputRef}
            className="composer-input"
            placeholder="Escribe tu mensaje..."
            rows="1"
            value={draft}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
          ></textarea>

          <button className="send-button" type="submit" disabled={isSending}>
            {isSending ? "..." : "Enviar"}
          </button>
        </div>

        <div className="composer-actions">
          <p className="composer-hint">
            {sendOnEnter ? "Enter envia. Shift + Enter para nueva linea." : "Enter inserta una nueva linea."}
          </p>
        </div>
      </form>
    </section>
  );
}
/* #endregion Componentes Pagina Inicio: formulario de envio */
