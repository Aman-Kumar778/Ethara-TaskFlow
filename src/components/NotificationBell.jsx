import React, { useState, useRef, useEffect } from "react";
import { Bell, Check, Clock } from "lucide-react";
import { useNotifications, useMarkAllRead, useMarkOneRead } from "../hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { data: nData } = useNotifications();
  const markAllReadMutation = useMarkAllRead();
  const markOneReadMutation = useMarkOneRead();

  const notifications = nData?.data?.notifications || [];
  const unreadCount = nData?.data?.unreadCount || 0;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors group"
      >
        <Bell size={20} className="group-hover:text-primary-600 transition-colors" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 origin-top-right rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllReadMutation.mutate()}
                className="text-xs font-semibold text-primary-600 hover:text-primary-700"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell size={32} className="mx-auto mb-2 text-slate-200" />
                <p className="text-sm text-slate-500">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => !notification.isRead && markOneReadMutation.mutate(notification._id)}
                  className={twMerge(
                    "p-4 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 last:border-0",
                    !notification.isRead && "bg-primary-50/30"
                  )}
                >
                  <div className="flex gap-3">
                    <div className={twMerge(
                      "mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                      notification.isRead ? "bg-slate-100 text-slate-400" : "bg-primary-100 text-primary-600"
                    )}>
                      {notification.isRead ? <Check size={14} /> : <Bell size={14} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={twMerge(
                        "text-sm leading-snug",
                        notification.isRead ? "text-slate-600" : "text-slate-900 font-medium"
                      )}>
                        {notification.message}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                        <Clock size={12} />
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                        {notification.project && (
                          <>
                            <span>•</span>
                            <span className="font-medium text-primary-600 uppercase tracking-tight">{notification.project.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-3 border-t border-slate-100 text-center">
            <button className="text-xs font-semibold text-slate-500 hover:text-slate-900">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
