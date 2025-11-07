import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getBookings = async (token: string) => {
  const res = await axios.get(`${API_URL}/booking`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const completeBooking = async (id: string, token: string) => {
  const res = await axios.patch(
    `${API_URL}/booking/${id}/complete`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const cancelBooking = async (id: string, token: string) => {
  const res = await axios.patch(
    `${API_URL}/booking/${id}/cancel`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};
