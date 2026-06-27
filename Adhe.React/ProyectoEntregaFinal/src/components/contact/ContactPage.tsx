import React, { useCallback, useState } from "react";

import useNotification from "../../hooks/selectors/useNotification";
import ContactPageView from "./ContactPageView";

const ContactPage: React.FC = () => {
  const { setNotification } = useNotification();
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();
      if (!email || !message) {
        setNotification("Por favor completa el formulario", 3000, "warning");
        return;
      }
      setNotification("Mensaje enviado. Te contactaremos pronto.", 3000, "info");
      setEmail("");
      setMessage("");
    },
    [email, message, setNotification],
  );

  return <ContactPageView email={email} message={message} onEmailChange={setEmail} onMessageChange={setMessage} onSubmit={handleSubmit} />;
};

export default ContactPage;
