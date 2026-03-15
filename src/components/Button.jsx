function Button({
  children,
  type = "button",
  variant = "primary",
  fullWidth = false,
  className = "",
  ...props
}) {
  const classes = [
    "koc-button",
    `koc-button-${variant}`,
    fullWidth ? "koc-button-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}

export default Button;
