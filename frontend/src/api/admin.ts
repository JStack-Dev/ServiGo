import { api } from "@/api/api";


/* ============================================================
   🧩 Tipados globales
   ============================================================ */
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "client" | "professional" | "admin";
  isActive: boolean;
}

export interface Service {
  _id: string;
  title: string;
  category: string;
  price: number;
  status: string;
  createdAt: string;
}

export interface Booking {
  _id: string;
  clientId: { name: string; email: string };
  professionalId: { name: string; email: string };
  status: string;
  totalPrice: number;
  createdAt: string;
}

/* ============================================================
   🧠 Dashboard overview
   ============================================================ */
export const getStatsOverview = () => api.get("/admin/stats/overview");

/* ============================================================
   👥 Gestión de usuarios
   ============================================================ */
export const getAllUsers = (): Promise<{ data: User[] }> => api.get("/admin/users");

export const updateUser = (
  id: string,
  data: Partial<User>
): Promise<{ data: User }> => api.patch(`/admin/users/${id}`, data);

/* ============================================================
   💼 Gestión de servicios
   ============================================================ */
export const getAllServices = (): Promise<{ data: Service[] }> =>
  api.get("/admin/services");

export const deleteService = (id: string): Promise<void> =>
  api.delete(`/admin/services/${id}`);

/* ============================================================
   📘 Gestión de reservas
   ============================================================ */
export const getAllBookings = (): Promise<{ data: Booking[] }> =>
  api.get("/admin/bookings");

/* ============================================================
   🧾 Logs del sistema
   ============================================================ */
export const getSystemLogs = () => api.get("/admin/logs");
