import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import crownIcon from "../assets/icon-crown.svg";

const NAV_LINKS = [
  { label: "Início",       section: "home" },
  { label: "Serviços",     section: "services" },
  { label: "Barbeiros",    section: "barbers" },
  { label: "Preços",       section: "pricing" },
  { label: "Agendamento",  section: "booking" },
  { label: "Contato",      section: "contact" },
];

function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive]     = useState("home");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);

      // Track active section by scroll position
      const sections = NAV_LINKS.map((l) => l.section).concat(["contact"]);
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(sections[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (section) => {
    scrollTo(section);
    setMenuOpen(false);
  };

  return (
    <nav
      className={`l-nav${scrolled ? " scrolled" : ""}`}
      aria-label="Navegação principal"
    >
      {/* Brand */}
      <a
        href="#home"
        className="l-nav-brand"
        onClick={(e) => { e.preventDefault(); handleNav("home"); }}
      >
        <img src={crownIcon} alt="King of Cut" className="l-nav-brand-icon" />
        <div className="l-nav-brand-text">
          <span className="l-nav-brand-name">King of Cut</span>
          <span className="l-nav-brand-sub">Barbearia Premium</span>
        </div>
      </a>

      {/* Desktop links */}
      <ul className={`l-nav-links${menuOpen ? " open" : ""}`}>
        {NAV_LINKS.map(({ label, section }) => (
          <li key={section}>
            <button
              className={`l-nav-link${active === section ? " active" : ""}`}
              onClick={() => handleNav(section)}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>

      {/* Right actions */}
      <div className="l-nav-right">
        <button className="l-nav-cta" onClick={() => handleNav("booking")}>
          Agendar
        </button>
        <Link to="/clientes" className="l-nav-admin">
          Admin ↗
        </Link>
        <button
          className="l-nav-mobile-toggle"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Abrir menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

