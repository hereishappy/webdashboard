export interface AttendanceRecord {
  date: string;
  supervisorName: string;
  workerName: string;
  totalManhours: number;
  otHours: number;
  endShiftManhours: number;
}

export interface PerformanceRecord {
  supName: string;
  erection: number;
  dismantling: number;
  equivalent: number;
  totalManhours: number;
  productivity: number;
}

const ATTENDANCE_CSV_URL = "/api/csv/attendance";
const PERFORMANCE_CSV_URL = "/api/csv/performance";

function parseCSV(csvText: string): string[][] {
  const lines = csvText.trim().split("\n");
  return lines.map((line) => {
    const result = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  });
}

export async function fetchAttendanceData(): Promise<AttendanceRecord[]> {
  try {
    const response = await fetch(ATTENDANCE_CSV_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvText = await response.text();
    const rows = parseCSV(csvText);

    // Skip header row
    const data = rows.slice(1).map((row) => ({
      date: row[0] || "",
      supervisorName: row[1] || "",
      workerName: row[2] || "",
      totalManhours: parseFloat(row[3]) || 0,
      otHours: parseFloat(row[4]) || 0,
      endShiftManhours: parseFloat(row[5]) || 0,
    }));

    return data.length > 0 ? data : getMockAttendanceData();
  } catch (error) {
    console.error("Error fetching attendance data:", error);
    return getMockAttendanceData();
  }
}

export async function fetchPerformanceData(): Promise<PerformanceRecord[]> {
  try {
    const response = await fetch(PERFORMANCE_CSV_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const csvText = await response.text();
    const rows = parseCSV(csvText);

    // Skip header row
    const data = rows.slice(1).map((row) => ({
      supName: row[0] || "",
      erection: parseFloat(row[1]) || 0,
      dismantling: parseFloat(row[2]) || 0,
      equivalent: parseFloat(row[3]) || 0,
      totalManhours: parseFloat(row[4]) || 0,
      productivity: parseFloat(row[5]) || 0,
    }));

    return data.length > 0 ? data : getMockPerformanceData();
  } catch (error) {
    console.error("Error fetching performance data:", error);
    return getMockPerformanceData();
  }
}

function getMockAttendanceData(): AttendanceRecord[] {
  return [
    {
      date: "1-Aug-2025",
      supervisorName: "MAHENDRA KUMAR",
      workerName: "AMAN KUMAR",
      totalManhours: 8,
      otHours: 4,
      endShiftManhours: 12,
    },
    {
      date: "1-Aug-2025",
      supervisorName: "MAHENDRA KUMAR",
      workerName: "ATUL MAHADEO",
      totalManhours: 8,
      otHours: 4,
      endShiftManhours: 12,
    },
    {
      date: "1-Aug-2025",
      supervisorName: "HARKIRAT SINGH",
      workerName: "DAULAT YADAV",
      totalManhours: 8,
      otHours: 0,
      endShiftManhours: 8,
    },
    {
      date: "2-Aug-2025",
      supervisorName: "PINTU SAH",
      workerName: "RAJESH KUMAR",
      totalManhours: 8,
      otHours: 2,
      endShiftManhours: 10,
    },
  ];
}

function getMockPerformanceData(): PerformanceRecord[] {
  return [
    {
      supName: "MAHENDRA KUMAR",
      erection: 2846.55,
      dismantling: 1979.5,
      equivalent: 3836.3,
      totalManhours: 1100.0,
      productivity: 3.5,
    },
    {
      supName: "PINTU SAH",
      erection: 718,
      dismantling: 583.75,
      equivalent: 1009.9,
      totalManhours: 430.0,
      productivity: 2.3,
    },
    {
      supName: "SUNIL CHAUHAN",
      erection: 807.375,
      dismantling: 915.375,
      equivalent: 1265.1,
      totalManhours: 369.0,
      productivity: 3.4,
    },
    {
      supName: "HARKIRAT SINGH",
      erection: 1418.5,
      dismantling: 1218.25,
      equivalent: 2027.6,
      totalManhours: 967.0,
      productivity: 2.1,
    },
  ];
}

export function calculateAttendanceStats(data: AttendanceRecord[]) {
  const totalWorkers = new Set(data.map((r) => r.workerName)).size;
  const totalManhours = data.reduce((sum, r) => sum + r.totalManhours, 0);
  const totalOTHours = data.reduce((sum, r) => sum + r.otHours, 0);
  const avgProductivity = totalManhours / totalWorkers;

  return {
    totalWorkers,
    totalManhours,
    totalOTHours,
    avgProductivity: Math.round(avgProductivity * 100) / 100,
  };
}

export function calculatePerformanceStats(data: PerformanceRecord[]) {
  const totalErection = data.reduce((sum, r) => sum + r.erection, 0);
  const totalDismantling = data.reduce((sum, r) => sum + r.dismantling, 0);
  const avgProductivity =
    data.reduce((sum, r) => sum + r.productivity, 0) / data.length;
  const topPerformer = data.reduce((top, current) =>
    current.productivity > top.productivity ? current : top,
  );

  return {
    totalErection: Math.round(totalErection * 100) / 100,
    totalDismantling: Math.round(totalDismantling * 100) / 100,
    avgProductivity: Math.round(avgProductivity * 100) / 100,
    topPerformer: topPerformer.supName,
    topPerformerScore: topPerformer.productivity,
  };
}
