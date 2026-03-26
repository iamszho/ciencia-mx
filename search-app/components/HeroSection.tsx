export default function HeroSection() {
  return (
    <header className="hero-section">
      <div>
        <div className="hero-badge">
          <span className="hero-badge-dot"></span>
          <span className="text-xs font-bold text-brand uppercase tracking-wider">Servicios Especializados</span>
        </div>

        <h1 className="hero-title">
          Su repositorio institucional, <br />
          <span>gestionado por expertos.</span>
        </h1>

        <p className="hero-text">
          Elimine la carga técnica de su equipo de TI. Nos especializamos exclusivamente en <strong>DSpace, OJS y cumplimiento de normativas</strong> para universidades y centros de investigación.
        </p>

        <div className="hero-actions">
          <a href="#contacto" className="hero-cta">
            Solicitar Diagnóstico Gratuito
          </a>
          <div className="hero-stats">
            <span className="hero-stats-text">Con investigaciones de <br /> <span className="hero-stats-highlight">40+ Instituciones</span></span>
          </div>
        </div>
      </div>

      <div className="relative block">
        <div className="b2b-card">
          <div className="b2b-card-header">
            <span className="b2b-card-title">System_Status.log</span>
            <span className="b2b-card-status">Todos los sistemas operativos</span>
          </div>
          <div className="b2b-card-content">
            <div className="b2b-card-item">
              <div className="b2b-card-item-info">
                <div className="b2b-card-item-icon b2b-card-item-icon-blue">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                </div>
                <span className="b2b-card-item-text">Migración a DSpace 9.2</span>
              </div>
              <span className="b2b-card-item-status">Completado</span>
            </div>
            <div className="b2b-card-item">
              <div className="b2b-card-item-info">
                <div className="b2b-card-item-icon b2b-card-item-icon-amber">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <span className="b2b-card-item-text">Asignación de DOIs (2,400 registros)</span>
              </div>
              <span className="b2b-card-item-status">Completado</span>
            </div>
            <div className="b2b-card-item">
              <div className="b2b-card-item-info">
                <div className="b2b-card-item-icon b2b-card-item-icon-purple">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/></svg>
                </div>
                <span className="b2b-card-item-text">Validación OAI-PMH</span>
              </div>
              <span className="b2b-card-item-status">Completado</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}