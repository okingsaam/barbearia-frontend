function PricingCard({ title, desc, price, items, featured, onBook }) {
  return (
    <div className={`pricing-card${featured ? " featured" : ""} reveal`} data-reveal>
      {featured && <div className="pricing-card-badge">Mais Popular</div>}

      <h3 className="pricing-card-title">{title}</h3>
      <p className="pricing-card-desc">{desc}</p>

      <div className="pricing-price-wrap">
        <span className="pricing-currency">R$</span>
        <span className="pricing-amount">{price}</span>
      </div>

      <ul className="pricing-items">
        {items.map((item) => (
          <li key={item} className="pricing-item">
            <span className="pricing-item-check">✓</span>
            {item}
          </li>
        ))}
      </ul>

      <button
        className={`pricing-cta ${featured ? "gold" : "dark"}`}
        onClick={onBook}
      >
        Agendar
      </button>
    </div>
  );
}

export default PricingCard;
