import { dashboardRepository } from "../repositories/dashboard.repository.js";
import { toast } from "../../components/ui/sonner.jsx";

export const dashboardService = {
  /**
   * Retrieve dashboard summary statistics.
   * @returns {Promise<Object>} Object containing summary metrics, daily stats, and hours stats.
   * @throws {Error} If retrieval fails.
   */
  getStats: async () => {
    try {
      const response = await dashboardRepository.getStats();
      return response.data.data;
    } catch (error) {
      toast.error("Error, Failed to fetch dashboard stats.");
      throw error;
    }
  },

  /**
   * Retrieve the admin per-date company attendance calendar for a date range.
   * @param {string} [filter="this_month"] - "this_month" | "last_15_days" | "last_30_days" | "custom"
   * @param {string} [startDate] - yyyy-MM-dd, required when filter === "custom"
   * @param {string} [endDate] - yyyy-MM-dd, required when filter === "custom"
   * @returns {Promise<Object>} { filter, startDate, endDate, totalEmployees, records: [{ date, presentCount, absentCount, halfDayCount }] }
   * @throws {Error} If retrieval fails.
   */
  getAttendanceCalendar: async (filter = "this_month", startDate, endDate) => {
    try {
      const response = await dashboardRepository.getAttendanceCalendar(
        filter,
        startDate,
        endDate,
      );
      return response.data.data;
    } catch (error) {
      toast.error("Error, Failed to fetch attendance calendar.");
      throw error;
    }
  },
};
