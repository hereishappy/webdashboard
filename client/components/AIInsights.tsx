import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Brain, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { AttendanceRecord, PerformanceRecord } from "@/lib/data";

interface AIInsightsProps {
  attendanceData: AttendanceRecord[];
  performanceData: PerformanceRecord[];
}

interface Insight {
  type: "positive" | "warning" | "neutral";
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function AIInsights({
  attendanceData,
  performanceData,
}: AIInsightsProps) {
  const generateInsights = (): Insight[] => {
    const insights: Insight[] = [];

    // Analyze overtime patterns
    const totalOT = attendanceData.reduce((sum, r) => sum + r.otHours, 0);
    const avgOT = totalOT / attendanceData.length;

    if (avgOT > 2) {
      insights.push({
        type: "warning",
        title: "High Overtime Detected",
        description: `Average overtime is ${avgOT.toFixed(1)} hours. Consider optimizing work schedules.`,
        icon: <AlertTriangle className="h-4 w-4" />,
      });
    }

    // Analyze productivity trends
    const topPerformers = performanceData
      .filter((p) => p.productivity > 3)
      .sort((a, b) => b.productivity - a.productivity);

    if (topPerformers.length > 0) {
      insights.push({
        type: "positive",
        title: "High Performers Identified",
        description: `${topPerformers[0].supName} leads with ${topPerformers[0].productivity} productivity score.`,
        icon: <TrendingUp className="h-4 w-4" />,
      });
    }

    // Analyze workload distribution
    const supervisorWorkload = attendanceData.reduce(
      (acc, record) => {
        acc[record.supervisorName] =
          (acc[record.supervisorName] || 0) + record.totalManhours;
        return acc;
      },
      {} as Record<string, number>,
    );

    const workloadValues = Object.values(supervisorWorkload);
    const maxWorkload = Math.max(...workloadValues);
    const minWorkload = Math.min(...workloadValues);

    if (maxWorkload / minWorkload > 2) {
      insights.push({
        type: "warning",
        title: "Uneven Workload Distribution",
        description:
          "Significant workload imbalance detected between supervisors.",
        icon: <AlertTriangle className="h-4 w-4" />,
      });
    } else {
      insights.push({
        type: "positive",
        title: "Balanced Workload",
        description: "Workload is well-distributed across supervisors.",
        icon: <CheckCircle className="h-4 w-4" />,
      });
    }

    // Efficiency analysis
    const avgEfficiency =
      performanceData.reduce((sum, p) => sum + p.productivity, 0) /
      performanceData.length;
    if (avgEfficiency > 2.5) {
      insights.push({
        type: "positive",
        title: "Above Average Efficiency",
        description: `Team productivity score of ${avgEfficiency.toFixed(1)} exceeds benchmarks.`,
        icon: <TrendingUp className="h-4 w-4" />,
      });
    }

    return insights;
  };

  const insights = generateInsights();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-primary" />
          <span>AI Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3 rounded-lg border bg-card"
            >
              <div
                className={`mt-0.5 ${
                  insight.type === "positive"
                    ? "text-green-600"
                    : insight.type === "warning"
                      ? "text-orange-600"
                      : "text-blue-600"
                }`}
              >
                {insight.icon}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-sm">{insight.title}</h4>
                  <Badge
                    variant={
                      insight.type === "positive" ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {insight.type}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {insight.description}
                </p>
              </div>
            </div>
          ))}

          {insights.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <Brain className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Analyzing data for insights...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
