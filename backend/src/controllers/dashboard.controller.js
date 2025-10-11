import User from "../models/User.js";
import Service from "../models/Service.js";
import Review from "../models/Review.js";
import Payment from "../models/Payment.js";

// 📊 Obtener estadísticas generales
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalClients = await User.countDocuments({ role: "cliente" });
    const totalProfessionals = await User.countDocuments({ role: "profesional" });

    const totalServices = await Service.countDocuments();
    const completedServices = await Service.countDocuments({ status: "completado" });
    const pendingServices = await Service.countDocuments({ status: "pendiente" });

    const totalRevenue = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const averageRating = await Review.aggregate([
      { $group: { _id: null, avg: { $avg: "$rating" } } },
    ]);

    res.json({
      users: {
        total: totalUsers,
        clients: totalClients,
        professionals: totalProfessionals,
      },
      services: {
        total: totalServices,
        completed: completedServices,
        pending: pendingServices,
      },
      revenue: totalRevenue[0]?.total || 0,
      averageRating: averageRating[0]?.avg?.toFixed(2) || "Sin valoraciones",
    });
  } catch (error) {
    console.error("❌ Error al obtener estadísticas:", error);
    res.status(500).json({ error: "Error al obtener estadísticas del panel" });
  }
};

// 📈 Actividad reciente (últimos 7 días)
export const getRecentActivity = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentServices = await Service.find({
      createdAt: { $gte: sevenDaysAgo },
    })
      .populate("professional", "name")
      .sort({ createdAt: -1 });

    const recentUsers = await User.find({
      createdAt: { $gte: sevenDaysAgo },
    }).sort({ createdAt: -1 });

    res.json({ recentServices, recentUsers });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener actividad reciente" });
  }
};
