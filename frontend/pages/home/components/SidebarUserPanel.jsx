/* #region Componentes Pagina Inicio: cabecera lateral del usuario */
export function SidebarUserPanel({ currentUser, onOpenSettings }) {
  return (
    <section className="sidebar-user-shell panel">
      <div className="sidebar-user-panel">
        <article className="sidebar-user-card">
          <div className="sidebar-user-avatar" aria-hidden="true">
            {currentUser.initials}
          </div>

          <div className="sidebar-user-content">
            <p className="sidebar-user-name">{currentUser.name}</p>
            <p className="sidebar-user-email">{currentUser.email}</p>
          </div>
        </article>

        <button className="ghost-button sidebar-settings-button" type="button" onClick={onOpenSettings}>
          Ajustes
        </button>
      </div>
    </section>
  );
}
/* #endregion Componentes Pagina Inicio: cabecera lateral del usuario */
