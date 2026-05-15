import React from "react";

const Contacto: React.FC = () => {
  return (
    <div className="container py-4">
      <h2>Contacto</h2>
      <p>
        Estamos para ayudarte. Envía un email a <a href="mailto:soporte@example.com">soporte@example.com</a>.
      </p>
      <p>Tel: +54 9 11 1234 5678</p>
    </div>
  );
};

export default Contacto;
