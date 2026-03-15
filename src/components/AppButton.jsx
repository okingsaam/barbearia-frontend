function AppButton({
  children,
  type = "button",
  variant = "primary",
  className = "",
  ...props
}) {
  return (
    <button type={type} className={`btn btn-${variant} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}

export default AppButton;
