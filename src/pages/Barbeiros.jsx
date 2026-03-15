import EntityCrudPage from "../components/EntityCrudPage";

const columns = [
  { key: "id", label: "ID" },
  { key: "nome", label: "Nome" },
  { key: "especialidade", label: "Especialidade" },
];

const fields = [
  {
    name: "nome",
    label: "Nome",
    placeholder: "Ex.: Rafael Costa",
  },
  {
    name: "especialidade",
    label: "Especialidade",
    placeholder: "Ex.: Fade e barba classica",
  },
];

function Barbeiros() {
  return (
    <EntityCrudPage
      title="Barbeiros"
      subtitle="Equipe de barbeiros e suas especialidades."
      endpoint="/barbeiros"
      columns={columns}
      fields={fields}
      addButtonLabel="+ Cadastrar"
      submitLabel="Salvar barbeiro"
    />
  );
}

export default Barbeiros;
