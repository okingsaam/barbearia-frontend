function ServiceCard({ num, icon, title, desc, price, duration }) {
  return (
    <article className="service-card reveal" data-reveal>
      <div className="service-card-num">{num}</div>
      <img src={icon} alt={title} className="service-icon" />
      <h3 className="service-card-title">{title}</h3>
      <p className="service-card-desc">{desc}</p>
      <div className="service-card-footer">
        <div className="service-card-price">{price}</div>
        <div className="service-card-duration">{duration}</div>
      </div>
    </article>
  );
}

export default ServiceCard;
