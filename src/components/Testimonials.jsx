import TestimonialCard from "./TestimonialCard";
import SectionDivider from "./SectionDivider";

const TESTIMONIALS = [
  {
    stars: 5,
    text: "A melhor experiência de barbearia que já tive. O fade do Rafael é absolutamente inigualável — venho aqui há 3 anos e nunca vou em outro lugar.",
    name: "André Oliveira",
    role: "Cliente Fiel",
    initials: "AO",
  },
  {
    stars: 5,
    text: "O barbear com navalha é uma experiência única. O ambiente, a atenção aos detalhes, os produtos premium — a King of Cut está em uma classe completamente própria.",
    name: "Carlos Mendes",
    role: "Cliente Premium",
    initials: "CM",
  },
  {
    stars: 5,
    text: "Viajo 30 km só para cortar o cabelo aqui. A equipe é altamente qualificada, sempre profissional, e o resultado é exatamente o que peço — todas as vezes.",
    name: "Thiago Santos",
    role: "Cliente VIP",
    initials: "TS",
  },
];

function Testimonials() {
  return (
    <>
      <SectionDivider />
      <section id="testimonials" className="testimonials-section">
        <div className="landing-container">
          <div className="section-title-wrap reveal" data-reveal>
            <span className="section-tag">Avaliações</span>
            <h2 className="section-title light">O Que Nossos Clientes Dizem</h2>
            <p className="section-subtitle light">
              Nosso trabalho fala por si — mas nossos clientes falam mais alto.
            </p>
          </div>

          <div className="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.name} {...t} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Testimonials;
