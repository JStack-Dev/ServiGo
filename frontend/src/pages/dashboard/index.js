// src/pages/dashboard/index.ts
export { default as AdminDashboard } from "./AdminDashboard";
export { default as TechnicianDashboard } from "./TechnicianDashboard";
export { default as ClientDashboard } from "./ClientDashboard";
// ✅ Export default necesario para React.lazy()
export { default } from "./DashboardRouter";
