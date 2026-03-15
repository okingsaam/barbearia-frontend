import { useEffect, useState } from "react";
import AppButton from "../components/AppButton";
import DataTable from "../components/DataTable";
import FormCard from "../components/FormCard";
import { createCrudService, getEntityId } from "../services/api";
import {
  asList,
  formatCurrency,
  formatDateTime,
  resolveNameById,
} from "../services/uiHelpers";

const vendasApi = createCrudService("/vendas");
const clientesApi = createCrudService("/clientes");
const produtosApi = createCrudService("/produtos");

const initialForm = {
  clienteId: "",
  produtoId: "",
  quantidade: "1",
  total: 0,
};

function Vendas() {
  const [vendas, setVendas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  async function loadPageData() {
    try {
      setErrorMessage("");
      const [vendasData, clientesData, produtosData] = await Promise.all([
        vendasApi.list(),
        clientesApi.list(),
        produtosApi.list(),
      ]);

      setVendas(asList(vendasData));
      setClientes(asList(clientesData));
      setProdutos(asList(produtosData));
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPageData();
  }, []);

  useEffect(() => {
    const selectedProduct = produtos.find(
      (produto) => String(getEntityId(produto)) === String(formData.produtoId),
    );

    const quantity = Number(formData.quantidade) || 0;
    const calculatedTotal = Number(((selectedProduct?.preco ?? 0) * quantity).toFixed(2));

    setFormData((previous) => {
      if (previous.total === calculatedTotal) {
        return previous;
      }

      return {
        ...previous,
        total: calculatedTotal,
      };
    });
  }, [formData.produtoId, formData.quantidade, produtos]);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  }

  function validateForm() {
    if (!formData.clienteId) {
      return "Selecione um cliente.";
    }

    if (!formData.produtoId) {
      return "Selecione um produto.";
    }

    if (Number(formData.quantidade) <= 0) {
      return "Quantidade deve ser maior que zero.";
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
        produtoId: Number(formData.produtoId),
        quantidade: Number(formData.quantidade),
        total: Number(formData.total),
      };

      await vendasApi.create(payload);
      setFormData(initialForm);
      await loadPageData();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(venda) {
    const id = getEntityId(venda);

    if (!id) {
      setErrorMessage("Nao foi possivel identificar a venda para exclusao.");
      return;
    }

    if (!window.confirm("Deseja remover esta venda?")) {
      return;
    }

    try {
      setErrorMessage("");
      await vendasApi.remove(id);
      await loadPageData();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  const columns = [
    { key: "id", label: "ID", render: (venda) => getEntityId(venda) ?? "-" },
    {
      key: "cliente",
      label: "Cliente",
      render: (venda) => resolveNameById(clientes, venda.cliente ?? venda.clienteId),
    },
    {
      key: "produto",
      label: "Produto",
      render: (venda) => resolveNameById(produtos, venda.produto ?? venda.produtoId),
    },
    { key: "quantidade", label: "Qtd." },
    {
      key: "total",
      label: "Total",
      render: (venda) => formatCurrency(venda.total),
    },
    {
      key: "data",
      label: "Data",
      render: (venda) => formatDateTime(venda.dataVenda ?? venda.createdAt ?? venda.data),
    },
  ];

  return (
    <section className="page-section">
      <header className="page-header">
        <h2>Vendas</h2>
        <p>Registre vendas de produtos com calculo automatico do total.</p>
      </header>

      <FormCard
        title="Registrar venda"
        onSubmit={handleSubmit}
        submitLabel="Salvar venda"
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
          Produto
          <select
            name="produtoId"
            value={formData.produtoId}
            onChange={handleInputChange}
            required
          >
            <option value="">Selecione um produto</option>
            {produtos.map((produto) => (
              <option key={getEntityId(produto)} value={getEntityId(produto)}>
                {produto.nome}
              </option>
            ))}
          </select>
        </label>

        <label>
          Quantidade
          <input
            name="quantidade"
            type="number"
            min="1"
            value={formData.quantidade}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Total calculado
          <input value={formatCurrency(formData.total)} readOnly />
        </label>
      </FormCard>

      {errorMessage ? <p className="feedback feedback-error">{errorMessage}</p> : null}

      <div className="panel">
        <div className="panel-header">
          <h3>Lista de vendas</h3>
          {isLoading ? <span className="status-chip">Carregando...</span> : null}
        </div>

        <DataTable
          columns={columns}
          rows={vendas}
          emptyMessage="Nenhuma venda cadastrada ate o momento."
          renderActions={(venda) => (
            <div className="row-actions">
              <AppButton variant="danger" onClick={() => handleDelete(venda)}>
                Excluir
              </AppButton>
            </div>
          )}
        />
      </div>
    </section>
  );
}

export default Vendas;
