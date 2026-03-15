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
];

const fields = [
  {
    name: "nome",
    label: "Nome",
    placeholder: "Ex.: Corte premium",
  },
  {
    name: "preco",
    label: "Preco",
    type: "number",
    min: "0",
    step: "0.01",
    placeholder: "Ex.: 60.00",
  },
];

function Servicos() {
  return (
    <EntityCrudPage
      title="Servicos"
      subtitle="Tabela de servicos e valores cobrados."
      endpoint="/servicos"
      columns={columns}
      fields={fields}
      addButtonLabel="+ Cadastrar"
      submitLabel="Salvar servico"
      mapPayload={(formData) => ({
        ...formData,
        preco: Number(formData.preco),
      })}
    />
  );
}

export default Servicos;
