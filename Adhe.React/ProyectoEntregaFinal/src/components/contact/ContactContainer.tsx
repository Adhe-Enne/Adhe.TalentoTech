import React, { useState } from "react";

import useNotification from "../../hooks/useNotification";
import ContactPage from "./ContactPage";

const ContactContainer: React.FC = () => {
  const { setNotification } = useNotification();
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!email || !message) {
      setNotification("Por favor completa el formulario", 3000, "warning");
      return;
    }
    setNotification("Mensaje enviado. Te contactaremos pronto.", 3000, "info");
    setEmail("");
    setMessage("");
  };

  return <ContactPage email={email} message={message} onEmailChange={setEmail} onMessageChange={setMessage} onSubmit={handleSubmit} />;
};

export default ContactContainer;
