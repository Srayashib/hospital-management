import axios from "axios";

const API =
  "http://localhost:5000/api/admin";

const getToken = () => {
  return localStorage.getItem("token");
};

// =====================================================
// GET ALL PATIENTS
// =====================================================

export const getAdminPatients = async () => {
  const response = await axios.get(
    `${API}/patients`,
    {
      headers: {
        Authorization:
          `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};
// =====================================================
// DELETE PATIENT
// =====================================================

export const deleteAdminPatient = async (
  patientId
) => {
  const response = await axios.delete(
    `${API}/patients/${patientId}`,
    {
      headers: {
        Authorization:
          `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};
export const getAdminRecentAppointments = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API}/appointments/recent`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getAdminRevenueReport = async (filters = {}) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API}/revenue-reports`,
    {
      params: {
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getAdminDashboardStats = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API}/dashboard/stats`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
