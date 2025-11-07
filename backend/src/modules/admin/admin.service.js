// src/modules/admin/admin.service.js
import User from "../../models/User.js";
import Service from "../../models/Service.js";
import Booking from "../../models/Booking.js";
import Payment from "../../models/Payment.js";


export const AdminService = {
  async getAllUsers() {
    return User.find({}, "name email role isActive createdAt");
  },

  async updateUser(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true });
  },

  async getAllServices() {
    return Service.find({}, "title category price status createdAt");
  },

  async deleteService(id) {
    return Service.findByIdAndDelete(id);
  },

  async getAllBookings() {
    return Booking.find({}, "client professional status totalPrice createdAt");
  },

  async getSystemStats() {
    const totalUsers = await User.countDocuments();
    const totalProfessionals = await User.countDocuments({ role: "professional" });
    const totalClients = await User.countDocuments({ role: "client" });
    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.countDocuments({ status: "completed" });
    const canceledBookings = await Booking.countDocuments({ status: "canceled" });
    const activeBookings = await Booking.countDocuments({ status: "active" });
    const totalIncome = await Payment.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]);

    return {
      totalUsers,
      totalProfessionals,
      totalClients,
      totalBookings,
      completedBookings,
      canceledBookings,
      activeBookings,
      totalIncome: totalIncome[0]?.total || 0,
    };
  },
};
