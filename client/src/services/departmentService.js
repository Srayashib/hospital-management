import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/departments",
});

// Add Department
export const addDepartment = async (data) => {
  const res = await API.post("/", data);

  return res.data;
};

// Get All Departments
export const getDepartments = async () => {
  const res = await API.get("/");

  return res.data;
};
export const deleteDepartment = async (id) => {
  const res = await API.delete(`/${id}`);
  return res.data;
};
export const getDepartmentById = async (id) => {
  const res = await API.get(`/${id}`);
  return res.data;
};

export const updateDepartment = async (id, data) => {
  const res = await API.put(`/${id}`, data);
  return res.data;
};
export const toggleDepartmentStatus = async (id) => {
  const res = await API.patch(`/${id}/toggle-status`);
  return res.data;
};