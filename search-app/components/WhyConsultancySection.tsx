export default function WhyConsultancySection() {
  return (
    <section id="casos" className="casos-section">
      <div className="casos-container">
        <h2 className="casos-title">¿Por qué contratar una consultoría externa?</h2>
        <div className="casos-grid">
          <div className="casos-item">
            <div className="casos-icon">📚</div>
            <h3 className="casos-item-title">Hablamos &quot;Bibliotecario&quot;</h3>
            <p className="casos-item-text">Entendemos la diferencia entre Dublin Core y MARC21. No somos solo programadores.</p>
          </div>
          <div className="casos-item">
            <div className="casos-icon">⚡</div>
            <h3 className="casos-item-title">Sin Curva de Aprendizaje</h3>
            <p className="casos-item-text">Su equipo de TI tiene otras prioridades. Nosotros vivimos y respiramos DSpace y OJS.</p>
          </div>
          <div className="casos-item">
            <div className="casos-icon">🏛️</div>
            <h3 className="casos-item-title">Cumplimiento Normativo</h3>
            <p className="casos-item-text">Garantizamos que su repositorio cumpla con los estándares de interoperabilidad nacionales.</p>
          </div>
        </div>
      </div>
    </section>
  );
}