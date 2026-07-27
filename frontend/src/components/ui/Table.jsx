function Table({ columns, data, className = "", style = {}, ...props }) {
  return (
    <div style={{ overflowX: "auto", ...style }} className={className} {...props}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #e8d4ff" }}>
            {columns.map((col) => (
              <th key={col.key} style={{ padding: "0.75rem 1rem", textAlign: "left", color: "#2d1b69", fontWeight: "700", fontSize: "0.85rem" }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: "2rem", textAlign: "center", color: "#6b5b95" }}>
                No data available
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr key={rowIdx} style={{ borderBottom: "1px solid #f0e6ff", background: rowIdx % 2 === 0 ? "#faf5ff" : "#fff" }}>
                {columns.map((col) => (
                  <td key={col.key} style={{ padding: "0.75rem 1rem", color: "#2d1b69" }}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
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