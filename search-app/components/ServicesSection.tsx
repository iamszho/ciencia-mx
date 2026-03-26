export default function ServicesSection() {
  return (
    <section id="soluciones" className="services-section">
      <div className="services-header">
        <span className="services-label">Nuestros Servicios</span>
        <h2 className="services-title">Infraestructura de Clase Mundial</h2>
        <p className="services-description">Ofrecemos un catálogo completo de servicios técnicos para el ciclo de vida de la publicación científica.</p>
      </div>

        <div className="service-cards-grid">
        <div className="b2b-card group">
          <div className="b2b-card-icon b2b-card-icon-brand">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          </div>
          <h3 className="text-xl font-bold text-heading mb-2">Instalación DSpace / OJS</h3>
          <p className="text-sm text-muted mb-4">Implementación &quot;Llave en mano&quot; de repositorios y revistas. Incluye configuración de servidor, SSL, correos y diseño base.</p>
                 <div className="border-t border-white/5 pt-4 mt-auto">
                     <span className="text-xs font-mono text-brand group-hover:underline cursor-pointer badge-text">Ideal para: Nuevos Proyectos</span>
                 </div>
        </div>

        <div className="b2b-card p-8 rounded-xl group border-accent/30 relative overflow-hidden">
          <div className="service-card-badge">Más Solicitado</div>
          <div className="b2b-card-icon b2b-card-icon-accent">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
          </div>
          <h3 className="text-xl font-bold text-heading mb-2">Migración y Actualización</h3>
          <p className="text-sm text-muted mb-4">Movemos su información de versiones obsoletas (DSpace 5/6) a la moderna versión 9.x sin perder un solo metadato or handle.</p>
                 <div className="border-t border-white/5 pt-4 mt-auto">
                     <span className="text-xs font-mono text-red-400 group-hover:underline cursor-pointer badge-text">Ideal para: Modernización</span>
                 </div>
        </div>

        <div className="b2b-card group">
          <div className="b2b-card-icon b2b-card-icon-red">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <h3 className="text-xl font-bold text-heading mb-2">Rescate Técnico</h3>
          <p className="text-sm text-muted mb-4">¿Su repositorio arroja errores 500? ¿No cosecha? Realizamos un diagnóstico profundo y reparamos la base de datos o código.</p>
          <div className="border-t border-white/5 pt-4 mt-auto">
            <span className="text-xs font-mono text-red-400 group-hover:underline cursor-pointer badge-text">Ideal para: Emergencias</span>
          </div>
        </div>

        <div className="b2b-card group">
          <div className="b2b-card-icon b2b-card-icon-gray">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          </div>
          <h3 className="text-xl font-bold text-heading mb-2">Gestión Masiva de DOIs</h3>
          <p className="text-sm text-muted mb-4">Asignación retrospectiva de miles de DOIs. Automatizamos el registro en Crossref o DataCite para todo su acervo histórico.</p>
        </div>

        <div className="b2b-card group">
          <div className="b2b-card-icon b2b-card-icon-gray">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <h3 className="text-xl font-bold text-heading mb-2">Indexación Nacional</h3>
          <p className="text-sm text-muted mb-4">Conectamos su repositorio a la red Ciencia Abierta MX y otros agregadores para aumentar las citas de sus investigadores.</p>
        </div>

        <div className="b2b-card group">
          <div className="b2b-card-icon b2b-card-icon-gray">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          </div>
          <h3 className="text-xl font-bold text-heading mb-2">Auditoría & Capacitación</h3>
          <p className="text-sm text-muted mb-4">Entrenamos a su personal de biblioteca en el uso de DSpace/OJS y realizamos auditorías de preservación digital.</p>
        </div>
      </div>
    </section>
  );
}