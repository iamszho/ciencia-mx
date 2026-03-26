import ContactForm from './ContactForm';

export default function ContactSection() {
  return (
    <section id="contacto" className="contacto-section">
      <div className="contacto-left">
        <h2 className="contacto-title">Inicie la conversación</h2>
        <p className="contacto-description">
          No somos un bot. Llene este formulario y un consultor técnico (no un vendedor) revisará su caso y le responderá en menos de 24 horas.
        </p>

        <div className="contacto-info">
          <div className="contacto-info-item">
            <div className="contacto-info-icon">✉️</div>
            <span>contacto@cienciaabierta.mx</span>
          </div>
          <div className="contacto-info-item">
            <div className="contacto-info-icon">🔒</div>
            <span>Contratos bajo NDA (Acuerdo de Confidencialidad) disponible.</span>
          </div>
        </div>
      </div>

      <ContactForm />
    </section>
  );
}