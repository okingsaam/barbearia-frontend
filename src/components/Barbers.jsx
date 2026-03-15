import BarberCard from "./BarberCard";
import SectionDivider from "./SectionDivider";

const BARBERS = [
  {
    initials: "RJ",
    name: "Rafael Júnior",
    specialty: "Especialista em Fade",
    badge: "Barbeiro Sênior",
    bio: "Com mais de 8 anos dominando a arte do fade, Rafael traz precisão e talento a cada corte.",
    years: "8",
    gradient: "linear-gradient(160deg, #2c2416 0%, #1a1a1a 100%)",
  },
  {
    initials: "MC",
    name: "Marcos Costa",
    specialty: "Clássico & Barba",
    badge: "Especialista em Navalha",
    bio: "Reconhecido pelo barbear preciso com navalha e técnicas tradicionais combinadas ao estilo moderno.",
    years: "10",
    gradient: "linear-gradient(160deg, #1e2218 0%, #1a1a1a 100%)",
  },
  {
    initials: "LF",
    name: "Lucas Ferreira",
    specialty: "Cortes com Textura",
    badge: "Especialista em Estilo",
    bio: "Especializado em cabelos texturizados e cacheados, Lucas cria formas ousadas que fazem declarações.",
    years: "6",
    gradient: "linear-gradient(160deg, #1e1822 0%, #1a1a1a 100%)",
  },
];

function Barbers() {
  return (
    <>
      <SectionDivider />
      <section id="barbers" className="barbers-section">
        <div className="landing-container">
          <div className="section-title-wrap reveal" data-reveal>
            <span className="section-tag">A Equipe</span>
            <h2 className="section-title light">Barbeiros Especialistas</h2>
            <p className="section-subtitle light">
              Profissionais altamente qualificados dedicados a oferecer o melhor estilo para você.
            </p>
          </div>

          <div className="barbers-grid">
            {BARBERS.map((b) => (
              <div key={b.name} className="barber-card-flat reveal" data-reveal>
                <div className="barber-avatar-circle">{b.initials}</div>
                <div className="barber-avatar-badge" style={{ position: "static", display: "inline-block", marginBottom: "12px" }}>{b.badge}</div>
                <h3 className="barber-name" style={{ textAlign: "center" }}>{b.name}</h3>
                <p className="barber-specialty">{b.specialty}</p>
                <div className="barber-divider" />
                <p className="barber-bio">{b.bio}</p>
                <p className="barber-years"><span>{b.years}+</span> anos de experiência</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Barbers;
