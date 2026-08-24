import React, { useCallback, useEffect, useMemo, useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import CalendarView from "../components/ui/CalendarView";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import {
  CalendarDays,
  PartyPopper,
  Users,
  UserCheck,
  UserX,
} from "lucide-react";
import {
  format,
  isSameDay,
  isAfter,
  startOfDay,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { getHolidays } from "../data/holidays";
import { dashboardService } from "../api/services/dashboard.service.js";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const [calendarData, setCalendarData] = useState(null); // raw API payload for the visible month
  const [isLoading, setIsLoading] = useState(false);

  const holidays = useMemo(() => getHolidays(), []);

  // Sort ascending by date once, reused for the upcoming list.
  const sortedHolidays = useMemo(
    () => [...holidays].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [holidays],
  );

  const upcomingHolidays = useMemo(() => {
    const today = startOfDay(new Date());
    return sortedHolidays
      .filter(
        (h) =>
          isAfter(new Date(h.date), today) ||
          isSameDay(new Date(h.date), today),
      )
      .slice(0, 6);
  }, [sortedHolidays]);

  const selectedHoliday = useMemo(() => {
    if (!selectedDate) return null;
    const key = format(selectedDate, "yyyy-MM-dd");
    return holidays.find((h) => h.date === key) || null;
  }, [selectedDate, holidays]);

  // Fetch live per-date attendance counts from the admin dashboard API
  // whenever the visible month changes.
  const fetchAttendanceCalendar = useCallback(async (monthAnchor) => {
    setIsLoading(true);
    try {
      const startDate = format(startOfMonth(monthAnchor), "yyyy-MM-dd");
      const endDate = format(endOfMonth(monthAnchor), "yyyy-MM-dd");
      const data = await dashboardService.getAttendanceCalendar(
        "custom",
        startDate,
        endDate,
      );
      setCalendarData(data);
    } catch (e) {
      console.error("Failed to fetch attendance calendar", e);
      setCalendarData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendanceCalendar(currentMonth);
  }, [currentMonth, fetchAttendanceCalendar]);

  const attendanceMap = useMemo(() => {
    const map = new Map();
    (calendarData?.records || []).forEach((r) => {
      map.set(r.date, {
        presentCount: r.presentCount ?? 0,
        absentCount: r.absentCount ?? 0,
        halfDayCount: r.halfDayCount ?? 0,
      });
    });
    return map;
  }, [calendarData]);

  const selectedStats = useMemo(() => {
    if (!selectedDate) return null;
    const key = format(selectedDate, "yyyy-MM-dd");
    return attendanceMap.get(key) || null;
  }, [selectedDate, attendanceMap]);

  // Simple month snapshot from the live payload
  const monthSnapshot = useMemo(() => {
    if (!calendarData?.records?.length) return null;
    const totalPresent = calendarData.records.reduce(
      (sum, r) => sum + (r.presentCount || 0),
      0,
    );
    const totalAbsent = calendarData.records.reduce(
      (sum, r) => sum + (r.absentCount || 0),
      0,
    );
    const avgPresent = Math.round(totalPresent / calendarData.records.length);
    return {
      totalEmployees: calendarData.totalEmployees ?? 0,
      avgPresent,
      totalAbsent,
    };
  }, [calendarData]);

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6 px-4 sm:px-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Calendar
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Sundays, national holidays and live attendance at a glance
          </p>
        </div>
      </div>

      {/* Live month snapshot from the admin attendance-calendar API */}
      {monthSnapshot && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 px-2 sm:px-0">
          <Card className="border-none shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-blue-500 text-white">
                <Users className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Employees</p>
                <p className="text-lg font-bold text-gray-800">
                  {monthSnapshot.totalEmployees}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-green-500 text-white">
                <UserCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Avg. Present / Day</p>
                <p className="text-lg font-bold text-gray-800">
                  {monthSnapshot.avgPresent}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-red-500 text-white">
                <UserX className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Absences (Month)</p>
                <p className="text-lg font-bold text-gray-800">
                  {monthSnapshot.totalAbsent}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-2 sm:px-0">
        {/* Main calendar */}
        <div className="lg:col-span-2 space-y-4">
          <CalendarView
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
            holidays={holidays}
            attendanceMap={attendanceMap}
            isLoading={isLoading}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 bg-white rounded-lg shadow-sm border border-gray-100 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-gray-200 border border-gray-300" />
              <span className="text-xs text-gray-600">Sunday</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-instattend-500" />
              <span className="text-xs text-gray-600">National Holiday</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="text-xs text-gray-600">Optional Holiday</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-5 w-5 rounded-full bg-instattend-500 flex items-center justify-center text-[10px] text-white font-semibold">
                {format(new Date(), "d")}
              </span>
              <span className="text-xs text-gray-600">Today</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-green-600">
                42P
              </span>
              <span className="text-[10px] font-medium text-red-500">6A</span>
              <span className="text-xs text-gray-600">
                Present / Absent (live)
              </span>
            </div>
          </div>

          {/* Selected date detail */}
          {selectedDate && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 px-4 py-3">
              <p className="text-sm font-semibold text-gray-800">
                {format(selectedDate, "EEEE, dd MMMM yyyy")}
              </p>
              {selectedHoliday ? (
                <p className="text-sm text-instattend-600 mt-1">
                  {selectedHoliday.name}
                </p>
              ) : selectedDate.getDay() === 0 ? (
                <p className="text-sm text-gray-500 mt-1">Sunday</p>
              ) : selectedStats ? (
                <p className="text-sm text-gray-600 mt-1">
                  <span className="text-green-600 font-medium">
                    {selectedStats.presentCount} Present
                  </span>
                  {"  ·  "}
                  <span className="text-red-500 font-medium">
                    {selectedStats.absentCount} Absent
                  </span>
                  {selectedStats.halfDayCount > 0 && (
                    <>
                      {"  ·  "}
                      <span className="text-amber-600 font-medium">
                        {selectedStats.halfDayCount} Half-day
                      </span>
                    </>
                  )}
                </p>
              ) : (
                <p className="text-sm text-gray-400 mt-1">
                  No attendance data for this day
                </p>
              )}
            </div>
          )}
        </div>

        {/* Upcoming holidays panel */}
        <div>
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <PartyPopper className="h-4 w-4 text-instattend-500" />
                Upcoming Holidays
              </CardTitle>
              <CardDescription>Next holidays from today</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingHolidays.length === 0 ? (
                <div className="flex flex-col items-center text-center py-8 text-gray-400">
                  <CalendarDays className="h-8 w-8 mb-2" />
                  <p className="text-sm">No upcoming holidays found</p>
                </div>
              ) : (
                upcomingHolidays.map((h) => (
                  <div
                    key={h.date}
                    className="flex items-center justify-between gap-3 border-b border-gray-100 last:border-b-0 pb-3 last:pb-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {h.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(new Date(h.date), "EEEE, dd MMM yyyy")}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-1 rounded-full whitespace-nowrap ${
                        h.type === "optional"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-instattend-100 text-instattend-700"
                      }`}
                    >
                      {h.type === "optional" ? "Optional" : "National"}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Calendar;
