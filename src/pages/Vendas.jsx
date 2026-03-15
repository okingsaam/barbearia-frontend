import { useEffect, useMemo, useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import Modal from "../components/Modal";
import Table from "../components/Table";
import { createEntityService, getEntityId } from "../services/api";

const vendasService = createEntityService("/vendas");
const clientesService = createEntityService("/clientes");
const produtosService = createEntityService("/produtos");

const initialForm = {
  clienteId: "",
  produtoId: "",
  quantidade: "1",
};

function Vendas() {
  const [rows, setRows] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const clientNameMap = useMemo(
    () => new Map(clientes.map((item) => [String(getEntityId(item)), item.nome])),
    [clientes],
  );
  const productMap = useMemo(
    () => new Map(produtos.map((item) => [String(getEntityId(item)), item])),
    [produtos],
  );

  // Total preview recalcula sempre que produto ou quantidade mudam no formulario.
  const selectedProduct = productMap.get(String(formData.produtoId));
  const totalPreview = (Number(selectedProduct?.preco) || 0) * (Number(formData.quantidade) || 0);

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
      key: "produto",
      label: "Produto",
      render: (row) => {
        const key = String(row.produtoId ?? row.produto?.id ?? row.produto);
        return row.produto?.nome ?? productMap.get(key)?.nome ?? "-";
      },
    },
    { key: "quantidade", label: "Quantidade" },
    {
      key: "total",
      label: "Total",
      render: (row) =>
        new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(Number(row.total) || 0),
    },
  ];

  async function loadPageData() {
    try {
      setLoading(true);
      // Vendas depende de clientes e produtos para exibir nomes na tabela.
      const [vendas, clients, products] = await Promise.all([
        vendasService.list(),
        clientesService.list(),
        produtosService.list(),
      ]);

      setRows(vendas);
      setClientes(clients);
      setProdutos(products);
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
      await vendasService.create({
        clienteId: Number(formData.clienteId),
        produtoId: Number(formData.produtoId),
        quantidade: Number(formData.quantidade),
        total: Number(totalPreview.toFixed(2)),
      });

      setFeedback({ type: "success", message: "Venda registrada com sucesso." });
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
          <h2>Vendas</h2>
          <p className="page-subtitle">Registro de vendas e valor total calculado.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ Registrar</Button>
      </div>

      {feedback.message ? (
        <p className={`feedback feedback-${feedback.type}`}>{feedback.message}</p>
      ) : null}

      <Table columns={columns} rows={rows} loading={loading} />

      <Modal isOpen={isModalOpen} title="Registrar venda" onClose={closeModal}>
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
            label="Produto"
            name="produtoId"
            value={formData.produtoId}
            onChange={handleInputChange}
            options={[
              { value: "", label: "Selecione" },
              ...produtos.map((item) => ({
                value: String(getEntityId(item)),
                label: `${item.nome} - ${new Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(item.preco) || 0)}`,
              })),
            ]}
            required
          />

          <Input
            label="Quantidade"
            name="quantidade"
            type="number"
            min="1"
            value={formData.quantidade}
            onChange={handleInputChange}
            required
          />

          <Input
            label="Total"
            name="totalPreview"
            value={new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(totalPreview || 0)}
            readOnly
            hint="Calculado automaticamente com base no produto e quantidade."
          />

          <div className="koc-form-actions">
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancelar
            </Button>
            <Button type="submit" variant="secondary" disabled={saving}>
              {saving ? "Salvando..." : "Salvar venda"}
            </Button>
          </div>
        </form>
      </Modal>
    </section>
  );
}

export default Vendas;
