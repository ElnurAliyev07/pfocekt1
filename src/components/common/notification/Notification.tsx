'use client'

import React, { useEffect, useState, useRef } from "react";
import {
  HiBell,
  HiCheckCircle,
  HiClock,
  HiDotsHorizontal,
  HiInformationCircle,
  HiUser,
  HiCheck,
  HiX,
} from "react-icons/hi";
import { useRouter } from "next/navigation";
import { useWebSocket } from "@/hooks/useWebSocket";
import { CustomNotification } from "@/types/notification.type";
import { showToast, ToastType } from "@/utils/toastUtils";
import { acceptOrRejectWorkspaceInvitationByIdService } from "@/services/client/workspace.service";

// Custom hook for detecting clicks outside of the component
function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: () => void
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, handler]);
}

const Notification = () => {
  const router = useRouter();
  const notificationRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState<Array<CustomNotification>>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Client-side mounting kontrolü
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close notifications when clicking outside
  useClickOutside(notificationRef, () => {
    setIsOpen(false);
  });

  // Helper function to get notification icon based on type
  const getNotificationIcon = (notification: CustomNotification) => {
    const iconClass = "w-4 h-4 sm:w-5 sm:h-5";
    
    switch (notification.notification_type) {
      case "workspace_created":
        return <HiCheckCircle className={`${iconClass} text-emerald-500`} />;
      case "workspace_updated":
        return <HiUser className={`${iconClass} text-violet-500`} />;
      case "workspace_invitation":
        return <HiUser className={`${iconClass} text-violet-500`} />;
      case "project_created":
        return <HiClock className={`${iconClass} text-amber-500`} />;
      case "project_updated":
        return <HiInformationCircle className={`${iconClass} text-emerald-500`} />;
      case "task_created":
        return <HiCheckCircle className={`${iconClass} text-blue-500`} />;
      case "task_updated":
        return <HiUser className={`${iconClass} text-violet-500`} />;
      case "task_assigned":
        return <HiClock className={`${iconClass} text-amber-500`} />;
      case "comment_added":
        return <HiInformationCircle className={`${iconClass} text-emerald-500`} />;
      case "mention":
        return <HiUser className={`${iconClass} text-violet-500`} />;
      case "document_shared":
        return <HiClock className={`${iconClass} text-amber-500`} />;
      case "vacancy_created":
        return <HiInformationCircle className={`${iconClass} text-emerald-500`} />;
      case "freelancer_hired":
        return <HiUser className={`${iconClass} text-violet-500`} />;
      case "payment_received":
        return <HiClock className={`${iconClass} text-amber-500`} />;
      default:
        return <HiDotsHorizontal className={`${iconClass} text-slate-400`} />;
    }
  };

  const { send } = useWebSocket(
    isMounted ? `/ws/notifications/` : "",
    (event) => {
      if (!isMounted) return;
      
      try {
        const data = JSON.parse(event.data);
        if (data.type === "unread_count" && data.count) {
          setUnreadCount(data.count);
        }
        if (data.type === "notifications_list" && data.notifications) {
          setNotifications(data.notifications.results);
        }
        if (data.type === "new_notification" && data.notification) {
          setNotifications((prev) => [data.notification, ...prev]);
          setUnreadCount((prev) => prev + 1);
          showToast(data.notification.message, ToastType.SUCCESS);
        }
      } catch (error) {
      }
    },
    () => {
    }
  );

  const handleOpenNotifications = () => {
    setIsOpen(!isOpen);
    if (!isOpen && send && isMounted) {
      setIsLoading(true);
      send({
        action: "get_notifications",
        page: 1,
      });
      // Simulate loading delay
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  // Function to mark notification as read
  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id
          ? { ...notification, is_read: true }
          : notification
      )
    );
    if (send && isMounted) {
      send({
        action: "mark_as_read",
        id,
      });
    }
    setUnreadCount(Math.max(0, unreadCount - 1));
  };

  // Function to mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, is_read: true }))
    );
    if (send && isMounted) {
      send({
        action: "mark_all_as_read",
      });
    }
    setUnreadCount(0);
  };

  const handleInvitationResponse = async (
    notificationId: number,
    objectId: number,
    status: "accepted" | "rejected"
  ) => {
    try {
      await acceptOrRejectWorkspaceInvitationByIdService(objectId, { status });
      
      setNotifications(
        notifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, notification_status: 'completed', is_read: true }
            : notification
        )
      );
      
      setUnreadCount(Math.max(0, unreadCount - 1));
      
      const message = status === "accepted" ? "Dəvət qəbul edildi" : "Dəvət rədd edildi";
      const toastType = status === "accepted" ? ToastType.SUCCESS : ToastType.INFO;
      showToast(message, toastType);
    } catch (error) {
      showToast("Xəta baş verdi", ToastType.ERROR);
    }
  };

  const WorkspaceInvitationNotification = ({
    notification,
  }: {
    notification: CustomNotification;
  }) => {
    return (
      <div className="p-3 sm:p-4">
        <div className="flex gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getNotificationIcon(notification)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">
              {notification.title}
            </p>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              {notification.message}
            </p>
            <p className="text-xs text-slate-400 mt-2">
              {notification.time_since}
            </p>
            
            {notification.notification_status === 'pending' && (
              <div className="flex flex-col sm:flex-row gap-2 mt-3">
                <button
                  onClick={() => handleInvitationResponse(
                    notification.id,
                    notification.object_id,
                    "accepted"
                  )}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg hover:from-emerald-600 hover:to-emerald-700 active:scale-95 transition-all duration-150 shadow-sm"
                >
                  <HiCheck className="w-3 h-3" />
                  Qəbul et
                </button>
                <button
                  onClick={() => handleInvitationResponse(
                    notification.id,
                    notification.object_id,
                    "rejected"
                  )}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 active:scale-95 transition-all duration-150"
                >
                  <HiX className="w-3 h-3" />
                  Rədd et
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

 
  return (
    <>
      <div ref={notificationRef} className="relative">
        {/* Notification Bell Button */}
        <button
          onClick={handleOpenNotifications}
          className={`relative w-10 h-10 flex items-center justify-center text-slate-600 rounded-xl hover:bg-slate-100 active:bg-slate-200 transition-all duration-200 group ${unreadCount > 0 ? 'bg-slate-100' : ''}`}
          aria-label="Bildirişlər"
        >
          <HiBell className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg animate-pulse">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* Custom Dropdown Panel */}
        {isOpen && (
          <div className="fixed lg:absolute top-0 left-0 h-screen w-screen lg:top-auto lg:left-auto lg:right-0 lg:mt-2 lg:h-auto lg:w-96 bg-white lg:rounded-2xl lg:shadow-xl lg:overflow-hidden z-50 border border-slate-200/50 backdrop-blur-sm">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HiBell className="w-5 h-5 text-slate-600" />
                  <h3 className="text-sm font-semibold text-slate-900">Bildirişlər</h3>
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                    >
                      Hamısını oxunmuş kimi işarələ
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                  >
                    <HiX className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Notification List */}
            <div className="max-h-[80vh] lg:max-h-[400px] overflow-y-auto">
              {isLoading ? (
                <div className="py-8 flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-300 border-t-blue-600 mb-3"></div>
                  <p className="text-slate-500 text-sm">Yüklənir...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-4">
                    <HiBell className="h-8 w-8 text-slate-400" />
                  </div>
                  <p className="text-slate-500 text-sm font-medium">Bildiriş yoxdur</p>
                  <p className="text-slate-400 text-xs mt-1">Yeni bildirişlər burada görünəcək</p>
                </div>
              ) : (
                notifications.map((notification, index) => (
                  <div
                    key={notification.id}
                    className={`border-b border-slate-100 last:border-b-0 transition-all duration-200 notification-slide-in ${
                      !notification.is_read 
                        ? "bg-gradient-to-r from-blue-50/50 to-indigo-50/30 border-l-2 border-l-blue-500" 
                        : "hover:bg-slate-50/50"
                    }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {notification.notification_type === "workspace_invitation" ? (
                      <WorkspaceInvitationNotification notification={notification} />
                    ) : (
                      <button
                        className="w-full text-left p-3 sm:p-4 hover:bg-slate-50/50 transition-colors duration-200"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            {getNotificationIcon(notification)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                              {notification.title}
                            </p>
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-slate-400 mt-2">
                              {notification.time_since}
                            </p>
                            
                            {!notification.is_read && (
                              <div className="flex-shrink-0">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-slate-50 border-t border-slate-200/50">
              <button
                onClick={() => {
                  router.push("/dashboard/notifications");
                  setIsOpen(false);
                }}
                className="w-full text-center text-xs text-blue-600 hover:text-blue-700 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition-all duration-200"
              >
                Bütün bildirişlərə bax
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Notification;