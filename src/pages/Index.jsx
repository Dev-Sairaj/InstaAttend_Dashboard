import { useEffect, useState, useCallback } from "react";
import MainLayout from "../components/layout/MainLayout";
import { dashboardService } from "../api/services/dashboard.service.js";
import { authService } from "../api/services/auth.service";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { DashboardSkeleton } from "../components/skeleton/DashboardSkeleton.jsx";
import MiniCalendar from "../components/ui/MiniCalendar.jsx";
import CircularStat from "../components/ui/CircularStat.jsx";
import NotificationsCard from "../components/ui/NotificationsCard.jsx";

// dashboard.service.js returns presentPercentage/leavePercentage as
// display-ready strings (e.g. "90.3%"). We need the raw number to drive
// the CircularStat conic-gradient rings, so this strips it back out.
const parsePercent = (value) => {
  if (value === undefined || value === null) return 0;
  const n = parseFloat(String(value).replace("%", "").trim());
  return isNaN(n) ? 0 : n;
};

const Index = () => {
  const [stat, setStat] = useState({});
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      // dashboardService.getStats() resolves directly to the stats
      // payload (no extra .data unwrap needed here) — see dashboard.service.js
      const data = await dashboardService.getStats();

      const dailyStats = data.dailyStats || [];
      // The backend's /dashboard/stats doesn't currently expose a
      // dedicated "late today" / "absent today" figure, but dailyStats
      // (used for the weekly chart) already carries per-day
      // present/late/absent counts — its last entry is today. If the
      // array is empty (no seeded/checked-in attendance yet), these
      // correctly fall back to 0 rather than guessing.
      const todayStats = dailyStats[dailyStats.length - 1] || {};

      const totalEmployees = data.totalEmployees || 0;
      const lateToday = todayStats.late ?? 0;
      const absentToday = todayStats.absent ?? 0;

      setStat({
        totalEmployees,
        presentToday: data.presentToday || 0,
        onLeave: data.onLeave || 0,
        avgWorkingHours: data.avgWorkingHours || 0,
        presentPercentage: parsePercent(data.presentPercentage),
        leavePercentage: parsePercent(data.leavePercentage),
        workingHoursChange: data.workingHoursChange || "",
        lateToday,
        absentToday,
        latePercentage:
          totalEmployees > 0
            ? Math.round((lateToday / totalEmployees) * 100)
            : 0,
        absentPercentage:
          totalEmployees > 0
            ? Math.round((absentToday / totalEmployees) * 100)
            : 0,
      });
      setAttendanceData(dailyStats);
    } catch (error) {
      console.error("Error fetching stats", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const currentUser = authService.getCurrentUser();
  const username = currentUser ? currentUser.username : "User";

  return (
    <MainLayout>
      {isLoading ? (
        <DashboardSkeleton />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* ---- Main column ---- */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <div className="flex flex-col items-center text-center md:flex-row md:justify-between md:items-center md:text-left gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Dashboard
                </h1>
                <p className="text-gray-500">Welcome back, {username} 👋</p>
              </div>
            </div>

            {/* Today's Attendance Status — now the primary hero section */}
            <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <CardTitle>Today's Attendance Status</CardTitle>
                  <CardDescription>
                    {stat.avgWorkingHours
                      ? `Avg. working hours: ${stat.avgWorkingHours} hrs ${stat.workingHoursChange || ""}`
                      : "Live breakdown across the team"}
                  </CardDescription>
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-800">
                    {stat.totalEmployees}
                  </span>{" "}
                  total employees
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 justify-items-center">
                  <CircularStat
                    percentage={stat.presentPercentage}
                    color="#22c55e"
                    label="Present"
                    value={stat.presentToday}
                  />
                  <CircularStat
                    percentage={stat.latePercentage}
                    color="#f59e0b"
                    label="Late"
                    value={stat.lateToday}
                  />
                  <CircularStat
                    percentage={stat.absentPercentage}
                    color="#ef4444"
                    label="Absent"
                    value={stat.absentToday}
                  />
                  <CircularStat
                    percentage={stat.leavePercentage}
                    color="#8262ef"
                    label="On Leave"
                    value={stat.onLeave}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Weekly Trends bar chart (unchanged data source) */}
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Weekly Trends</CardTitle>
                <CardDescription>Last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={attendanceData}
                      margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="present" fill="#4ade80" name="Present" />
                      <Bar dataKey="absent" fill="#f87171" name="Absent" />
                      <Bar dataKey="late" fill="#fbbf24" name="Late" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ---- Right rail: today pill + live calendar + notifications ---- */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex justify-center lg:justify-end">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-instattend-50 text-instattend-600">
                <span className="text-sm font-medium">
                  Today:{" "}
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <MiniCalendar />
            <NotificationsCard />
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Index;