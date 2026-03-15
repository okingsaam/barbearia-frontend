function Input({
  label,
  name,
  as = "input",
  options = [],
  hint,
  className = "",
  ...props
}) {
  const Control = as;

  return (
    <label className={`field ${className}`.trim()}>
      <span className="field-label">{label}</span>

      {as === "select" ? (
        <Control name={name} className="field-control" {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Control>
      ) : (
        <Control name={name} className="field-control" {...props} />
      )}

      {hint ? <small className="field-hint">{hint}</small> : null}
    </label>
  );
}

export default Input;
