function Table({ columns, rows, loading, emptyText = "Nenhum registro encontrado." }) {
  return (
    <div className="table-shell">
      <table className="koc-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length}>Carregando dados...</td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>{emptyText}</td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr key={row.id ?? `${rowIndex}-${row.nome ?? "item"}`}>
                {columns.map((column) => (
                  <td key={`${column.key}-${row.id ?? rowIndex}`}>
                    {column.render ? column.render(row) : row[column.key] ?? "-"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
