function TestimonialCard({ stars, text, name, role, initials }) {
  return (
    <article className="testimonial-card reveal" data-reveal>
      <div className="testimonial-quote-mark">"</div>

      <div className="testimonial-stars">
        {Array.from({ length: stars }).map((_, i) => (
          <span key={i} className="testimonial-star">★</span>
        ))}
      </div>

      <p className="testimonial-text">{text}</p>

      <div className="testimonial-author">
        <div className="testimonial-avatar">{initials}</div>
        <div>
          <div className="testimonial-name">{name}</div>
          <div className="testimonial-role">{role}</div>
        </div>
      </div>
    </article>
  );
}

export default TestimonialCard;
