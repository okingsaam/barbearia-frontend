import { useEffect, useState } from "react";
import AppButton from "../components/AppButton";
import DataTable from "../components/DataTable";
import FormCard from "../components/FormCard";
import { createCrudService, getEntityId } from "../services/api";
import { asList } from "../services/uiHelpers";

const barbeirosApi = createCrudService("/barbeiros");

const initialForm = {
  nome: "",
  especialidade: "",
  telefone: "",
};

function Barbeiros() {
  const [barbeiros, setBarbeiros] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  async function loadBarbeiros() {
    try {
      setErrorMessage("");
      const data = await barbeirosApi.list();
      setBarbeiros(asList(data));
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadBarbeiros();
  }, []);

  function resetForm() {
    setFormData(initialForm);
    setEditingId(null);
  }

  function validateForm() {
    if (!formData.nome.trim()) {
      return "Informe o nome do barbeiro.";
    }

    if (!formData.especialidade.trim()) {
      return "Informe a especialidade do barbeiro.";
    }

    return "";
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationMessage = validateForm();
    if (validationMessage) {
      setErrorMessage(validationMessage);
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage("");

      const payload = {
        nome: formData.nome.trim(),
        especialidade: formData.especialidade.trim(),
        telefone: formData.telefone.trim(),
      };

      if (editingId) {
        await barbeirosApi.update(editingId, payload);
      } else {
        await barbeirosApi.create(payload);
      }

      resetForm();
      await loadBarbeiros();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(barbeiro) {
    setEditingId(getEntityId(barbeiro));
    setFormData({
      nome: barbeiro.nome ?? "",
      especialidade: barbeiro.especialidade ?? "",
      telefone: barbeiro.telefone ?? "",
    });
  }

  async function handleDelete(barbeiro) {
    const id = getEntityId(barbeiro);
    if (!id) {
      setErrorMessage("Nao foi possivel identificar o barbeiro para exclusao.");
      return;
    }

    if (!window.confirm(`Deseja remover o barbeiro ${barbeiro.nome ?? "selecionado"}?`)) {
      return;
    }

    try {
      setErrorMessage("");
      await barbeirosApi.remove(id);
      await loadBarbeiros();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  const columns = [
    { key: "id", label: "ID", render: (barbeiro) => getEntityId(barbeiro) ?? "-" },
    { key: "nome", label: "Nome" },
    { key: "especialidade", label: "Especialidade" },
    { key: "telefone", label: "Telefone" },
  ];

  return (
    <section className="page-section">
      <header className="page-header">
        <h2>Barbeiros</h2>
        <p>Gerencie a equipe e mantenha as especialidades atualizadas.</p>
      </header>

      <FormCard
        title={editingId ? "Editar barbeiro" : "Cadastrar barbeiro"}
        onSubmit={handleSubmit}
        submitLabel={editingId ? "Atualizar barbeiro" : "Salvar barbeiro"}
        onCancel={editingId ? resetForm : undefined}
        isSaving={isSaving}
      >
        <label>
          Nome
          <input
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            placeholder="Ex.: Vinicius Lima"
            required
          />
        </label>

        <label>
          Especialidade
          <input
            name="especialidade"
            value={formData.especialidade}
            onChange={handleInputChange}
            placeholder="Ex.: Degrade e barba completa"
            required
          />
        </label>

        <label>
          Telefone
          <input
            name="telefone"
            value={formData.telefone}
            onChange={handleInputChange}
            placeholder="Ex.: (11) 98888-9999"
          />
        </label>
      </FormCard>

      {errorMessage ? <p className="feedback feedback-error">{errorMessage}</p> : null}

      <div className="panel">
        <div className="panel-header">
          <h3>Lista de barbeiros</h3>
          {isLoading ? <span className="status-chip">Carregando...</span> : null}
        </div>

        <DataTable
          columns={columns}
          rows={barbeiros}
          emptyMessage="Nenhum barbeiro cadastrado ate o momento."
          renderActions={(barbeiro) => (
            <div className="row-actions">
              <AppButton variant="ghost" onClick={() => handleEdit(barbeiro)}>
                Editar
              </AppButton>
              <AppButton variant="danger" onClick={() => handleDelete(barbeiro)}>
                Excluir
              </AppButton>
            </div>
          )}
        />
      </div>
    </section>
  );
}

export default Barbeiros;
