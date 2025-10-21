import api from "./api";

export const getUserProfile = async () => {
  const res = await api.get("/users/profile");
  return res.data;
};

export const updateUserProfile = async (data: {
  name?: string;
  email?: string;
  password?: string;
}) => {
  const res = await api.put("/users/profile", data);
  return res.data;
};
