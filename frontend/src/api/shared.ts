import { apiRequest } from "@/api/client";
import type { Contract, NotificationItem } from "@/types/api";

export const sharedApi = {
  contracts: () => apiRequest<Contract[]>("/contracts"),
  unreadCount: () => apiRequest<{ count?: number; unread_count?: number }>("/notifications/unread-count"),
  notifications: () => apiRequest<NotificationItem[]>("/notifications"),
};
