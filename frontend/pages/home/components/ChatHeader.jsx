/* #region Pagina Inicio: encabezado del chat */
export function ChatHeader() {
  return (
    <header className="chat-header panel">
      <div className="chat-header-copy">
        <p className="eyebrow">AIExplorer</p>
        <h1>Un espacio de conversación sobrio, rápido y diseñado para pensar.</h1>
        <p className="hero-copy">
          Interfaz local con memoria por conversaciones, ritmo de chat natural y una
          estética más cercana a una herramienta de IA real.
        </p>
      </div>

      <div className="chat-header-meta">
        <span className="meta-pill">Historial local</span>
        <span className="meta-pill meta-pill-accent">Chat workspace</span>
      </div>

      <div className="status-badge">
        <span className="status-dot"></span>
        <span>Modo local</span>
      </div>
    </header>
  );
}
/* #endregion Pagina Inicio: encabezado del chat */
