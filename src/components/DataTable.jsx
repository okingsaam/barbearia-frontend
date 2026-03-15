function DataTable({
  columns,
  rows,
  rowKey = "id",
  emptyMessage = "Nenhum registro encontrado.",
  actionsLabel = "Acoes",
  renderActions,
}) {
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
            {renderActions ? <th>{actionsLabel}</th> : null}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (renderActions ? 1 : 0)}>{emptyMessage}</td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={row[rowKey] ?? `${rowKey}-${index}`}>
                {columns.map((column) => (
                  <td key={`${column.key}-${row[rowKey] ?? index}`}>
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
                {renderActions ? <td>{renderActions(row)}</td> : null}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
