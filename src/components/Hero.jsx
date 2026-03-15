import { useEffect, useState } from "react";
import heroPng from "../assets/hero.png";

function Hero() {
  const [parallaxOffset, setParallaxOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setParallaxOffset(Math.min(window.scrollY * 0.08, 36));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="hero-section"
      style={{
        backgroundImage: `url(${heroPng})`,
        backgroundPosition: `center calc(50% + ${parallaxOffset}px)`,
      }}
    >
      <div className="hero-ambient" aria-hidden="true" />
      <div className="hero-lines" aria-hidden="true" />
      <div className="hero-overlay" />
      <div className="hero-shape" aria-hidden="true" />

      <div className="hero-content">
        <p className="hero-eyebrow">Conquiste o Estilo dos Seus Sonhos</p>

        <h1 className="hero-title">
          KING OF <span className="gold">CUT</span>
        </h1>

        <p className="hero-tagline">A EXPERIÊNCIA PREMIUM EM BARBEARIA</p>

        <p className="hero-desc">
          Cortes profissionais e cuidados com a barba para o homem moderno.
          Onde tradição encontra estilo e precisão.
        </p>

        <div className="hero-actions">
          <button className="btn-gold" onClick={() => scrollTo("booking")}>
            Agendar Horário
          </button>
          <button className="btn-outline-white" onClick={() => scrollTo("services")}>
            Ver Serviços
          </button>
        </div>
      </div>

      <div className="hero-stats">
        <div>
          <div className="hero-stat-number">12+</div>
          <div className="hero-stat-label">Anos de Experiência</div>
        </div>
        <div>
          <div className="hero-stat-number">5k+</div>
          <div className="hero-stat-label">Clientes Satisfeitos</div>
        </div>
        <div>
          <div className="hero-stat-number">4</div>
          <div className="hero-stat-label">Barbeiros Especialistas</div>
        </div>
      </div>

      <button
        className="hero-scroll-btn"
        onClick={() => scrollTo("services")}
        aria-label="Rolar para serviços"
      >
        <div className="hero-scroll-line" />
      </button>
    </section>
  );
}

export default Hero;
