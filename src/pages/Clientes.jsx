import EntityCrudPage from "../components/EntityCrudPage";

const columns = [
  { key: "id", label: "ID" },
  { key: "nome", label: "Nome" },
  { key: "email", label: "Email" },
  { key: "telefone", label: "Telefone" },
];

const fields = [
  {
    name: "nome",
    label: "Nome",
    placeholder: "Ex.: Joao Silva",
  },
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Ex.: joao@email.com",
  },
  {
    name: "telefone",
    label: "Telefone",
    placeholder: "Ex.: (11) 99999-9999",
  },
];

function Clientes() {
  return (
    <EntityCrudPage
      title="Clientes"
      subtitle="Lista de clientes com dados de contato da barbearia."
      endpoint="/clientes"
      columns={columns}
      fields={fields}
      addButtonLabel="+ Cadastrar"
      submitLabel="Salvar cliente"
    />
  );
}

export default Clientes;
