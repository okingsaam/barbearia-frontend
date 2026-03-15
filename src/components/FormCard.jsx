import AppButton from "./AppButton";

function FormCard({
  title,
  onSubmit,
  children,
  submitLabel,
  cancelLabel = "Cancelar edicao",
  onCancel,
  isSaving,
}) {
  return (
    <form className="form-card" onSubmit={onSubmit}>
      <h3>{title}</h3>
      <div className="form-grid">{children}</div>

      <div className="form-actions">
        <AppButton type="submit" disabled={isSaving}>
          {isSaving ? "Salvando..." : submitLabel}
        </AppButton>

        {onCancel ? (
          <AppButton type="button" variant="ghost" onClick={onCancel}>
            {cancelLabel}
          </AppButton>
        ) : null}
      </div>
    </form>
  );
}

export default FormCard;
