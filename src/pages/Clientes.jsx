import { useEffect, useState } from "react";
import AppButton from "../components/AppButton";
import DataTable from "../components/DataTable";
import FormCard from "../components/FormCard";
import { createCrudService, getEntityId } from "../services/api";
import { asList } from "../services/uiHelpers";

const clientesApi = createCrudService("/clientes");

const initialForm = {
  nome: "",
  telefone: "",
  email: "",
};

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  async function loadClientes() {
    try {
      setErrorMessage("");
      const data = await clientesApi.list();
      setClientes(asList(data));
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadClientes();
  }, []);

  function resetForm() {
    setFormData(initialForm);
    setEditingId(null);
  }

  function validateForm() {
    if (!formData.nome.trim()) {
      return "Informe o nome do cliente.";
    }

    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      return "Informe um e-mail valido.";
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
        telefone: formData.telefone.trim(),
        email: formData.email.trim(),
      };

      if (editingId) {
        await clientesApi.update(editingId, payload);
      } else {
        await clientesApi.create(payload);
      }

      resetForm();
      await loadClientes();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(cliente) {
    setEditingId(getEntityId(cliente));
    setFormData({
      nome: cliente.nome ?? "",
      telefone: cliente.telefone ?? "",
      email: cliente.email ?? "",
    });
  }

  async function handleDelete(cliente) {
    const id = getEntityId(cliente);
    if (!id) {
      setErrorMessage("Nao foi possivel identificar o cliente para exclusao.");
      return;
    }

    if (!window.confirm(`Deseja remover o cliente ${cliente.nome ?? "selecionado"}?`)) {
      return;
    }

    try {
      setErrorMessage("");
      await clientesApi.remove(id);
      await loadClientes();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  const columns = [
    { key: "id", label: "ID", render: (cliente) => getEntityId(cliente) ?? "-" },
    { key: "nome", label: "Nome" },
    { key: "telefone", label: "Telefone" },
    { key: "email", label: "E-mail" },
  ];

  return (
    <section className="page-section">
      <header className="page-header">
        <h2>Clientes</h2>
        <p>Cadastro e gerenciamento de clientes da barbearia.</p>
      </header>

      <FormCard
        title={editingId ? "Editar cliente" : "Cadastrar cliente"}
        onSubmit={handleSubmit}
        submitLabel={editingId ? "Atualizar cliente" : "Salvar cliente"}
        onCancel={editingId ? resetForm : undefined}
        isSaving={isSaving}
      >
        <label>
          Nome
          <input
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            placeholder="Ex.: Rafael Costa"
            required
          />
        </label>

        <label>
          Telefone
          <input
            name="telefone"
            value={formData.telefone}
            onChange={handleInputChange}
            placeholder="Ex.: (11) 99999-9999"
          />
        </label>

        <label>
          E-mail
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Ex.: cliente@email.com"
          />
        </label>
      </FormCard>

      {errorMessage ? <p className="feedback feedback-error">{errorMessage}</p> : null}

      <div className="panel">
        <div className="panel-header">
          <h3>Lista de clientes</h3>
          {isLoading ? <span className="status-chip">Carregando...</span> : null}
        </div>

        <DataTable
          columns={columns}
          rows={clientes}
          emptyMessage="Nenhum cliente cadastrado ate o momento."
          renderActions={(cliente) => (
            <div className="row-actions">
              <AppButton variant="ghost" onClick={() => handleEdit(cliente)}>
                Editar
              </AppButton>
              <AppButton variant="danger" onClick={() => handleDelete(cliente)}>
                Excluir
              </AppButton>
            </div>
          )}
        />
      </div>
    </section>
  );
}

export default Clientes;
