import { useCallback, useEffect, useMemo, useState } from "react";
import Button from "./Button";
import Input from "./Input";
import Modal from "./Modal";
import Table from "./Table";
import { createEntityService } from "../services/api";

function EntityCrudPage({
  title,
  subtitle,
  endpoint,
  columns,
  fields,
  addButtonLabel,
  submitLabel,
  mapPayload,
}) {
  const service = useMemo(() => createEntityService(endpoint), [endpoint]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const initialForm = useMemo(() => {
    // Gera o estado inicial dinamicamente a partir dos campos declarados na pagina.
    const model = {};

    fields.forEach((field) => {
      model[field.name] = field.defaultValue ?? "";
    });

    return model;
  }, [fields]);

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    setFormData(initialForm);
  }, [initialForm]);

  const loadRows = useCallback(async () => {
    try {
      setLoading(true);
      const data = await service.list();
      setRows(data);
    } catch (error) {
      setFeedback({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  }

  function closeModal() {
    setIsModalOpen(false);
    setFormData(initialForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setSaving(true);
      // Permite adaptar os tipos enviados para a API (ex.: string -> number).
      const payload = mapPayload ? mapPayload(formData) : formData;
      await service.create(payload);
      setFeedback({ type: "success", message: "Registro cadastrado com sucesso." });
      closeModal();
      await loadRows();
    } catch (error) {
      setFeedback({ type: "error", message: error.message });
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="page-card">
      <div className="page-headline">
        <div>
          <h2>{title}</h2>
          <p className="page-subtitle">{subtitle}</p>
        </div>

        <Button onClick={() => setIsModalOpen(true)}>{addButtonLabel}</Button>
      </div>

      {feedback.message ? (
        <p className={`feedback feedback-${feedback.type}`}>{feedback.message}</p>
      ) : null}

      <Table columns={columns} rows={rows} loading={loading} />

      <Modal isOpen={isModalOpen} title={title} onClose={closeModal}>
        <form onSubmit={handleSubmit} className="koc-form-grid">
          {fields.map((field) => (
            <Input
              key={field.name}
              as={field.as ?? "input"}
              label={field.label}
              name={field.name}
              type={field.type ?? "text"}
              value={formData[field.name]}
              placeholder={field.placeholder}
              options={field.options ? field.options(formData) : []}
              onChange={handleInputChange}
              required={field.required ?? true}
              min={field.min}
              step={field.step}
              hint={field.hint}
            />
          ))}

          <div className="koc-form-actions">
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancelar
            </Button>
            <Button type="submit" variant="secondary" disabled={saving}>
              {saving ? "Salvando..." : submitLabel}
            </Button>
          </div>
        </form>
      </Modal>
    </section>
  );
}

export default EntityCrudPage;
