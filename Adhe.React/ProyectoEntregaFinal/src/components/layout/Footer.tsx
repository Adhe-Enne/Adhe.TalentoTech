import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";

import useNotification from "../../hooks/selectors/useNotification";

const Footer: React.FC = () => {
  const { setNotification } = useNotification();

  const handleAction: (message: string) => void = (message: string): void => {
    setNotification(`${message} (Dummy Notification)`, 3000, "success");
  };

  return (
    <footer className="site-footer">
      <div className="footer-top py-5">
        <div className="container container-tight">
          <div className="row gy-4">
            <div className="col-12 col-md-4">
              <Link className="footer-brand h5 d-inline-block mb-2" to="/">
                Adhe.E-commerce
              </Link>
              <p className="footer-desc text-muted mb-2">Tienda demo para proyecto educativo TalentoTech!.</p>
              <div aria-hidden className="social-icons d-flex gap-3">
                <a aria-label="GitHub" className="btn btn-outline-primary btn-lg rounded-circle" href="https://github.com/Adhe-enne" rel="noopener noreferrer" target="_blank">
                  <FaGithub aria-hidden="true" />
                </a>
                <a aria-label="Linkedin" className="btn btn-outline-primary btn-lg rounded-circle" href="https://www.linkedin.com/in/daniel-nina-dev/" rel="noopener noreferrer" target="_blank">
                  <FaLinkedin aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="col-6 col-md-2">
              <h6 className="mb-2">Navegación</h6>
              <ul className="list-unstyled footer-links mb-0">
                <li>
                  <Link aria-label="Ir a productos" to="/productos">
                    Productos
                  </Link>
                </li>
                <li>
                  <Link aria-label="Ir a contacto" to="/contacto">
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link aria-label="Ir al carrito" to="/carrito">
                    Carrito
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-6 col-md-3">
              <h6 className="mb-2">Soporte</h6>
              <ul className="list-unstyled footer-links mb-0">
                <li>
                  <a href="mailto:ninadaniel_service@hotmail.com">ninadaniel_service@hotmail.com</a>
                </li>
              </ul>
            </div>

            <div className="col-12 col-md-3">
              <h6 className="mb-2">Newsletter</h6>
              <form className="d-flex footer-newsletter" onSubmit={(e) => e.preventDefault()}>
                <input aria-label="Email" className="form-control form-control-sm" placeholder="Tu email" />
                <button aria-label="Suscribirse al newsletter" className="btn btn-cta btn-sm ms-2" onClick={() => handleAction("¡Gracias por suscribirte!")} type="submit">
                  Suscribirse
                </button>
              </form>
              <small className="text-muted d-block mt-2">Recibe novedades y ofertas exclusivas.</small>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom py-3 border-top">
        <div className="container container-tight d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <small className="text-muted">© {new Date().getFullYear()} Adhe.E-commerce. Todos los derechos reservados.</small>
          <div className="d-flex gap-3 align-items-center">
            <Link aria-label="Términos y condiciones" className="text-muted" onClick={() => handleAction("Go To 'Terminos' Success")} to="/">
              Términos
            </Link>
            <Link aria-label="Política de privacidad" className="text-muted" onClick={() => handleAction("Go To 'Privacidad' Success")} to="/">
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
