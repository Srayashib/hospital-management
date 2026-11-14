import axios from "axios";

const API = "http://localhost:5000/api/doctor";

const getToken = () => localStorage.getItem("token");

export const addWeeklySchedule = async (data) => {
  const res = await axios.post(
    `${API}/schedule`,
    data,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return res.data;
};
export const getWeeklySchedule = async () => {
  const res = await axios.get(
    `${API}/schedule`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return res.data;
};