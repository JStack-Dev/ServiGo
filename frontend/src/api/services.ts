import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/services/cliente";

// ✅ Obtener servicios del cliente autenticado por estado
export const getServicesByStatus = async (status: string, token: string) => {
  try {
    const res = await axios.get(`${API_URL}?status=${status}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("❌ Error al obtener servicios:", error);
    return [];
  }
};


// ⭐ Valorar profesional
export const rateProfessional = async (serviceId: string, rating: number, token: string) => {
  try {
    const res = await axios.post(
      `${API_URL.replace("/cliente", "")}/${serviceId}/rate`,
      { rating },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error("❌ Error al valorar profesional:", error);
  }
};

// 🚫 Cancelar servicio
export const cancelService = async (serviceId: string, token: string) => {
  try {
    const res = await axios.patch(
      `${API_URL.replace("/cliente", "")}/${serviceId}/cancel`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  } catch (error) {
    console.error("❌ Error al cancelar servicio:", error);
  }
};

// ✅ Obtener información de un servicio concreto
export const getServiceById = async (serviceId: string, token: string) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/services/${serviceId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (error) {
    console.error("❌ Error al obtener información del servicio:", error);
    return null;
  }
};


// ✅ Obtener servicios del profesional según estado
export const getServicesByProfessionalStatus = async (
  status: string,
  token: string
) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/services/professional/${status}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return await res.json();
  } catch (error) {
    console.error("❌ Error al obtener servicios del profesional:", error);
    return [];
  }
};

// ✅ Cambiar estado del servicio
export const updateServiceStatus = async (
  serviceId: string,
  newStatus: string,
  token: string
) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/services/${serviceId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newStatus }),
      }
    );
    return await res.json();
  } catch (error) {
    console.error("❌ Error al actualizar estado del servicio:", error);
  }
};
