import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => (
  <footer className="site-footer">
    <div className="footer-top py-5">
      <div className="container container-tight">
        <div className="row gy-4">
          <div className="col-12 col-md-4">
            <Link className="footer-brand h5 d-inline-block mb-2" to="/">
              E-commerce
            </Link>
            <p className="footer-desc text-muted mb-2">Tienda demo para proyecto educativo TalentoTech!.</p>
            <div aria-hidden className="social-icons d-flex gap-2">
              <a aria-label="Twitter" className="btn btn-ghost btn-sm" href="/">
                <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
                  <path d="M22 5.92c-.64.28-1.32.48-2.04.56.73-.44 1.28-1.16 1.54-2.02-.68.4-1.44.68-2.24.84C18.6 4.24 17.3 3.6 15.86 3.6c-2.44 0-4.42 1.98-4.42 4.42 0 .34.04.68.12 1C7.7 9.06 5.07 7.44 3.4 5c-.38.66-.6 1.44-.6 2.26 0 1.56.8 2.94 2.02 3.74-.6 0-1.16-.18-1.64-.46v.04c0 2.18 1.56 4 3.64 4.42-.34.1-.7.14-1.06.14-.26 0-.52-.02-.78-.07.52 1.62 2.06 2.8 3.9 2.84-1.44 1.12-3.26 1.8-5.24 1.8-.34 0-.68-.02-1.02-.06 1.86 1.18 4.06 1.86 6.44 1.86 7.72 0 11.94-6.4 11.94-11.94v-.54c.82-.62 1.52-1.38 2.08-2.24-.76.34-1.6.56-2.46.66z" />
                </svg>
              </a>
              <a aria-label="Instagram" className="btn btn-ghost btn-sm" href="/">
                <svg fill="currentColor" height="16" viewBox="0 0 24 24" width="16">
                  <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 6.2a4.8 4.8 0 1 0 0 9.6 4.8 4.8 0 0 0 0-9.6zM19.5 6.6a1.1 1.1 0 1 1-2.2 0 1.1 1.1 0 0 1 2.2 0z" />
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
                <a href="mailto:soporte@example.com">soporte@example.com</a>
              </li>
              <li>
                <Link to="/new">Nuevo producto</Link>
              </li>
            </ul>
          </div>

          <div className="col-12 col-md-3">
            <h6 className="mb-2">Newsletter</h6>
            <form className="d-flex footer-newsletter" onSubmit={(e) => e.preventDefault()}>
              <input aria-label="Email" className="form-control form-control-sm" placeholder="Tu email" />
              <button className="btn btn-cta btn-sm ms-2" type="submit">
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
        <small className="text-muted">© {new Date().getFullYear()} E-commerce. Todos los derechos reservados.</small>
        <div className="d-flex gap-3 align-items-center">
          <Link className="text-muted" to="/terminos">
            Términos
          </Link>
          <Link className="text-muted" to="/privacidad">
            Privacidad
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
