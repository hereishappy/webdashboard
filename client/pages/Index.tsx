import { useEffect, useState } from "react";
import { Users, Clock, TrendingUp, Target, CalendarDays, Zap, Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AttendanceRecord {
  date: string;
  supervisorName: string;
  workerName: string;
  totalManhours: number;
  otHours: number;
  endShiftManhours: number;
}

interface PerformanceRecord {
  supName: string;
  erection: number;
  dismantling: number;
  equivalent: number;
  totalManhours: number;
  productivity: number;
}

export default function Index() {
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Try to fetch live data first
        const [attendanceResponse, performanceResponse] = await Promise.all([
          fetch('/api/csv/attendance'),
          fetch('/api/csv/performance')
        ]);

        let attendanceData: AttendanceRecord[] = [];
        let performanceData: PerformanceRecord[] = [];

        if (attendanceResponse.ok) {
          const csvText = await attendanceResponse.text();
          const rows = csvText.trim().split('\n').map(line => line.split(','));
          attendanceData = rows.slice(1).map(row => ({
            date: row[0] || '',
            supervisorName: row[1] || '',
            workerName: row[2] || '',
            totalManhours: parseFloat(row[3]) || 0,
            otHours: parseFloat(row[4]) || 0,
            endShiftManhours: parseFloat(row[5]) || 0,
          }));
        }

        if (performanceResponse.ok) {
          const csvText = await performanceResponse.text();
          const rows = csvText.trim().split('\n').map(line => line.split(','));
          performanceData = rows.slice(1).map(row => ({
            supName: row[0] || '',
            erection: parseFloat(row[1]) || 0,
            dismantling: parseFloat(row[2]) || 0,
            equivalent: parseFloat(row[3]) || 0,
            totalManhours: parseFloat(row[4]) || 0,
            productivity: parseFloat(row[5]) || 0,
          }));
        }

        // Use mock data as fallback if no live data
        if (attendanceData.length === 0) {
          attendanceData = [
            { date: '1-Aug-2025', supervisorName: 'MAHENDRA KUMAR', workerName: 'AMAN KUMAR', totalManhours: 8, otHours: 4, endShiftManhours: 12 },
            { date: '1-Aug-2025', supervisorName: 'MAHENDRA KUMAR', workerName: 'ATUL MAHADEO', totalManhours: 8, otHours: 4, endShiftManhours: 12 },
            { date: '1-Aug-2025', supervisorName: 'HARKIRAT SINGH', workerName: 'DAULAT YADAV', totalManhours: 8, otHours: 0, endShiftManhours: 8 },
            { date: '2-Aug-2025', supervisorName: 'PINTU SAH', workerName: 'RAJESH KUMAR', totalManhours: 8, otHours: 2, endShiftManhours: 10 },
          ];
        }

        if (performanceData.length === 0) {
          performanceData = [
            { supName: 'MAHENDRA KUMAR', erection: 2846.55, dismantling: 1979.5, equivalent: 3836.3, totalManhours: 1100.0, productivity: 3.5 },
            { supName: 'PINTU SAH', erection: 718, dismantling: 583.75, equivalent: 1009.9, totalManhours: 430.0, productivity: 2.3 },
            { supName: 'SUNIL CHAUHAN', erection: 807.375, dismantling: 915.375, equivalent: 1265.1, totalManhours: 369.0, productivity: 3.4 },
            { supName: 'HARKIRAT SINGH', erection: 1418.5, dismantling: 1218.25, equivalent: 2027.6, totalManhours: 967.0, productivity: 2.1 },
          ];
        }

        setAttendanceData(attendanceData);
        setPerformanceData(performanceData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        // Use fallback data on error
        setAttendanceData([
          { date: '1-Aug-2025', supervisorName: 'MAHENDRA KUMAR', workerName: 'AMAN KUMAR', totalManhours: 8, otHours: 4, endShiftManhours: 12 },
          { date: '1-Aug-2025', supervisorName: 'MAHENDRA KUMAR', workerName: 'ATUL MAHADEO', totalManhours: 8, otHours: 4, endShiftManhours: 12 },
          { date: '1-Aug-2025', supervisorName: 'HARKIRAT SINGH', workerName: 'DAULAT YADAV', totalManhours: 8, otHours: 0, endShiftManhours: 8 },
          { date: '2-Aug-2025', supervisorName: 'PINTU SAH', workerName: 'RAJESH KUMAR', totalManhours: 8, otHours: 2, endShiftManhours: 10 },
        ]);
        setPerformanceData([
          { supName: 'MAHENDRA KUMAR', erection: 2846.55, dismantling: 1979.5, equivalent: 3836.3, totalManhours: 1100.0, productivity: 3.5 },
          { supName: 'PINTU SAH', erection: 718, dismantling: 583.75, equivalent: 1009.9, totalManhours: 430.0, productivity: 2.3 },
          { supName: 'SUNIL CHAUHAN', erection: 807.375, dismantling: 915.375, equivalent: 1265.1, totalManhours: 369.0, productivity: 3.4 },
          { supName: 'HARKIRAT SINGH', erection: 1418.5, dismantling: 1218.25, equivalent: 2027.6, totalManhours: 967.0, productivity: 2.1 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate stats
  const totalWorkers = new Set(attendanceData.map(r => r.workerName)).size;
  const totalManhours = attendanceData.reduce((sum, r) => sum + r.totalManhours, 0);
  const totalOTHours = attendanceData.reduce((sum, r) => sum + r.otHours, 0);
  const avgProductivity = performanceData.reduce((sum, r) => sum + r.productivity, 0) / Math.max(performanceData.length, 1);
  const topPerformer = performanceData.reduce((top, current) => 
    current.productivity > (top?.productivity || 0) ? current : top, performanceData[0] || { supName: 'N/A', productivity: 0 }
  );

  const StatCard = ({ title, value, subtitle, icon }: { title: string; value: string | number; subtitle?: string; icon?: React.ReactNode }) => (
    <Card className="animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="h-4 w-4 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );

  const DataTable = ({ title, data, columns }: { title: string; data: any[]; columns: any[] }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                {columns.map((column) => (
                  <th key={column.key} className="text-left p-2 font-medium text-muted-foreground">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 8).map((row, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                  {columns.map((column) => (
                    <td key={column.key} className="p-2">
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  const ProductivityChart = ({ data }: { data: PerformanceRecord[] }) => {
    const maxValue = Math.max(...data.map(d => d.productivity));
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Supervisor Productivity Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={item.supName} className="flex items-center space-x-3">
                <div className="w-20 text-sm font-medium truncate">
                  {item.supName.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                    <div 
                      className="h-2 rounded-full transition-all duration-500 ease-out bg-primary"
                      style={{ width: `${(item.productivity / maxValue) * 100}%` }}
                    />
                  </div>
                  <div className="w-12 text-sm font-mono text-right">
                    {item.productivity.toFixed(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const AIInsights = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Brain className="h-5 w-5 text-primary" />
          <span>AI Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start space-x-3 p-3 rounded-lg border bg-card">
            <div className="mt-0.5 text-green-600">
              <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-sm">High Performers Identified</h4>
                <Badge variant="default" className="text-xs">positive</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {topPerformer.supName} leads with {topPerformer.productivity} productivity score.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-3 rounded-lg border bg-card">
            <div className="mt-0.5 text-orange-600">
              <Clock className="h-4 w-4" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center space-x-2">
                <h4 className="font-medium text-sm">Overtime Analysis</h4>
                <Badge variant="secondary" className="text-xs">warning</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Average overtime is {(totalOTHours / Math.max(attendanceData.length, 1)).toFixed(1)} hours per worker.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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

  const attendanceColumns = [
    { key: 'date', label: 'Date' },
    { key: 'supervisorName', label: 'Supervisor' },
    { key: 'workerName', label: 'Worker' },
    { key: 'totalManhours', label: 'Hours', render: (value: number) => `${value}h` },
    { key: 'otHours', label: 'OT', render: (value: number) => value > 0 ? `${value}h` : '-' }
  ];

  const performanceColumns = [
    { key: 'supName', label: 'Supervisor' },
    { key: 'erection', label: 'Erection', render: (value: number) => value.toFixed(1) },
    { key: 'dismantling', label: 'Dismantling', render: (value: number) => value.toFixed(1) },
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
            value={totalWorkers}
            subtitle="Active workforce"
            icon={<Users className="h-4 w-4" />}
          />
          <StatCard
            title="Total Manhours"
            value={`${totalManhours}h`}
            subtitle="This period"
            icon={<Clock className="h-4 w-4" />}
          />
          <StatCard
            title="Avg Productivity"
            value={avgProductivity.toFixed(1)}
            subtitle="Performance score"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <StatCard
            title="Top Performer"
            value={topPerformer.supName.split(' ').map(n => n[0]).join('') + '.'}
            subtitle={`Score: ${topPerformer.productivity}`}
            icon={<Target className="h-4 w-4" />}
          />
        </div>

        {/* Charts and Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ProductivityChart data={performanceData} />
            <DataTable
              title="Recent Attendance Records"
              data={attendanceData}
              columns={attendanceColumns}
            />
          </div>
          
          <div className="space-y-6">
            <AIInsights />
          </div>
        </div>

        {/* Performance Details */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <DataTable
            title="Performance Overview"
            data={performanceData}
            columns={performanceColumns}
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
                  <div className="font-semibold text-lg">
                    {performanceData.reduce((sum, p) => sum + p.erection, 0).toFixed(1)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Total Dismantling</div>
                  <div className="font-semibold text-lg">
                    {performanceData.reduce((sum, p) => sum + p.dismantling, 0).toFixed(1)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">OT Hours</div>
                  <div className="font-semibold text-lg">{totalOTHours}h</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Efficiency</div>
                  <div className="font-semibold text-lg">{(totalManhours / Math.max(totalWorkers, 1)).toFixed(1)}h</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
