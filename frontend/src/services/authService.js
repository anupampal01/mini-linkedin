import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const register = async (userData) => {
  const response = await axios.post(`${API_BASE}/auth/register`, userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await axios.post(`${API_BASE}/auth/login`, userData);
  return response.data;
};

export const getProfile = async (token) => {
  const response = await axios.get(`${API_BASE}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateProfile = async (token, formData) => {
  const response = await axios.put(`${API_BASE}/auth/profile`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      // ❌ Remove manual Content-Type → let Axios handle it
    },
  });
  return response.data;
};

export const deleteProfile = async (token) => {
  const response = await axios.delete(`${API_BASE}/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
