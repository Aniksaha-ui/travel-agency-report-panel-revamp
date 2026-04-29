import EmptyState from "../common/EmptyState";

export default function Table({
  columns,
  data,
  emptyDescription = "No data is available yet.",
  emptyTitle = "Nothing to show",
}) {
  if (!data.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="table-responsive">
      <table className="table table-vcenter card-table table-striped responsive-data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.headerClassName}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map((column) => (
                <td
                  key={column.key}
                  className={column.cellClassName}
                  data-label={
                    typeof column.mobileLabel === "string"
                      ? column.mobileLabel
                      : typeof column.header === "string"
                        ? column.header
                        : ""
                  }
                >
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
