import React from "react";
import { Link } from "react-router-dom";

import useAuth from "../../../hooks/useAuth";
import useNotification from "../../../hooks/useNotification";

const Footer: React.FC = () => {
  const { isAdmin } = useAuth();
  const { setNotification } = useNotification();

  const HandleAction: (message: string) => void = (message: string): void => {
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
                  <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.787.605-3.375-1.343-3.375-1.343-.455-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.004.07 1.532 1.032 1.532 1.032.892 1.528 2.341 1.086 2.91.83.092-.644.35-1.086.636-1.336-2.22-.252-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.03-2.681-.103-.253-.447-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6c.85.004 1.705.114 2.504.335 1.91-1.294 2.75-1.025 2.75-1.025.546 1.377.202 2.404.099 2.647.64.697 1.028 1.59 1.028 2.681 0 3.842-2.337 4.687-4.565 4.935.36.31.68.923.68 1.86v2c0 .267.18.577.688.479A10.012 10.012 0 0022 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </a>
                <a
                  aria-label="Linkedin"
                  className="btn btn-outline-primary btn-lg rounded-circle"
                  href="https://www.linkedin.com/in/daniel-nina-dev/"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <svg fill="currentColor" height="24" viewBox="0 0 24 24" width="24">
                    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5V24H0V8zm7.5 0h4.78v2.16h.07c.67-1.27 2.3-2.6 4.74-2.6C21.5 7.56 24 9.5 24 13.72V24h-5v-9.5c0-2.27-.91-3.81-2.91-3.81-1.58 0-2.52 1.06-2.93 2.09-.15.36-.19.86-.19 1.36V24H7.5V8z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="col-6 col-md-2">
              <h6 className="mb-2">Navegación</h6>
              <ul className="list-unstyled footer-links mb-0">
                <li>
                  <Link to="/productos">Productos</Link>
                </li>
                <li>
                  <Link to="/contacto">Contacto</Link>
                </li>
                <li>
                  <Link to="/carrito">Carrito</Link>
                </li>
              </ul>
            </div>

            <div className="col-6 col-md-3">
              <h6 className="mb-2">Soporte</h6>
              <ul className="list-unstyled footer-links mb-0">
                <li>
                  <a href="mailto:ninadaniel_service@hotmail.com">ninadaniel_service@hotmail.com</a>
                </li>
                {isAdmin && (
                  <li>
                    <Link to="/admin/productos/nuevo">Nuevo producto</Link>
                  </li>
                )}
              </ul>
            </div>

            <div className="col-12 col-md-3">
              <h6 className="mb-2">Newsletter</h6>
              <form className="d-flex footer-newsletter" onSubmit={(e) => e.preventDefault()}>
                <input aria-label="Email" className="form-control form-control-sm" placeholder="Tu email" />
                <button className="btn btn-cta btn-sm ms-2" onClick={() => HandleAction("¡Gracias por suscribirte!")} type="submit">
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
            <Link className="text-muted" onClick={() => HandleAction("Go To 'Terminos' Success")} to="/">
              Términos
            </Link>
            <Link className="text-muted" onClick={() => HandleAction("Go To 'Privacidad' Success")} to="/">
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
