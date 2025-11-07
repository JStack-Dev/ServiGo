import User from "../models/User.js";
import Service from "../models/Service.js";
import Payment from "../models/Payment.js"; // si ya tienes Stripe integrado
import { AdminService } from "./admin.service.js";

//  Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

//  Eliminar usuario
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: "Usuario eliminado correctamente 🗑️" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar usuario" });
  }
};

//  Obtener todos los servicios
export const getAllServicesAdmin = async (req, res) => {
  try {
    const services = await Service.find()
      .populate("professional client", "name email role")
      .sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los servicios" });
  }
};

//  Ver todos los pagos
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("service", "title price category")
      .populate("client professional", "name email")
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los pagos" });
  }
};


export const AdminController = {
  // ...otras acciones (getUsers, getBookings, etc.)

  async getLogs(req, res) {
    const logs = await AdminService.getSystemLogs();
    res.json(logs);
  },
};