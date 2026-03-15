import { Link } from "react-router-dom";
import heroBanner from "../assets/hero-banner.svg";
import crownIcon from "../assets/icon-crown.svg";
import razorIcon from "../assets/icon-razor.svg";
import scissorsIcon from "../assets/icon-scissors.svg";

function Header() {
  return (
    <header className="koc-hero" style={{ backgroundImage: `url(${heroBanner})` }}>
      <div className="koc-hero-overlay">
        <p className="koc-hero-eyebrow">Achieve Your Dream Style</p>
        <h1>Your Premium Barber Shop Experience</h1>
        <p className="koc-hero-description">
          Gestao premium para clientes exigentes. Organize agenda, vendas e operacao
          diaria com o mesmo nivel de excelencia do seu corte.
        </p>

        <div className="koc-hero-actions">
          <Link to="/agendamentos" className="koc-hero-button koc-hero-button-primary">
            Book Appointment
          </Link>
          <Link to="/servicos" className="koc-hero-button koc-hero-button-outline">
            View Services
          </Link>
        </div>

        <div className="koc-hero-cards">
          <article className="koc-hero-card">
            <img src={crownIcon} alt="Icone de coroa" />
            <h3>King Signature</h3>
            <p>Cortes premium com acabamento de precisao e estilo autoral.</p>
          </article>

          <article className="koc-hero-card">
            <img src={scissorsIcon} alt="Icone de tesoura" />
            <h3>Elite Team</h3>
            <p>Barbeiros especializados, agenda inteligente e fluxo organizado.</p>
          </article>

          <article className="koc-hero-card">
            <img src={razorIcon} alt="Icone de navalha" />
            <h3>Classic Ritual</h3>
            <p>Barba tradicional, produtos premium e experiencia completa.</p>
          </article>
        </div>
      </div>
    </header>
  );
}

export default Header;
