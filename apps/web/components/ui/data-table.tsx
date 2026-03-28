import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Column<T> {
  header: string
  accessor: keyof T | ((row: T) => React.ReactNode)
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (row: T) => void
}

export function DataTable<T>({ columns, data, onRowClick }: DataTableProps<T>) {
  return (
    <div className="rounded-2xl border border-surface-200 bg-white dark:border-surface-700 dark:bg-surface-900 overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col, i) => (
              <TableHead key={i}>{col.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-surface-500">
                Нет данных
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, i) => (
              <TableRow 
                key={i} 
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? "cursor-pointer" : ""}
              >
                {columns.map((col, j) => (
                  <TableCell key={j}>
                    {typeof col.accessor === "function" ? col.accessor(row) : (row[col.accessor] as React.ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
