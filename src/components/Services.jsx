import ServiceCard from "./ServiceCard";
import SectionDivider from "./SectionDivider";
import scissorsIcon from "../assets/icon-scissors.svg";
import razorIcon from "../assets/icon-razor.svg";
import crownIcon from "../assets/icon-crown.svg";

const SERVICES = [
  {
    icon: scissorsIcon,
    num: "01",
    title: "Corte de Cabelo",
    desc: "Corte profissional adaptado ao seu estilo e formato de rosto. Do clássico ao contemporâneo.",
    price: "R$ 45",
    duration: "30 MIN",
  },
  {
    icon: razorIcon,
    num: "02",
    title: "Aparar Barba",
    desc: "Modelagem e acabamento de barba com linhas precisas e definidas para complementar o seu visual.",
    price: "R$ 35",
    duration: "20 MIN",
  },
  {
    icon: razorIcon,
    num: "03",
    title: "Barba com Navalha",
    desc: "Barbear tradicional com navalha, toalha quente e óleos premium de pré-barba. Um ritual puro.",
    price: "R$ 55",
    duration: "45 MIN",
  },
  {
    icon: crownIcon,
    num: "04",
    title: "Corte + Barba",
    desc: "Pacote completo de cuidados — corte de precisão, escultura de barba e finalização perfeita.",
    price: "R$ 75",
    duration: "60 MIN",
  },
];

function Services() {
  return (
    <>
      <SectionDivider />
      <section id="services" className="services-section">
        <div className="landing-container">
          <div className="section-title-wrap reveal" data-reveal>
            <span className="section-tag">O Que Oferecemos</span>
            <h2 className="section-title light">Serviços Premium</h2>
            <p className="section-subtitle light">
              Cada serviço é elaborado com precisão e cuidado, utilizando apenas os melhores produtos.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 48px" }}>
          <div className="services-grid">
            {SERVICES.map((s) => (
              <ServiceCard key={s.title} {...s} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Services;
