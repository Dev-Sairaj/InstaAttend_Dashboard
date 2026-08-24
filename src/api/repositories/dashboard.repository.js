import { apiClient } from "../apiClient.js";
import { apiUrl } from "../apiUrl.js";

export const dashboardRepository = {
  /**
   * Fetch dashboard summary statistics from the server.
   * @returns {Promise<Object>} Axios Response containing the summary statistics.
   */
  getStats: async () => {
    return apiClient.get(apiUrl.dashboard.getStats);
  },

  /**
   * Fetch the admin per-date company attendance calendar.
   * @param {string} [filter="this_month"] - "this_month" | "last_15_days" | "last_30_days" | "custom"
   * @param {string} [startDate] - yyyy-MM-dd, required when filter === "custom"
   * @param {string} [endDate] - yyyy-MM-dd, required when filter === "custom"
   * @returns {Promise<Object>} Axios Response containing { filter, startDate, endDate, totalEmployees, records[] }.
   */
  getAttendanceCalendar: async (filter = "this_month", startDate, endDate) => {
    return apiClient.get(
      apiUrl.dashboard.getAttendanceCalendar(filter, startDate, endDate),
    );
  },
};
