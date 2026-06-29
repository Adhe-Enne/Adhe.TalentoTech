import React, { useCallback, useState } from "react";

import useNotification from "../../hooks/selectors/useNotification";
import { isValidEmail, maxLength, minLength } from "../../utils/validators";
import ContactPageView from "./ContactPageView";

const ContactPage: React.FC = () => {
  const { setNotification } = useNotification();
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = useCallback(
    (e) => {
      e.preventDefault();
      const trimmedEmail: string = email.trim();
      const trimmedMsg: string = message.trim();

      if (!trimmedEmail) {
        setNotification("El correo electrónico es obligatorio", 3000, "warning");
        return;
      }
      if (!isValidEmail(trimmedEmail)) {
        setNotification("El formato del correo electrónico no es válido", 3000, "warning");
        return;
      }
      if (!trimmedMsg) {
        setNotification("El mensaje es obligatorio", 3000, "warning");
        return;
      }
      if (!minLength(trimmedMsg, 10)) {
        setNotification("El mensaje debe tener al menos 10 caracteres", 3000, "warning");
        return;
      }
      if (!maxLength(trimmedMsg, 1000)) {
        setNotification("El mensaje no debe exceder los 1000 caracteres", 3000, "warning");
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
