import crownIcon from "../assets/icon-crown.svg";

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

const NAV_LINKS = [
  { label: "Início",      id: "home" },
  { label: "Serviços",    id: "services" },
  { label: "Barbeiros",   id: "barbers" },
  { label: "Preços",      id: "pricing" },
  { label: "Agendar",     id: "booking" },
];

const SERVICE_LINKS = [
  "Corte de Cabelo",
  "Aparar Barba",
  "Barba com Navalha",
  "Corte + Barba",
  "Corte Infantil",
];

function Footer() {
  return (
    <footer id="contact" className="l-footer">
      <div className="landing-container reveal" data-reveal>
        <div className="l-footer-grid">

          {/* Brand column */}
          <div className="l-footer-brand">
            <div className="l-footer-logo">
              <img src={crownIcon} alt="King of Cut" />
              <span className="l-footer-logo-name">King of Cut</span>
            </div>
            <p className="l-footer-tagline">
              A experiência premium em barbearia. Onde tradição encontra arte moderna
              e cada cliente sai se sentindo realeza.
            </p>
            <div className="l-footer-social">
              <a href="#" className="l-footer-social-link" aria-label="Instagram">IG</a>
              <a href="#" className="l-footer-social-link" aria-label="Facebook">FB</a>
              <a href="#" className="l-footer-social-link" aria-label="WhatsApp">WA</a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="l-footer-col-title">Navegação</p>
            <ul className="l-footer-links">
              {NAV_LINKS.map(({ label, id }) => (
                <li key={id}>
                  <button
                    className="l-footer-link"
                    onClick={() => scrollTo(id)}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p className="l-footer-col-title">Serviços</p>
            <ul className="l-footer-links">
              {SERVICE_LINKS.map((s) => (
                <li key={s}>
                  <span className="l-footer-link">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="l-footer-col-title">Contato</p>
            <ul className="l-footer-links" style={{ gap: "14px" }}>
              <li>
                <span
                  className="l-footer-link"
                  style={{ cursor: "default", lineHeight: "1.6" }}
                >
                  Av. Almirante Marques de Leão, 348<br />
                  Barra — Salvador, BA
                </span>
              </li>
              <li><span className="l-footer-link">(11) 99999-0000</span></li>
              <li><span className="l-footer-link">contato@kingofcut.com.br</span></li>
              <li>
                <span
                  className="l-footer-link"
                  style={{ cursor: "default", color: "#444" }}
                >
                  Seg – Sáb · 9h – 19h
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="l-footer-divider" />

        <div className="l-footer-bottom">
          <p className="l-footer-copyright">
            © {new Date().getFullYear()}{" "}
            <span className="gold">King of Cut</span>.
            Todos os direitos reservados.
          </p>
          <div className="l-footer-policies">
            <a href="#" className="l-footer-policy">Política de Privacidade</a>
            <a href="#" className="l-footer-policy">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
