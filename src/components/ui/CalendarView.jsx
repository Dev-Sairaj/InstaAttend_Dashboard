import React from "react";
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
  isSunday,
  isAfter,
  startOfDay,
} from "date-fns";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "./button";
import { cn } from "../../lib/utils";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Generic month-view calendar wired to live attendance data.
 *
 * @param {Date} currentMonth - any date within the month currently displayed
 * @param {(date: Date) => void} onMonthChange - called with the new anchor date on prev/next/today
 * @param {Array<{date: string, name: string, type: string}>} holidays - holiday list (date as yyyy-MM-dd)
 * @param {Map<string, {presentCount:number, absentCount:number, halfDayCount:number}>} attendanceMap
 *        - per-date live attendance counts, keyed by yyyy-MM-dd, from the admin attendance-calendar API
 * @param {boolean} isLoading - true while attendance data for the visible month is being fetched
 * @param {Date|null} selectedDate - currently selected day, for highlighting
 * @param {(date: Date) => void} onSelectDate - called when a day cell is clicked
 */
const CalendarView = ({
  currentMonth,
  onMonthChange,
  holidays = [],
  attendanceMap,
  isLoading = false,
  selectedDate,
  onSelectDate,
}) => {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const gridStart = startOfWeek(monthStart);
  const gridEnd = endOfWeek(monthEnd);
  const today = startOfDay(new Date());

  const holidayMap = React.useMemo(() => {
    const map = new Map();
    holidays.forEach((h) => map.set(h.date, h));
    return map;
  }, [holidays]);

  const days = [];
  let day = gridStart;
  while (day <= gridEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const goToPrevMonth = () => onMonthChange(subMonths(currentMonth, 1));
  const goToNextMonth = () => onMonthChange(addMonths(currentMonth, 1));
  const goToToday = () => onMonthChange(new Date());

  return (
    <div className="relative bg-surface/60 backdrop-blur-xl rounded-2xl border border-border shadow-[0_8px_32px_rgba(15,23,42,0.06)] overflow-hidden">
      {/* ambient glow, same language as the rest of the dashboard */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 -left-16 h-56 w-56 rounded-full bg-primary/10 blur-[90px]" />
        <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-info/5 blur-[90px]" />
      </div>

      {/* Header: month/year + navigation */}
      <div className="relative flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <h2 className="text-lg sm:text-xl font-bold text-text-primary">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          {isLoading && (
            <Loader2 className="h-4 w-4 text-primary animate-spin" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToToday}
            className="border-border bg-surface/60 backdrop-blur-sm hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all duration-300 ease-smooth"
          >
            Today
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 border-border bg-surface/60 backdrop-blur-sm hover:bg-primary/10 hover:text-primary hover:border-primary/30 hover:-translate-x-0.5 transition-all duration-300 ease-smooth"
            onClick={goToPrevMonth}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 border-border bg-surface/60 backdrop-blur-sm hover:bg-primary/10 hover:text-primary hover:border-primary/30 hover:translate-x-0.5 transition-all duration-300 ease-smooth"
            onClick={goToNextMonth}
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekday header */}
      <div className="relative grid grid-cols-7 border-b border-border bg-primary/[0.03]">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className={cn(
              "text-center text-xs font-semibold uppercase tracking-wide py-2",
              label === "Sun" ? "text-text-muted/60" : "text-text-muted",
            )}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Weeks grid */}
      <div className="relative divide-y divide-border">
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="grid grid-cols-7">
            {week.map((d) => {
              const dateKey = format(d, "yyyy-MM-dd");
              const holiday = holidayMap.get(dateKey);
              const inMonth = isSameMonth(d, currentMonth);
              const sunday = isSunday(d);
              const isToday = isSameDay(d, new Date());
              const selected = selectedDate && isSameDay(d, selectedDate);
              const stats = attendanceMap?.get(dateKey);
              // Only show attendance figures for days that have already happened —
              // future dates in the grid won't have real check-in data yet.
              const showStats = stats && !isAfter(startOfDay(d), today);

              return (
                <button
                  key={dateKey}
                  onClick={() => onSelectDate?.(d)}
                  className={cn(
                    "group relative flex flex-col items-center justify-start gap-1 py-2.5 sm:py-3 min-h-[68px] sm:min-h-[84px] border-r border-border last:border-r-0 transition-all duration-300 ease-smooth",
                    !inMonth && "opacity-40",
                    sunday && "bg-black/[0.015]",
                    holiday && "bg-primary/[0.05]",
                    selected && "ring-2 ring-inset ring-primary shadow-[0_0_16px_rgba(16,185,129,0.15)]",
                    "hover:bg-primary/[0.06]",
                  )}
                  title={holiday ? holiday.name : undefined}
                >
                  <span
                    className={cn(
                      "flex items-center justify-center h-7 w-7 rounded-full text-sm font-medium transition-all duration-300 ease-smooth",
                      isToday &&
                        "bg-primary text-white shadow-[0_0_14px_rgba(16,185,129,0.55)] group-hover:scale-110",
                      !isToday && sunday && "text-text-muted/60",
                      !isToday && !sunday && "text-text-primary group-hover:scale-105",
                    )}
                  >
                    {format(d, "d")}
                  </span>

                  {holiday && (
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        holiday.type === "optional"
                          ? "bg-warning shadow-[0_0_6px_rgba(245,158,11,0.6)]"
                          : "bg-primary shadow-[0_0_6px_rgba(16,185,129,0.6)]",
                      )}
                    />
                  )}

                  {holiday && (
                    <span className="hidden sm:block text-[10px] leading-tight text-text-muted px-1 text-center line-clamp-2">
                      {holiday.name}
                    </span>
                  )}

                  {!holiday && showStats && (
                    <span className="hidden sm:flex items-center gap-1 text-[10px] leading-tight">
                      <span className="text-success font-medium">
                        {stats.presentCount}P
                      </span>
                      {stats.absentCount > 0 && (
                        <span className="text-error font-medium">
                          {stats.absentCount}A
                        </span>
                      )}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarView;