import { ReactNode } from "react";
interface Notification {
    _id?: string;
    id?: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
}
interface NotificationContextProps {
    notifications: Notification[];
    unreadCount: number;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}
export declare function NotificationProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
export declare const useNotifications: () => NotificationContextProps;
export {};
