import React from "react";
import { Col, Container, Row } from "react-bootstrap";

import TeamList from "../team/TeamList";
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
    <Container className="py-4">
      <HelmetMeta description="Comunícate con nuestro equipo de Talento Tech." title="Talento Tech | Contacto" />
      <Row className="gx-4 gy-4 justify-content-center align-items-start">
        <Col md={6} xs={12}>
          <div className="card p-3">
            <h2 className="mb-2">Contacto</h2>
            <p>
              Estamos para ayudarte, envía un email a <a href="mailto:soporte@example.com">soporte@example.com</a> y te responderemos a la brevedad.
            </p>
            <p>Tel: +54 9 11 1234 5678</p>
            <form onSubmit={onSubmit}>
              <div className="mb-2">
                <label className="form-label" htmlFor="email">
                  Email
                </label>
                <input className="form-control" id="email" onChange={(e) => onEmailChange(e.target.value)} type="email" value={email} />
              </div>
              <div className="mb-2">
                <label className="form-label" htmlFor="message">
                  Mensaje
                </label>
                <textarea className="form-control" id="message" onChange={(e) => onMessageChange(e.target.value)} rows={4} value={message} />
              </div>
              <div className="d-flex gap-2">
                <button aria-label="Enviar mensaje" className="btn btn-cta" type="submit">
                  Enviar
                </button>
                <a aria-label="Enviar email a soporte" className="btn btn-ghost" href="mailto:soporte@example.com">
                  Contacto por email
                </a>
              </div>
            </form>
          </div>
        </Col>

        <Col md={6} xs={12}>
          <TeamList />
        </Col>
      </Row>
    </Container>
  );
};

export default ContactPageView;
