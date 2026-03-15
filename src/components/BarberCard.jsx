function BarberCard({ initials, name, specialty, badge, bio, years, gradient }) {
  return (
    <article className="barber-card">
      <div className="barber-avatar" style={{ background: gradient }}>
        <span className="barber-avatar-initial">{initials}</span>
        <div className="barber-avatar-overlay" />
        <span className="barber-avatar-badge">{badge}</span>
      </div>
      <div className="barber-info">
        <h3 className="barber-name">{name}</h3>
        <p className="barber-specialty">{specialty}</p>
        <div className="barber-divider" />
        <p className="barber-bio">{bio}</p>
        <p className="barber-years">
          <span>{years}+</span> anos de experiência
        </p>
      </div>
    </article>
  );
}

export default BarberCard;
