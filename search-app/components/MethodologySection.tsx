export default function MethodologySection() {
  return (
    <section id="metodologia" className="metodologia-section">
      <div className="metodologia-container">
        <h2 className="metodologia-title">Nuestro Proceso de Trabajo</h2>
        <div className="metodologia-steps">
          <div className="metodologia-step">
            <div className="metodologia-step-left">
              <div className="step-circle">1</div>
              <div className="metodologia-line"></div>
            </div>
            <div className="metodologia-step-content">
              <h4 className="metodologia-step-title">Diagnóstico y Cotización</h4>
              <p className="metodologia-step-text">Analizamos su infraestructura actual (servidor, versión de software, base de datos) y entregamos una propuesta técnica detallada con tiempos fijos.</p>
            </div>
          </div>
          <div className="metodologia-step">
            <div className="metodologia-step-left">
              <div className="step-circle step-circle-secondary">2</div>
              <div className="metodologia-line"></div>
            </div>
            <div className="metodologia-step-content">
              <h4 className="metodologia-step-title">Ejecución en Entorno de Pruebas</h4>
              <p className="metodologia-step-text">Nunca tocamos su servidor en producción directamente. Creamos un espejo, realizamos la migración/reparación y validamos con usted.</p>
            </div>
          </div>
          <div className="metodologia-step">
            <div className="metodologia-step-left">
              <div className="step-circle step-circle-secondary">3</div>
            </div>
            <div className="metodologia-step-content">
              <h4 className="metodologia-step-title">Puesta en Marcha y Garantía</h4>
              <p className="metodologia-step-text">Desplegamos la solución final y ofrecemos 30 días de soporte técnico post-implementación para asegurar estabilidad.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}