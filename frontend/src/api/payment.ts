import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const createCheckoutSession = async (data: {
  serviceId: string;
  professionalId: string;
  amount: number;
  clientId: string;
  email: string;
  token: string;
}) => {
  const res = await axios.post(`${API_URL}/payment/create-session`, data, {
    headers: { Authorization: `Bearer ${data.token}` },
  });
  return res.data;
};
