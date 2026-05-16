import React, { useState } from "react";

import { useNotification } from "../../hooks/useNotification";
import DirectorioContainer from "./DirectorioContainer";

const Contacto: React.FC = () => {
  const { setNotification } = useNotification();
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!email || !message) {
      setNotification("Por favor completa el formulario", 3000, "warning");
      return;
    }
    // Simular envío
    setNotification("Mensaje enviado. Te contactaremos pronto.", 3000, "info");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="container py-4">
      <div className="row gx-4 gy-4 justify-content-center">
        <div className="col-12 col-md-7">
          <div className="card p-3">
            <h2 className="mb-2">Contacto</h2>
            <p>
              Estamos para ayudarte, envía un email a <a href="mailto:soporte@example.com">soporte@example.com</a> y te
              responderemos a la brevedad.
            </p>
            <p>Tel: +54 9 11 1234 5678</p>
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <input
                  className="form-control"
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  value={email}
                />
              </div>
              <div className="mb-2">
                <label className="form-label" htmlFor="message">
                  Mensaje
                </label>
                <textarea
                  className="form-control"
                  id="message"
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  value={message}
                />
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-cta" type="submit">
                  Enviar
                </button>
                <a className="btn btn-ghost" href="mailto:soporte@example.com">
                  Contacto por email
                </a>
              </div>
            </form>
          </div>
        </div>

        <div className="col-12 col-md-5">
          <h3 className="mb-2">Equipo</h3>
          <DirectorioContainer />
        </div>
      </div>
    </div>
  );
};

export default Contacto;
