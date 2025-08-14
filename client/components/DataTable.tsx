import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  title: string;
  data: any[];
  columns: Column[];
  className?: string;
  maxRows?: number;
}

export function DataTable({
  title,
  data,
  columns,
  className,
  maxRows = 10,
}: DataTableProps) {
  const displayData = maxRows ? data.slice(0, maxRows) : data;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="text-left p-2 font-medium text-muted-foreground"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayData.map((row, index) => (
                <tr
                  key={index}
                  className={cn(
                    "border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50",
                    "transition-colors duration-150",
                  )}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="p-2">
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {data.length > maxRows && (
            <div className="mt-3 text-center text-sm text-muted-foreground">
              Showing {maxRows} of {data.length} records
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
