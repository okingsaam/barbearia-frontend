import { useEffect, useState } from "react";
import AppButton from "../components/AppButton";
import DataTable from "../components/DataTable";
import FormCard from "../components/FormCard";
import { createCrudService, getEntityId } from "../services/api";
import { asList, formatCurrency } from "../services/uiHelpers";

const produtosApi = createCrudService("/produtos");

const initialForm = {
  nome: "",
  descricao: "",
  preco: "0",
  estoque: "0",
};

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  async function loadProdutos() {
    try {
      setErrorMessage("");
      const data = await produtosApi.list();
      setProdutos(asList(data));
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProdutos();
  }, []);

  function resetForm() {
    setFormData(initialForm);
    setEditingId(null);
  }

  function validateForm() {
    if (!formData.nome.trim()) {
      return "Informe o nome do produto.";
    }

    if (Number(formData.preco) < 0) {
      return "Preco nao pode ser negativo.";
    }

    if (Number(formData.estoque) < 0) {
      return "Estoque nao pode ser negativo.";
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
        descricao: formData.descricao.trim(),
        preco: Number(formData.preco),
        estoque: Number(formData.estoque),
      };

      if (editingId) {
        await produtosApi.update(editingId, payload);
      } else {
        await produtosApi.create(payload);
      }

      resetForm();
      await loadProdutos();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(produto) {
    setEditingId(getEntityId(produto));
    setFormData({
      nome: produto.nome ?? "",
      descricao: produto.descricao ?? "",
      preco: String(produto.preco ?? 0),
      estoque: String(produto.estoque ?? 0),
    });
  }

  async function handleDelete(produto) {
    const id = getEntityId(produto);
    if (!id) {
      setErrorMessage("Nao foi possivel identificar o produto para exclusao.");
      return;
    }

    if (!window.confirm(`Deseja remover o produto ${produto.nome ?? "selecionado"}?`)) {
      return;
    }

    try {
      setErrorMessage("");
      await produtosApi.remove(id);
      await loadProdutos();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  const columns = [
    { key: "id", label: "ID", render: (produto) => getEntityId(produto) ?? "-" },
    { key: "nome", label: "Produto" },
    { key: "descricao", label: "Descricao" },
    {
      key: "preco",
      label: "Preco",
      render: (produto) => formatCurrency(produto.preco),
    },
    { key: "estoque", label: "Estoque" },
  ];

  return (
    <section className="page-section">
      <header className="page-header">
        <h2>Produtos</h2>
        <p>Controle de catalogo, preco e estoque de produtos da loja.</p>
      </header>

      <FormCard
        title={editingId ? "Editar produto" : "Cadastrar produto"}
        onSubmit={handleSubmit}
        submitLabel={editingId ? "Atualizar produto" : "Salvar produto"}
        onCancel={editingId ? resetForm : undefined}
        isSaving={isSaving}
      >
        <label>
          Nome do produto
          <input
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            placeholder="Ex.: Pomada modeladora"
            required
          />
        </label>

        <label>
          Descricao
          <input
            name="descricao"
            value={formData.descricao}
            onChange={handleInputChange}
            placeholder="Ex.: Fixacao media e brilho seco"
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

        <label>
          Estoque
          <input
            name="estoque"
            type="number"
            min="0"
            value={formData.estoque}
            onChange={handleInputChange}
            required
          />
        </label>
      </FormCard>

      {errorMessage ? <p className="feedback feedback-error">{errorMessage}</p> : null}

      <div className="panel">
        <div className="panel-header">
          <h3>Lista de produtos</h3>
          {isLoading ? <span className="status-chip">Carregando...</span> : null}
        </div>

        <DataTable
          columns={columns}
          rows={produtos}
          emptyMessage="Nenhum produto cadastrado ate o momento."
          renderActions={(produto) => (
            <div className="row-actions">
              <AppButton variant="ghost" onClick={() => handleEdit(produto)}>
                Editar
              </AppButton>
              <AppButton variant="danger" onClick={() => handleDelete(produto)}>
                Excluir
              </AppButton>
            </div>
          )}
        />
      </div>
    </section>
  );
}

export default Produtos;
