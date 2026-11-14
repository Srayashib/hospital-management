import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/notifications",
});


// ==========================================
// GET NOTIFICATIONS
// ==========================================

export const getNotifications = async () => {

  const token = localStorage.getItem("token");

  const response = await API.get("/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};


// ==========================================
// MARK AS READ
// ==========================================

export const markNotificationAsRead = async (
  notificationId
) => {

  console.log(
    "MARKING NOTIFICATION AS READ:",
    notificationId
  );

  const token = localStorage.getItem("token");

  const response = await API.patch(
    `/${notificationId}/read`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log(
    "MARK READ RESPONSE:",
    response.data
  );

  return response.data;
};