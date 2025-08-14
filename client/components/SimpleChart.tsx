import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

interface SimpleChartProps {
  title: string;
  data: ChartDataPoint[];
  type?: "bar" | "line";
  className?: string;
}

export function SimpleChart({
  title,
  data,
  type = "bar",
  className,
}: SimpleChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center space-x-3">
              <div className="w-20 text-sm font-medium truncate">
                {item.name}
              </div>
              <div className="flex-1 flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                  <div
                    className="h-2 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${(item.value / maxValue) * 100}%`,
                      backgroundColor:
                        item.color || `hsl(var(--chart-${(index % 5) + 1}))`,
                    }}
                  />
                </div>
                <div className="w-12 text-sm font-mono text-right">
                  {typeof item.value === "number"
                    ? item.value.toFixed(1)
                    : item.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
