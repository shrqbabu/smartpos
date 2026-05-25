import React from 'react';

interface Column<T> {
  key: string;
  title: string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  rowKey?: (row: T) => string;
  onRowClick?: (row: T) => void;
}

export function Table<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyMessage = 'No data found',
  emptyIcon,
  rowKey,
  onRowClick
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100 dark:border-slate-700">
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={`
                  py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider
                  ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}
                `}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key} className="py-3 px-4">
                    <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-16 text-center">
                <div className="flex flex-col items-center gap-3">
                  {emptyIcon && <div className="text-slate-300 dark:text-slate-600">{emptyIcon}</div>}
                  <p className="text-sm text-slate-500 dark:text-slate-400">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={rowKey ? rowKey(row) : index}
                onClick={() => onRowClick?.(row)}
                className={`
                  hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors
                  ${onRowClick ? 'cursor-pointer' : ''}
                `}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`
                      py-3 px-4 text-sm text-slate-700 dark:text-slate-300
                      ${col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'}
                    `}
                  >
                    {col.render ? col.render(row[col.key], row, index) : row[col.key]}
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
