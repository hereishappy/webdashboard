import { RequestHandler } from "express";

const CSV_URLS = {
  attendance:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTRmYg3zmYTdR76pDZirRk3Q-jGChOHtKwW5sRhi9NmaOWjCCvMeGi_CzmtbEVRrVt_u4mgTQmyrjYB/pub?gid=1025965600&single=true&output=csv",
  performance:
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTRmYg3zmYTdR76pDZirRk3Q-jGChOHtKwW5sRhi9NmaOWjCCvMeGi_CzmtbEVRrVt_u4mgTQmyrjYB/pub?gid=1486071949&single=true&output=csv",
};

export const handleAttendanceCSV: RequestHandler = async (req, res) => {
  try {
    const response = await fetch(CSV_URLS.attendance);
    const csvData = await response.text();

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(csvData);
  } catch (error) {
    console.error("Error fetching attendance CSV:", error);
    res.status(500).json({ error: "Failed to fetch attendance data" });
  }
};

export const handlePerformanceCSV: RequestHandler = async (req, res) => {
  try {
    const response = await fetch(CSV_URLS.performance);
    const csvData = await response.text();

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(csvData);
  } catch (error) {
    console.error("Error fetching performance CSV:", error);
    res.status(500).json({ error: "Failed to fetch performance data" });
  }
};
