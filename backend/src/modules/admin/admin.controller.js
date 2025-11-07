// src/modules/admin/admin.controller.js
import { AdminService } from "./admin.service.js";

export const AdminController = {
  async getUsers(req, res) {
    const users = await AdminService.getAllUsers();
    res.json(users);
  },

  async updateUser(req, res) {
    const updated = await AdminService.updateUser(req.params.id, req.body);
    res.json(updated);
  },

  async getServices(req, res) {
    const services = await AdminService.getAllServices();
    res.json(services);
  },

  async deleteService(req, res) {
    await AdminService.deleteService(req.params.id);
    res.json({ message: "Servicio eliminado correctamente" });
  },

  async getBookings(req, res) {
    const bookings = await AdminService.getAllBookings();
    res.json(bookings);
  },

  async getStats(req, res) {
    const stats = await AdminService.getSystemStats();
    res.json(stats);
  },
};
