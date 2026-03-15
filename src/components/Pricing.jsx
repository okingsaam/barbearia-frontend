import PricingCard from "./PricingCard";
import SectionDivider from "./SectionDivider";

const PLANS = [
  {
    title: "Clássico",
    desc: "Ideal para manutenção regular e estilos intemporais.",
    price: "45",
    items: [
      "Corte de cabelo (qualquer estilo)",
      "Acabamento com toalha quente",
      "Lavagem e secagem",
      "Consultoria de estilo",
    ],
    featured: false,
  },
  {
    title: "Corte do Rei",
    desc: "A experiência completa de grooming da King of Cut.",
    price: "75",
    items: [
      "Corte + Barba combo",
      "Barbear tradicional com navalha",
      "Lavagem e condicionamento",
      "Finalização profissional",
      "Bebida cortesia",
    ],
    featured: true,
  },
  {
    title: "Barba Real",
    desc: "Entregue-se ao ultimate ritual de barbear com navalha.",
    price: "55",
    items: [
      "Barbear com navalha tradicional",
      "Tratamento com toalha quente",
      "Massagem com óleo de pré-barba",
      "Bálsamo pós-barba",
    ],
    featured: false,
  },
];

function Pricing() {
  const scrollToBooking = () => {
    document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <SectionDivider />
      <section id="pricing" className="pricing-section">
        <div className="landing-container">
          <div className="section-title-wrap reveal" data-reveal>
            <span className="section-tag" style={{ color: "#d4af37" }}>
              Preços Transparentes
            </span>
            <h2 className="section-title dark">Nossos Preços</h2>
            <p className="section-subtitle">
              Preços justos e transparentes, sem taxas ocultas. Qualidade em que você sempre pode confiar.
            </p>
          </div>

          <div className="pricing-grid">
            {PLANS.map((plan) => (
              <PricingCard key={plan.title} {...plan} onBook={scrollToBooking} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Pricing;
