import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface AttendanceRecord {
  date: string;
  supervisorName: string;
  workerName: string;
  totalManhours: number;
  otHours: number;
  endShiftManhours: number;
}

interface WorkerCalendarProps {
  workerName: string;
  attendanceRecords: AttendanceRecord[];
}

export function WorkerCalendar({ workerName, attendanceRecords }: WorkerCalendarProps) {
  // Generate a simple calendar for the current month
  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    const days = [];
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // Start from Sunday
    
    // Generate 5 weeks (35 days) to cover the month
    for (let i = 0; i < 35; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      days.push(currentDate);
    }
    
    return days;
  };

  const getAttendanceForDate = (date: Date) => {
    const dateStr = date.toLocaleDateString('en-GB', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).replace(/\s/g, '-');
    
    return attendanceRecords.find(record => 
      record.workerName === workerName && 
      (record.date === dateStr || record.date.includes(date.getDate().toString()))
    );
  };

  const getDayStatus = (date: Date, attendance?: AttendanceRecord) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const isPastMonth = date.getMonth() !== today.getMonth();
    
    if (isPastMonth) return 'text-gray-300';
    if (isToday) return 'bg-primary text-primary-foreground font-bold';
    if (attendance) {
      if (attendance.otHours > 0) return 'bg-orange-100 text-orange-800 border-orange-200';
      return 'bg-green-100 text-green-800 border-green-200';
    }
    return 'text-gray-600 hover:bg-gray-50';
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span className="truncate">{workerName}</span>
          <Badge variant="outline" className="text-xs">
            {attendanceRecords.filter(r => r.workerName === workerName).length} days
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          {/* Calendar header */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-gray-500 mb-2">
            {weekDays.map((day, index) => (
              <div key={`${workerName}-weekday-${index}`} className="p-1">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => {
              const attendance = getAttendanceForDate(date);
              const dayStatus = getDayStatus(date, attendance);

              return (
                <div
                  key={`${workerName}-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${index}`}
                  className={`
                    aspect-square flex items-center justify-center text-xs rounded border
                    transition-all duration-150 cursor-pointer
                    ${dayStatus}
                  `}
                  title={attendance ?
                    `${date.toLocaleDateString()}: ${attendance.totalManhours}h work${attendance.otHours > 0 ? `, ${attendance.otHours}h OT` : ''}` :
                    date.toLocaleDateString()
                  }
                >
                  {date.getDate()}
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-gray-500 mt-3 pt-2 border-t">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
              <span>Present</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-100 border border-orange-200 rounded"></div>
              <span>OT</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
