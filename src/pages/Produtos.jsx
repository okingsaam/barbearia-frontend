import EntityCrudPage from "../components/EntityCrudPage";

const columns = [
  { key: "id", label: "ID" },
  { key: "nome", label: "Nome" },
  {
    key: "preco",
    label: "Preco",
    render: (row) =>
      new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(Number(row.preco) || 0),
  },
  { key: "estoque", label: "Estoque" },
];

const fields = [
  {
    name: "nome",
    label: "Nome",
    placeholder: "Ex.: Pomada modeladora",
  },
  {
    name: "preco",
    label: "Preco",
    type: "number",
    min: "0",
    step: "0.01",
    placeholder: "Ex.: 45.90",
  },
  {
    name: "estoque",
    label: "Estoque",
    type: "number",
    min: "0",
    placeholder: "Ex.: 18",
  },
];

function Produtos() {
  return (
    <EntityCrudPage
      title="Produtos"
      subtitle="Controle de estoque dos produtos vendidos no balcao."
      endpoint="/produtos"
      columns={columns}
      fields={fields}
      addButtonLabel="+ Cadastrar"
      submitLabel="Salvar produto"
      mapPayload={(formData) => ({
        ...formData,
        preco: Number(formData.preco),
        estoque: Number(formData.estoque),
      })}
    />
  );
}

export default Produtos;
