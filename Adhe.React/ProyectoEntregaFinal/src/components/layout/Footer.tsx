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
    <footer className="bg-gray-100 text-gray-800">
      <div className="bg-white py-8">
        <div className="max-w-[1100px] mx-auto px-4">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-4">
              <Link className="text-lg font-semibold inline-block mb-2 no-underline" to="/">
                Adhe.E-commerce
              </Link>
              <p className="text-muted mb-2">Tienda demo para proyecto educativo TalentoTech!.</p>
              <div aria-hidden className="social-icons flex gap-3">
                <a aria-label="GitHub" className="inline-flex items-center justify-center w-[50px] h-[50px] rounded-full border-2 border-cta text-cta hover:bg-cta hover:text-white transition-all" href="https://github.com/Adhe-enne" rel="noopener noreferrer" target="_blank">
                  <FaGithub aria-hidden="true" />
                </a>
                <a aria-label="Linkedin" className="inline-flex items-center justify-center w-[50px] h-[50px] rounded-full border-2 border-cta text-cta hover:bg-cta hover:text-white transition-all" href="https://www.linkedin.com/in/daniel-nina-dev/" rel="noopener noreferrer" target="_blank">
                  <FaLinkedin aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="col-span-6 md:col-span-2">
              <h6 className="mb-2">Navegación</h6>
              <ul className="list-none p-0 m-0 space-y-1">
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

            <div className="col-span-6 md:col-span-3">
              <h6 className="mb-2">Soporte</h6>
              <ul className="list-none p-0 m-0 space-y-1">
                <li>
                  <a href="mailto:ninadaniel_service@hotmail.com">ninadaniel_service@hotmail.com</a>
                </li>
              </ul>
            </div>

            <div className="col-span-12 md:col-span-3">
              <h6 className="mb-2">Newsletter</h6>
              <form className="footer-newsletter flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input aria-label="Email" className="px-3 py-1.5 border border-gray-300 rounded-full text-sm w-full" placeholder="Tu email" />
                <button aria-label="Suscribirse al newsletter" className="bg-accent text-white px-4 py-1.5 rounded-full text-sm hover:opacity-90 whitespace-nowrap" onClick={() => handleAction("¡Gracias por suscribirte!")} type="submit">
                  Suscribirse
                </button>
              </form>
              <small className="text-muted block mt-2 text-xs">Recibe novedades y ofertas exclusivas.</small>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 py-3 border-t border-gray-200">
        <div className="max-w-[1100px] mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-2">
          <small className="text-muted">© {new Date().getFullYear()} Adhe.E-commerce. Todos los derechos reservados.</small>
          <div className="flex gap-3 items-center">
            <Link aria-label="Términos y condiciones" className="text-muted hover:text-gray-700" onClick={() => handleAction("Go To 'Terminos' Success")} to="/">
              Términos
            </Link>
            <Link aria-label="Política de privacidad" className="text-muted hover:text-gray-700" onClick={() => handleAction("Go To 'Privacidad' Success")} to="/">
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
