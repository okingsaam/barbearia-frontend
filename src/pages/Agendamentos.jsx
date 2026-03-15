import { useEffect, useMemo, useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import Table from "../components/Table";
import { createEntityService, getEntityId } from "../services/api";

const agendamentosService = createEntityService("/agendamentos");
const clientesService = createEntityService("/clientes");
const barbeirosService = createEntityService("/barbeiros");
const servicosService = createEntityService("/servicos");

const initialForm = {
  clienteId: "",
  barbeiroId: "",
  servicoId: "",
  dataHora: "",
};

function Agendamentos() {
  const [rows, setRows] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [barbeiros, setBarbeiros] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Mapas aceleram a resolucao de nomes quando a tabela recebe apenas IDs.
  const clientNameMap = useMemo(
    () => new Map(clientes.map((item) => [String(getEntityId(item)), item.nome])),
    [clientes],
  );
  const barberNameMap = useMemo(
    () => new Map(barbeiros.map((item) => [String(getEntityId(item)), item.nome])),
    [barbeiros],
  );
  const serviceNameMap = useMemo(
    () => new Map(servicos.map((item) => [String(getEntityId(item)), item.nome])),
    [servicos],
  );

  const columns = [
    {
      key: "cliente",
      label: "Cliente",
      render: (row) => {
        const key = String(row.clienteId ?? row.cliente?.id ?? row.cliente);
        return row.cliente?.nome ?? clientNameMap.get(key) ?? "-";
      },
    },
    {
      key: "barbeiro",
      label: "Barbeiro",
      render: (row) => {
        const key = String(row.barbeiroId ?? row.barbeiro?.id ?? row.barbeiro);
        return row.barbeiro?.nome ?? barberNameMap.get(key) ?? "-";
      },
    },
    {
      key: "servico",
      label: "Servico",
      render: (row) => {
        const key = String(row.servicoId ?? row.servico?.id ?? row.servico);
        return row.servico?.nome ?? serviceNameMap.get(key) ?? "-";
      },
    },
    {
      key: "dataHora",
      label: "Data/Hora",
      render: (row) => {
        const source = row.dataHora ?? row.data;
        if (!source) {
          return "-";
        }

        const parsedDate = new Date(source);
        return Number.isNaN(parsedDate.getTime())
          ? source
          : parsedDate.toLocaleString("pt-BR");
      },
    },
  ];

  async function loadPageData() {
    try {
      setLoading(true);
      // Carrega tudo em paralelo para evitar espera sequencial entre endpoints.
      const [agendamentos, clients, barbers, services] = await Promise.all([
        agendamentosService.list(),
        clientesService.list(),
        barbeirosService.list(),
        servicosService.list(),
      ]);

      setRows(agendamentos);
      setClientes(clients);
      setBarbeiros(barbers);
      setServicos(services);
    } catch (error) {
      setFeedback({ type: "error", message: error.message });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPageData();
  }, []);

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
      await agendamentosService.create({
        clienteId: Number(formData.clienteId),
        barbeiroId: Number(formData.barbeiroId),
        servicoId: Number(formData.servicoId),
        dataHora: formData.dataHora,
      });

      setFeedback({ type: "success", message: "Agendamento criado com sucesso." });
      closeModal();
      await loadPageData();
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
          <h2>Agendamentos</h2>
          <p className="page-subtitle">Agenda de atendimentos da semana.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Criar</Button>
      </div>

      {feedback.message ? (
        <p className={`feedback feedback-${feedback.type}`}>{feedback.message}</p>
      ) : null}

      <Table columns={columns} rows={rows} loading={loading} />

      <Modal isOpen={isModalOpen} title="Criar agendamento" onClose={closeModal}>
        <form className="koc-form-grid" onSubmit={handleSubmit}>
          <Input
            as="select"
            label="Cliente"
            name="clienteId"
            value={formData.clienteId}
            onChange={handleInputChange}
            options={[
              { value: "", label: "Selecione" },
              ...clientes.map((item) => ({
                value: String(getEntityId(item)),
                label: item.nome,
              })),
            ]}
            required
          />

          <Input
            as="select"
            label="Barbeiro"
            name="barbeiroId"
            value={formData.barbeiroId}
            onChange={handleInputChange}
            options={[
              { value: "", label: "Selecione" },
              ...barbeiros.map((item) => ({
                value: String(getEntityId(item)),
                label: item.nome,
              })),
            ]}
            required
          />

          <Input
            as="select"
            label="Servico"
            name="servicoId"
            value={formData.servicoId}
            onChange={handleInputChange}
            options={[
              { value: "", label: "Selecione" },
              ...servicos.map((item) => ({
                value: String(getEntityId(item)),
                label: item.nome,
              })),
            ]}
            required
          />

          <Input
            label="Data e hora"
            name="dataHora"
            type="datetime-local"
            value={formData.dataHora}
            onChange={handleInputChange}
            required
          />

          <div className="koc-form-actions">
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancelar
            </Button>
            <Button type="submit" variant="secondary" disabled={saving}>
              {saving ? "Salvando..." : "Salvar agendamento"}
            </Button>
          </div>
        </form>
      </Modal>
    </section>
  );
}

export default Agendamentos;
