import { useEffect, useState } from "react";
import AppButton from "../components/AppButton";
import DataTable from "../components/DataTable";
import FormCard from "../components/FormCard";
import { createCrudService, getEntityId } from "../services/api";
import { asList, formatDateTime, resolveNameById } from "../services/uiHelpers";

const agendamentosApi = createCrudService("/agendamentos");
const clientesApi = createCrudService("/clientes");
const barbeirosApi = createCrudService("/barbeiros");
const servicosApi = createCrudService("/servicos");

const initialForm = {
  clienteId: "",
  barbeiroId: "",
  servicoId: "",
  dataHora: "",
};

function Agendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [barbeiros, setBarbeiros] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  async function loadPageData() {
    try {
      setErrorMessage("");

      // Busca todas as entidades relacionadas para popular os selects.
      const [agendamentosData, clientesData, barbeirosData, servicosData] =
        await Promise.all([
          agendamentosApi.list(),
          clientesApi.list(),
          barbeirosApi.list(),
          servicosApi.list(),
        ]);

      setAgendamentos(asList(agendamentosData));
      setClientes(asList(clientesData));
      setBarbeiros(asList(barbeirosData));
      setServicos(asList(servicosData));
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPageData();
  }, []);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  }

  function validateForm() {
    if (!formData.clienteId) {
      return "Selecione um cliente.";
    }

    if (!formData.barbeiroId) {
      return "Selecione um barbeiro.";
    }

    if (!formData.servicoId) {
      return "Selecione um servico.";
    }

    if (!formData.dataHora) {
      return "Selecione data e horario do agendamento.";
    }

    return "";
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
        clienteId: Number(formData.clienteId),
        barbeiroId: Number(formData.barbeiroId),
        servicoId: Number(formData.servicoId),
        dataHora: formData.dataHora,
      };

      await agendamentosApi.create(payload);
      setFormData(initialForm);
      await loadPageData();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(agendamento) {
    const id = getEntityId(agendamento);
    if (!id) {
      setErrorMessage("Nao foi possivel identificar o agendamento para exclusao.");
      return;
    }

    if (!window.confirm("Deseja cancelar este agendamento?")) {
      return;
    }

    try {
      setErrorMessage("");
      await agendamentosApi.remove(id);
      await loadPageData();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  const columns = [
    {
      key: "id",
      label: "ID",
      render: (agendamento) => getEntityId(agendamento) ?? "-",
    },
    {
      key: "cliente",
      label: "Cliente",
      render: (agendamento) =>
        resolveNameById(clientes, agendamento.cliente ?? agendamento.clienteId),
    },
    {
      key: "barbeiro",
      label: "Barbeiro",
      render: (agendamento) =>
        resolveNameById(barbeiros, agendamento.barbeiro ?? agendamento.barbeiroId),
    },
    {
      key: "servico",
      label: "Servico",
      render: (agendamento) =>
        resolveNameById(servicos, agendamento.servico ?? agendamento.servicoId),
    },
    {
      key: "dataHora",
      label: "Data e horario",
      render: (agendamento) => formatDateTime(agendamento.dataHora),
    },
  ];

  return (
    <section className="page-section">
      <header className="page-header">
        <h2>Agendamentos</h2>
        <p>Registre e acompanhe os horarios dos clientes com cada barbeiro.</p>
      </header>

      <FormCard
        title="Novo agendamento"
        onSubmit={handleSubmit}
        submitLabel="Criar agendamento"
        isSaving={isSaving}
      >
        <label>
          Cliente
          <select
            name="clienteId"
            value={formData.clienteId}
            onChange={handleInputChange}
            required
          >
            <option value="">Selecione um cliente</option>
            {clientes.map((cliente) => (
              <option key={getEntityId(cliente)} value={getEntityId(cliente)}>
                {cliente.nome}
              </option>
            ))}
          </select>
        </label>

        <label>
          Barbeiro
          <select
            name="barbeiroId"
            value={formData.barbeiroId}
            onChange={handleInputChange}
            required
          >
            <option value="">Selecione um barbeiro</option>
            {barbeiros.map((barbeiro) => (
              <option key={getEntityId(barbeiro)} value={getEntityId(barbeiro)}>
                {barbeiro.nome}
              </option>
            ))}
          </select>
        </label>

        <label>
          Servico
          <select
            name="servicoId"
            value={formData.servicoId}
            onChange={handleInputChange}
            required
          >
            <option value="">Selecione um servico</option>
            {servicos.map((servico) => (
              <option key={getEntityId(servico)} value={getEntityId(servico)}>
                {servico.nome}
              </option>
            ))}
          </select>
        </label>

        <label>
          Data e horario
          <input
            name="dataHora"
            type="datetime-local"
            value={formData.dataHora}
            onChange={handleInputChange}
            required
          />
        </label>
      </FormCard>

      {errorMessage ? <p className="feedback feedback-error">{errorMessage}</p> : null}

      <div className="panel">
        <div className="panel-header">
          <h3>Lista de agendamentos</h3>
          {isLoading ? <span className="status-chip">Carregando...</span> : null}
        </div>

        <DataTable
          columns={columns}
          rows={agendamentos}
          emptyMessage="Nenhum agendamento cadastrado ate o momento."
          renderActions={(agendamento) => (
            <div className="row-actions">
              <AppButton variant="danger" onClick={() => handleDelete(agendamento)}>
                Cancelar
              </AppButton>
            </div>
          )}
        />
      </div>
    </section>
  );
}

export default Agendamentos;
