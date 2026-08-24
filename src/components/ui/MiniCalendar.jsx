import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameMonth,
  isSameDay,
  startOfDay,
} from "date-fns";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { dashboardService } from "../../api/services/dashboard.service.js";
import { cn } from "../../lib/utils";

const WEEKDAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

/**
 * Compact month calendar for the dashboard's top-right rail.
 *
 * Wired to GET /dashboard/attendance-calendar (via dashboardService).
 * Days that have a real attendance record get a small mint dot under
 * the date — days with no backend data simply show no dot. Nothing here
 * is fabricated; if the API returns nothing for a month, the calendar
 * still renders correctly, just without indicators.
 */
const MiniCalendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarData, setCalendarData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const today = startOfDay(new Date());

  const fetchMonth = useCallback(async (monthAnchor) => {
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
      console.error("Failed to fetch mini calendar data", e);
      setCalendarData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMonth(currentMonth);
  }, [currentMonth, fetchMonth]);

  const attendanceMap = useMemo(() => {
    const map = new Map();
    (calendarData?.records || []).forEach((r) => {
      map.set(r.date, r);
    });
    return map;
  }, [calendarData]);

  const weeks = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const days = [];
    let day = gridStart;
    while (day <= gridEnd) {
      days.push(day);
      day = addDays(day, 1);
    }
    const w = [];
    for (let i = 0; i < days.length; i += 7) w.push(days.slice(i, i + 7));
    return w;
  }, [currentMonth]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold tracking-wide text-instattend-600 uppercase">
            {format(currentMonth, "MMMM yyyy")}
          </span>
          {isLoading && (
            <Loader2 className="h-3 w-3 text-instattend-400 animate-spin" />
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
            className="p-1 rounded hover:bg-gray-100 text-gray-400"
            aria-label="Previous month"
            type="button"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-1.5 py-0.5 rounded text-[10px] font-medium text-instattend-600 hover:bg-instattend-50"
            type="button"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
            className="p-1 rounded hover:bg-gray-100 text-gray-400"
            aria-label="Next month"
            type="button"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center">
        {WEEKDAY_LABELS.map((d) => (
          <span key={d} className="text-[10px] font-medium text-gray-400">
            {d}
          </span>
        ))}
        {weeks.flat().map((d) => {
          const key = format(d, "yyyy-MM-dd");
          const inMonth = isSameMonth(d, currentMonth);
          const isToday = isSameDay(d, today);
          const hasData = attendanceMap.has(key);
          return (
            <div key={key} className="flex flex-col items-center py-0.5">
              <span
                className={cn(
                  "flex items-center justify-center h-6 w-6 rounded-full text-[11px] transition-colors",
                  !inMonth && "text-gray-300",
                  inMonth && !isToday && "text-gray-600",
                  isToday && "bg-instattend-500 text-white font-semibold",
                )}
              >
                {format(d, "d")}
              </span>
              <span
                className={cn(
                  "h-1 w-1 rounded-full mt-0.5",
                  hasData ? "bg-instattend-400" : "bg-transparent",
                )}
              />
            </div>
          );
        })}
      </div>

      {!isLoading && !calendarData?.records?.length && (
        <p className="text-[11px] text-gray-400 mt-3 text-center">
          No attendance records for this month yet
        </p>
      )}
    </div>
  );
};

export default MiniCalendar;
