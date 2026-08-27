import { useEffect, useState, useCallback } from "react";
import MainLayout from "../components/layout/MainLayout";
import { dashboardService } from "../api/services/dashboard.service.js";
import { authService } from "../api/services/auth.service";
import { chartTooltipStyle, statusColors, hexToRgba } from "../lib/theme.js";
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
        <div
          className="-m-6 min-h-[calc(100vh-4rem)] p-4 md:p-6"
          style={{ backgroundColor: "hsl(var(--dashboard-bg))" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* ---- Main column ---- */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              <div className="flex flex-col items-center text-center md:flex-row md:justify-between md:items-center md:text-left gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
                    Dashboard
                  </h1>
                  <p className="text-text-muted">
                    Your attendance overview, all in one place
                  </p>
                </div>
              </div>

              {/* Today's Attendance Status — now the primary hero section */}
              <Card className="glass-panel border border-white/60">
                <CardHeader className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-white/50 pb-4">
                  <div>
                    {/* Stepped down one size + slightly muted so it reads
                        as a section header, not a top-level page title —
                        "Dashboard" above is now the clear #1 in the hierarchy. */}
                    <CardTitle className="text-base md:text-lg font-semibold text-text-primary/90">
                      Today's Attendance Status
                    </CardTitle>
                    <CardDescription className="text-text-muted">
                      {stat.avgWorkingHours
                        ? `Avg. working hours: ${stat.avgWorkingHours} hrs ${stat.workingHoursChange || ""}`
                        : "Live breakdown across the team"}
                    </CardDescription>
                  </div>
                  <div className="text-sm text-text-muted px-3 py-1.5 rounded-full border border-white/60 bg-white/30">
                    <span className="font-semibold text-text-primary tabular-nums">
                      {stat.totalEmployees}
                    </span>{" "}
                    total employees
                  </div>
                </CardHeader>
                <CardContent className="relative pt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 justify-items-center">
                    {[
                      {
                        percentage: stat.presentPercentage,
                        color: statusColors.present,
                        label: "Present",
                        value: stat.presentToday,
                      },
                      {
                        percentage: stat.latePercentage,
                        color: statusColors.late,
                        label: "Late",
                        value: stat.lateToday,
                      },
                      {
                        percentage: stat.absentPercentage,
                        color: statusColors.absent,
                        label: "Absent",
                        value: stat.absentToday,
                      },
                      {
                        percentage: stat.leavePercentage,
                        color: statusColors.leave,
                        label: "On Leave",
                        value: stat.onLeave,
                      },
                    ].map((s) => (
                      // Status-tinted tile: faint wash + border matching the
                      // stat's own color, so each tile is color-coded at a
                      // glance instead of all four being identical glass.
                      <div
                        key={s.label}
                        className="flex w-full justify-center p-3 rounded-xl backdrop-blur-sm border shadow-sm transition-all duration-300 ease-smooth hover:-translate-y-0.5"
                        style={{
                          backgroundColor: hexToRgba(s.color, 0.08),
                          borderColor: hexToRgba(s.color, 0.25),
                        }}
                      >
                        <CircularStat
                          percentage={s.percentage}
                          color={s.color}
                          label={s.label}
                          value={s.value}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Trends bar chart (unchanged data source) */}
              <Card className="glass-panel border border-white/60">
                <CardHeader className="relative border-b border-white/50 pb-4">
                  <CardTitle className="text-base md:text-lg font-semibold text-text-primary/90">
                    Weekly Trends
                  </CardTitle>
                  <CardDescription className="text-text-muted">
                    Last 7 days
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative pt-4">
                  <div className="h-56 sm:h-60 rounded-xl border border-white/60 bg-white/20 p-2">
                    <div className="h-full w-full rounded-lg border border-white/30 bg-white/10 p-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={attendanceData}
                          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                        >
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#D9F5E9"
                            vertical={false}
                          />
                          <XAxis
                            dataKey="date"
                            tick={{ fill: "#647589", fontSize: 12 }}
                            axisLine={{ stroke: "#D9F5E9" }}
                            tickLine={false}
                          />
                          <YAxis
                            allowDecimals={false}
                            tick={{ fill: "#647589", fontSize: 12 }}
                            axisLine={{ stroke: "#D9F5E9" }}
                            tickLine={false}
                          />
                          <Tooltip
                            cursor={{ fill: "rgba(16,185,129,0.06)" }}
                            contentStyle={chartTooltipStyle}
                            labelStyle={{ color: "#647589" }}
                          />
                          <Legend />
                          {/* Animation turned back on with a slight stagger
                              per series so the chart feels alive on load
                              instead of a static image. */}
                          <Bar
                            dataKey="present"
                            fill={statusColors.present}
                            name="Present"
                            radius={[6, 6, 0, 0]}
                            isAnimationActive
                            animationDuration={900}
                            animationEasing="ease-out"
                          />
                          <Bar
                            dataKey="absent"
                            fill={statusColors.absent}
                            name="Absent"
                            radius={[6, 6, 0, 0]}
                            isAnimationActive
                            animationDuration={900}
                            animationEasing="ease-out"
                            animationBegin={100}
                          />
                          <Bar
                            dataKey="late"
                            fill={statusColors.late}
                            name="Late"
                            radius={[6, 6, 0, 0]}
                            isAnimationActive
                            animationDuration={900}
                            animationEasing="ease-out"
                            animationBegin={200}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ---- Right rail: today pill + live calendar + notifications ---- */}
            <div className="space-y-4 md:space-y-6">
              <div className="flex justify-center lg:justify-end">
                <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/40 backdrop-blur-sm text-primary border border-white/60 shadow-sm">
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

              <Card className="glass-panel border border-white/60 p-5">
                <div className="relative flex items-center gap-2 mb-4 pb-3 border-b border-white/50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                  <span className="text-sm font-semibold text-text-primary">
                    Calendar
                  </span>
                </div>
                <MiniCalendar />
              </Card>

              <Card className="glass-panel border border-white/60 p-5">
                <NotificationsCard />
              </Card>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Index;
