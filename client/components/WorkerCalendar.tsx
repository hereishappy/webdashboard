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

export function WorkerCalendar({
  workerName,
  attendanceRecords,
}: WorkerCalendarProps) {
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
    const dateStr = date
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      .replace(/\s/g, "-");

    return attendanceRecords.find(
      (record) =>
        record.workerName === workerName &&
        (record.date === dateStr ||
          record.date.includes(date.getDate().toString())),
    );
  };

  const getDayStatus = (date: Date, attendance?: AttendanceRecord) => {
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    const isPastMonth = date.getMonth() !== today.getMonth();
    const currentMonth = today.getMonth();
    const dateMonth = date.getMonth();

    if (isPastMonth) return "text-gray-300 text-xs";
    if (isToday) return "bg-primary text-primary-foreground font-bold text-xs";

    // For current month working days, check if present or absent
    if (dateMonth === currentMonth && date.getDate() <= today.getDate()) {
      if (attendance) {
        // Present
        return "bg-green-500 text-white font-medium text-xs";
      } else {
        // Absent (red)
        return "bg-red-500 text-white font-medium text-xs";
      }
    }

    // Future dates or other months
    return "text-gray-400 hover:bg-gray-50 text-xs";
  };

  const getDayContent = (date: Date, attendance?: AttendanceRecord) => {
    if (attendance && attendance.otHours > 0) {
      return `P${attendance.otHours}`;
    }
    return date.getDate();
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium flex items-center justify-between">
          <span className="truncate">{workerName}</span>
          <Badge variant="outline" className="text-xs">
            {
              attendanceRecords.filter((r) => r.workerName === workerName)
                .length
            }
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1">
          {/* Calendar header */}
          <div className="grid grid-cols-7 gap-0.5 text-center text-xs font-medium text-gray-500 mb-1">
            {weekDays.map((day, index) => (
              <div key={`${workerName}-weekday-${index}`} className="p-0.5">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {calendarDays.map((date, index) => {
              const attendance = getAttendanceForDate(date);
              const dayStatus = getDayStatus(date, attendance);
              const dayContent = getDayContent(date, attendance);

              return (
                <div
                  key={`${workerName}-${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${index}`}
                  className={`
                    w-6 h-6 flex items-center justify-center rounded border
                    transition-all duration-150 cursor-pointer
                    ${dayStatus}
                  `}
                  title={
                    attendance
                      ? `${date.toLocaleDateString()}: Present${attendance.otHours > 0 ? ` + ${attendance.otHours}h OT` : ""}`
                      : `${date.toLocaleDateString()}: ${date.getDate() <= new Date().getDate() && date.getMonth() === new Date().getMonth() ? "Absent" : "Future"}`
                  }
                >
                  {dayContent}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-xs text-gray-500 mt-2 pt-1 border-t">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded"></div>
              <span>P</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-red-500 rounded"></div>
              <span>A</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
