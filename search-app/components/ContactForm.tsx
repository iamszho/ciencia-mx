'use client';

import emailjs from '@emailjs/browser';
import { useRef, useState } from 'react';

const ContactForm = () => {
  const form = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    if (form.current) {
      emailjs
        .sendForm(
          'service_qechvf6', // Replace with your EmailJS service ID
          'template_c5bdntw', // Replace with your EmailJS template ID
          form.current,
          'BRULxk71p7ID6gamQ' // Replace with your EmailJS public key
        )
        .then(
          (result) => {
            console.log(result.text);
            setMessage('Mensaje enviado exitosamente!');
            form.current?.reset();
          },
          (error) => {
            console.log(error.text);
            setMessage('Error al enviar el mensaje. Inténtalo de nuevo.');
          }
        )
        .finally(() => {
          setIsSending(false);
        });
    }
  };

  return (
    <form ref={form} onSubmit={sendEmail} className="contact-form">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Nombre</label>
          <input type="text" name="nombre" className="w-full bg-obsidian border border-white/10 rounded p-3 text-white focus:border-brand focus:outline-none transition-colors" required />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Institución</label>
          <input type="text" name="institucion" className="w-full bg-obsidian border border-white/10 rounded p-3 text-white focus:border-brand focus:outline-none transition-colors" required />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Correo Electrónico</label>
        <input type="email" name="correo" className="w-full bg-obsidian border border-white/10 rounded p-3 text-white focus:border-brand focus:outline-none transition-colors" required />
      </div>

      <div className="mb-6">
        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">¿Cómo podemos ayudarle?</label>
        <select name="ayuda" className="w-full bg-obsidian border border-white/10 rounded p-3 text-gray-300 focus:border-brand focus:outline-none transition-colors" required>
          <option>Necesito instalar DSpace / OJS</option>
          <option>Quiero migrar/actualizar mi repositorio</option>
          <option>Tengo errores técnicos urgentes</option>
          <option>Necesito DOIs masivos</option>
          <option>Interés en Indexación</option>
        </select>
      </div>

      <button type="submit" disabled={isSending} className="w-full bg-gradient-to-r from-brand to-blue-600 text-white font-bold py-4 rounded hover:shadow-glow transition-all disabled:opacity-50">
        {isSending ? 'Enviando...' : 'Solicitar Cotización'}
      </button>
      {message && <p className="text-center mt-4 text-sm">{message}</p>}
      <p className="text-xs text-center text-gray-600 mt-4">Sus datos están protegidos. Respuesta en &lt; 24 hrs.</p>
    </form>
  );
};

export default ContactForm;