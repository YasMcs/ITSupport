export function Table({ columns, data, onRowClick }) {
  const isInteractive = typeof onRowClick === "function";

  const shouldIgnoreRowClick = (target) =>
    target instanceof Element && Boolean(target.closest("[data-row-action='true']"));

  const handleRowClick = (event, row) => {
    if (!isInteractive || shouldIgnoreRowClick(event.target)) return;
    onRowClick(row);
  };

  const handleRowKeyDown = (event, row) => {
    if (!isInteractive || shouldIgnoreRowClick(event.target)) return;
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    onRowClick(row);
  };

  return (
    <div className="overflow-x-auto overflow-hidden rounded-2xl border border-dark-purple-700/90 bg-dark-purple-800/60 backdrop-blur-xl">
      <table className="min-w-full divide-y divide-dark-purple-700/90">
        <thead className="bg-dark-purple-800/70">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-purple-700/90 bg-dark-purple-800/55">
          {data.map((row, i) => (
            <tr
              key={row.id ?? i}
              tabIndex={isInteractive ? 0 : undefined}
              role={isInteractive ? "button" : undefined}
              onClick={(event) => handleRowClick(event, row)}
              onKeyDown={(event) => handleRowKeyDown(event, row)}
              className={`transition-colors duration-150 ${
                isInteractive
                  ? "cursor-pointer hover:bg-white/[0.05] focus-visible:bg-white/[0.05] focus-visible:outline-none"
                  : "hover:bg-dark-purple-700/60"
              }`}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-3 text-sm text-text-primary">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
