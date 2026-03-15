function KocButton({ variant = "gold", size = "md", onClick, children, type = "button", disabled = false, className = "" }) {
  const cls = ["koc-btn", `koc-btn--${variant}`, `koc-btn--${size}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

export default KocButton;
