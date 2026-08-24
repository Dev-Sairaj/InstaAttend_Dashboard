import React, { useEffect, useState, useCallback } from "react";
import { Bell, Loader2 } from "lucide-react";

/**
 * Notifications panel.
 *
 * There's no notifications endpoint in the backend yet, so this
 * intentionally ships as an honest empty state rather than mock data.
 * The component is already wired for the shape a future API would
 * likely return — once GET /notifications (or similar) exists, replace
 * the body of `load()` with something like:
 *
 *   const data = await notificationService.getAll();
 *   setNotifications(data);
 *
 * Expected item shape: { id, title, message, read, createdAt }
 */
const NotificationsCard = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      // TODO: replace with notificationService.getAll() once the
      // backend exposes a notifications endpoint.
      setNotifications([]);
    } catch (e) {
      console.error("Failed to load notifications", e);
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-instattend-500" />
          <h3 className="font-semibold text-gray-800 text-sm">Notifications</h3>
          {isLoading && (
            <Loader2 className="h-3.5 w-3.5 text-instattend-400 animate-spin ml-1" />
          )}
        </div>
        {unreadCount > 0 && (
          <span className="bg-instattend-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
            {unreadCount} new
          </span>
        )}
      </div>

      {!isLoading && notifications.length === 0 ? (
        <div className="flex flex-col items-center text-center py-6 text-gray-400">
          <Bell className="h-7 w-7 mb-2 opacity-40" />
          <p className="text-sm">You're all caught up</p>
          <p className="text-xs mt-0.5">No new notifications</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n, idx) => (
            <div
              key={n.id || idx}
              className="flex items-start gap-3 border-b border-gray-50 last:border-b-0 pb-3 last:pb-0"
            >
              <span
                className={`h-2 w-2 rounded-full mt-1.5 flex-shrink-0 ${
                  n.read ? "bg-gray-300" : "bg-instattend-500"
                }`}
              />
              <div className="min-w-0">
                <p className="text-sm text-gray-700 truncate">{n.title}</p>
                {n.message && (
                  <p className="text-xs text-gray-400 truncate">{n.message}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsCard;
