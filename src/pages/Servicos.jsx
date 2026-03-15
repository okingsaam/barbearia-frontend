import { useEffect, useState } from "react";
import AppButton from "../components/AppButton";
import DataTable from "../components/DataTable";
import FormCard from "../components/FormCard";
import { createCrudService, getEntityId } from "../services/api";
import { asList, formatCurrency } from "../services/uiHelpers";

const servicosApi = createCrudService("/servicos");

const initialForm = {
  nome: "",
  duracaoMinutos: "30",
  preco: "0",
};

function Servicos() {
  const [servicos, setServicos] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  async function loadServicos() {
    try {
      setErrorMessage("");
      const data = await servicosApi.list();
      setServicos(asList(data));
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadServicos();
  }, []);

  function resetForm() {
    setFormData(initialForm);
    setEditingId(null);
  }

  function validateForm() {
    if (!formData.nome.trim()) {
      return "Informe o nome do servico.";
    }

    if (Number(formData.duracaoMinutos) <= 0) {
      return "Duracao deve ser maior que zero.";
    }

    if (Number(formData.preco) < 0) {
      return "Preco nao pode ser negativo.";
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
        duracaoMinutos: Number(formData.duracaoMinutos),
        preco: Number(formData.preco),
      };

      if (editingId) {
        await servicosApi.update(editingId, payload);
      } else {
        await servicosApi.create(payload);
      }

      resetForm();
      await loadServicos();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(servico) {
    setEditingId(getEntityId(servico));
    setFormData({
      nome: servico.nome ?? "",
      duracaoMinutos: String(servico.duracaoMinutos ?? 30),
      preco: String(servico.preco ?? 0),
    });
  }

  async function handleDelete(servico) {
    const id = getEntityId(servico);
    if (!id) {
      setErrorMessage("Nao foi possivel identificar o servico para exclusao.");
      return;
    }

    if (!window.confirm(`Deseja remover o servico ${servico.nome ?? "selecionado"}?`)) {
      return;
    }

    try {
      setErrorMessage("");
      await servicosApi.remove(id);
      await loadServicos();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  const columns = [
    { key: "id", label: "ID", render: (servico) => getEntityId(servico) ?? "-" },
    { key: "nome", label: "Servico" },
    {
      key: "duracaoMinutos",
      label: "Duracao",
      render: (servico) => `${servico.duracaoMinutos ?? 0} min`,
    },
    {
      key: "preco",
      label: "Preco",
      render: (servico) => formatCurrency(servico.preco),
    },
  ];

  return (
    <section className="page-section">
      <header className="page-header">
        <h2>Servicos</h2>
        <p>Defina servicos, duracao e valor para agendamentos e vendas.</p>
      </header>

      <FormCard
        title={editingId ? "Editar servico" : "Cadastrar servico"}
        onSubmit={handleSubmit}
        submitLabel={editingId ? "Atualizar servico" : "Salvar servico"}
        onCancel={editingId ? resetForm : undefined}
        isSaving={isSaving}
      >
        <label>
          Nome do servico
          <input
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            placeholder="Ex.: Corte social"
            required
          />
        </label>

        <label>
          Duracao (minutos)
          <input
            name="duracaoMinutos"
            type="number"
            min="1"
            value={formData.duracaoMinutos}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Preco
          <input
            name="preco"
            type="number"
            min="0"
            step="0.01"
            value={formData.preco}
            onChange={handleInputChange}
            required
          />
        </label>
      </FormCard>

      {errorMessage ? <p className="feedback feedback-error">{errorMessage}</p> : null}

      <div className="panel">
        <div className="panel-header">
          <h3>Lista de servicos</h3>
          {isLoading ? <span className="status-chip">Carregando...</span> : null}
        </div>

        <DataTable
          columns={columns}
          rows={servicos}
          emptyMessage="Nenhum servico cadastrado ate o momento."
          renderActions={(servico) => (
            <div className="row-actions">
              <AppButton variant="ghost" onClick={() => handleEdit(servico)}>
                Editar
              </AppButton>
              <AppButton variant="danger" onClick={() => handleDelete(servico)}>
                Excluir
              </AppButton>
            </div>
          )}
        />
      </div>
    </section>
  );
}

export default Servicos;
