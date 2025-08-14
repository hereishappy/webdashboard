import { useEffect, useState } from "react";
import { Users, Clock, TrendingUp, Zap, CalendarDays, Target } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { SimpleChart } from "@/components/SimpleChart";
import { DataTable } from "@/components/DataTable";
import { AIInsights } from "@/components/AIInsights";
import { 
  fetchAttendanceData, 
  fetchPerformanceData, 
  calculateAttendanceStats, 
  calculatePerformanceStats,
  AttendanceRecord,
  PerformanceRecord 
} from "@/lib/data";

export default function Index() {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [attendance, performance] = await Promise.all([
          fetchAttendanceData(),
          fetchPerformanceData()
        ]);
        setAttendanceData(attendance);
        setPerformanceData(performance);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const attendanceStats = calculateAttendanceStats(attendanceData);
  const performanceStats = calculatePerformanceStats(performanceData);

  const performanceChartData = performanceData.map(p => ({
    name: p.supName.split(' ').map(n => n[0]).join(''),
    value: p.productivity
  }));

  const attendanceColumns = [
    { key: 'date', label: 'Date' },
    { key: 'supervisorName', label: 'Supervisor' },
    { key: 'workerName', label: 'Worker' },
    { 
      key: 'totalManhours', 
      label: 'Hours',
      render: (value: number) => `${value}h`
    },
    { 
      key: 'otHours', 
      label: 'OT',
      render: (value: number) => value > 0 ? `${value}h` : '-'
    }
  ];

  const performanceColumns = [
    { key: 'supName', label: 'Supervisor' },
    { 
      key: 'erection', 
      label: 'Erection',
      render: (value: number) => value.toFixed(1)
    },
    { 
      key: 'dismantling', 
      label: 'Dismantling',
      render: (value: number) => value.toFixed(1)
    },
    { 
      key: 'productivity', 
      label: 'Productivity',
      render: (value: number) => (
        <span className={`font-medium ${value > 3 ? 'text-green-600' : value > 2 ? 'text-yellow-600' : 'text-red-600'}`}>
          {value.toFixed(1)}
        </span>
      )
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                WorkForce Analytics
              </h1>
              <p className="text-sm text-muted-foreground">
                AI-powered workforce insights dashboard
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Workers"
            value={attendanceStats.totalWorkers}
            subtitle="Active workforce"
            icon={<Users className="h-4 w-4" />}
          />
          <StatCard
            title="Total Manhours"
            value={`${attendanceStats.totalManhours}h`}
            subtitle="This period"
            icon={<Clock className="h-4 w-4" />}
          />
          <StatCard
            title="Avg Productivity"
            value={performanceStats.avgProductivity}
            subtitle="Performance score"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <StatCard
            title="Top Performer"
            value={performanceStats.topPerformer}
            subtitle={`Score: ${performanceStats.topPerformerScore}`}
            icon={<Target className="h-4 w-4" />}
          />
        </div>

        {/* Charts and Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SimpleChart
              title="Supervisor Productivity Scores"
              data={performanceChartData}
              className="animate-slide-up"
            />
            
            <DataTable
              title="Recent Attendance Records"
              data={attendanceData}
              columns={attendanceColumns}
              maxRows={8}
              className="animate-slide-up"
            />
          </div>
          
          <div className="space-y-6">
            <AIInsights 
              attendanceData={attendanceData}
              performanceData={performanceData}
            />
          </div>
        </div>

        {/* Performance Details */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <DataTable
            title="Performance Overview"
            data={performanceData}
            columns={performanceColumns}
            className="animate-slide-up"
          />
          
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-6 border">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <Zap className="h-5 w-5 text-primary mr-2" />
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Total Erection</div>
                  <div className="font-semibold text-lg">{performanceStats.totalErection}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Total Dismantling</div>
                  <div className="font-semibold text-lg">{performanceStats.totalDismantling}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">OT Hours</div>
                  <div className="font-semibold text-lg">{attendanceStats.totalOTHours}h</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Efficiency</div>
                  <div className="font-semibold text-lg">{attendanceStats.avgProductivity}h</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
