import React from "react";

import TeamListContainer from "../team/TeamListContainer";
import HelmetMeta from "../ui/HelmetMeta";

interface ContactPageViewProps {
  email: string;
  message: string;
  onSubmit: React.SubmitEventHandler<HTMLFormElement>;
  onEmailChange: (value: string) => void;
  onMessageChange: (value: string) => void;
}

const ContactPageView: React.FC<ContactPageViewProps> = (props) => {
  const { email, message, onEmailChange, onMessageChange, onSubmit } = props;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <HelmetMeta description="Comunícate con nuestro equipo de Talento Tech." title="Talento Tech | Contacto" />
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-6">
          <div className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Contacto</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-3">
              Estamos para ayudarte, envía un email a <a className="text-cta hover:underline" href="mailto:soporte@example.com">soporte@example.com</a> y te responderemos a la brevedad.
            </p>
            <p className="text-sm text-gray-600 mb-3">Tel: +54 9 11 1234 5678</p>
            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                  Email
                </label>
                <input className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all duration-200" id="email" onChange={(e) => onEmailChange(e.target.value)} type="email" value={email} />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="message">
                  Mensaje
                </label>
                <textarea className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all duration-200" id="message" onChange={(e) => onMessageChange(e.target.value)} rows={4} value={message} />
              </div>
              <div className="flex gap-2">
                <button aria-label="Enviar mensaje" className="bg-brand text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-sm hover:bg-brand/90 hover:shadow-md active:scale-[0.98] transition-all duration-150" type="submit">
                  Enviar
                </button>
                <a aria-label="Enviar email a soporte" className="border border-brand/20 text-brand px-5 py-2.5 rounded-xl text-sm font-medium hover:border-brand/40 hover:bg-brand/5 transition-all duration-200" href="mailto:soporte@example.com">
                  Contacto por email
                </a>
              </div>
            </form>
          </div>
        </div>

        <div className="col-span-12 md:col-span-6">
          <TeamListContainer />
        </div>
      </div>
    </div>
  );
};

export default ContactPageView;
