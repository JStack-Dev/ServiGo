import PDFDocument from "pdfkit";
import { Parser } from "json2csv";
import User from "../models/User.js";
import Service from "../models/Service.js";
import Payment from "../models/Payment.js";

// 🧾 Exportar usuarios a CSV
export const exportUsersCSV = async (req, res) => {
  try {
    const users = await User.find().select("name email role createdAt");
    const parser = new Parser();
    const csv = parser.parse(users);

    res.header("Content-Type", "text/csv");
    res.attachment("usuarios_servigo.csv");
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ error: "Error al exportar usuarios" });
  }
};

// 📋 Exportar servicios a PDF
export const exportServicesPDF = async (req, res) => {
  try {
    const services = await Service.find()
      .populate("professional client", "name email")
      .sort({ createdAt: -1 });

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=servicios_servigo.pdf");
    doc.pipe(res);

    doc.fontSize(18).text("📋 Reporte de Servicios - ServiGo", { align: "center" });
    doc.moveDown();

    services.forEach((s, i) => {
      doc
        .fontSize(12)
        .text(`${i + 1}. ${s.title} - ${s.category}`)
        .text(`Profesional: ${s.professional?.name || "N/A"}`)
        .text(`Cliente: ${s.client?.name || "N/A"}`)
        .text(`Estado: ${s.status}`)
        .text(`Precio: ${s.price} €`)
        .moveDown();
    });

    doc.end();
  } catch (error) {
    console.error("❌ Error al exportar PDF:", error);
    res.status(500).json({ error: "Error al generar el PDF" });
  }
};

// 💰 Exportar pagos a CSV
export const exportPaymentsCSV = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("client professional", "name email")
      .select("amount status createdAt");

    const parser = new Parser();
    const csv = parser.parse(payments);

    res.header("Content-Type", "text/csv");
    res.attachment("pagos_servigo.csv");
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ error: "Error al exportar pagos" });
  }
};
