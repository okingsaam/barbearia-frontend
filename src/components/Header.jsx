import { Link } from "react-router-dom";
import heroBanner from "../assets/hero-banner.svg";
import crownIcon from "../assets/icon-crown.svg";
import razorIcon from "../assets/icon-razor.svg";
import scissorsIcon from "../assets/icon-scissors.svg";

function Header() {
  return (
    <header className="koc-hero" style={{ backgroundImage: `url(${heroBanner})` }}>
      <div className="koc-hero-overlay">
        <p className="koc-hero-eyebrow">Alcance seu Estilo Perfeito</p>
        <h1>Sua Experiência Premium em Barbearia</h1>
        <p className="koc-hero-description">
          Gestao premium para clientes exigentes. Organize agenda, vendas e operacao
          diaria com o mesmo nivel de excelencia do seu corte.
        </p>

        <div className="koc-hero-actions">
          <Link to="/agendamentos" className="koc-hero-button koc-hero-button-primary">
            Agendar Horário
          </Link>
          <Link to="/servicos" className="koc-hero-button koc-hero-button-outline">
            Ver Serviços
          </Link>
        </div>

        <div className="koc-hero-cards">
          <article className="koc-hero-card">
            <img src={crownIcon} alt="Icone de coroa" />
            <h3>Assinatura King</h3>
            <p>Cortes premium com acabamento de precisao e estilo autoral.</p>
          </article>

          <article className="koc-hero-card">
            <img src={scissorsIcon} alt="Icone de tesoura" />
            <h3>Time Estelar</h3>
            <p>Barbeiros especializados, agenda inteligente e fluxo organizado.</p>
          </article>

          <article className="koc-hero-card">
            <img src={razorIcon} alt="Icone de navalha" />
            <h3>Ritual Clássico</h3>
            <p>Barba tradicional, produtos premium e experiencia completa.</p>
          </article>
        </div>
      </div>
    </header>
  );
}

export default Header;
