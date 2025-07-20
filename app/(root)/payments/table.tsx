import React from "react";

interface TableProps {
  columns: { key: string; label: string }[];
  data: any[];
  actions?: (row: any) => React.ReactNode;
}

const Table: React.FC<TableProps> = ({ columns, data, actions }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((col) => (
            <th key={col.key} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              {col.label}
            </th>
          ))}
          {actions && <th className="px-4 py-2"></th>}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-100">
        {data.map((row, idx) => (
          <tr key={idx} className="hover:bg-gray-50">
            {columns.map((col) => (
              <td key={col.key} className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                {row[col.key]}
              </td>
            ))}
            {actions && <td className="px-4 py-2">{actions(row)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Table;