import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/patient",
});
const MEDICAL_API = axios.create({
  baseURL: "http://localhost:5000/api/doctors",
});
/* =====================================================
   GET MY PATIENT PROFILE
===================================================== */

export const getMyPatientProfile = async () => {
  const token = localStorage.getItem("token");

  const res = await API.get("/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};


/* =====================================================
   UPDATE PERSONAL INFORMATION
===================================================== */

export const updatePatientProfile = async (data) => {
  const token = localStorage.getItem("token");

  const res = await API.put("/profile", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};


/* =====================================================
   UPDATE NOTIFICATION PREFERENCES
===================================================== */

export const updateNotificationPreferences = async (data) => {
  const token = localStorage.getItem("token");

  const res = await API.put(
    "/profile/notifications",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};


/* =====================================================
   UPDATE PRIVACY SETTINGS
===================================================== */

export const updatePrivacySettings = async (data) => {
  const token = localStorage.getItem("token");

  const res = await API.put(
    "/profile/privacy",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};


/* =====================================================
   UPDATE APPOINTMENT PREFERENCES
===================================================== */

export const updateAppointmentPreferences = async (data) => {
  const token = localStorage.getItem("token");

  const res = await API.put(
    "/profile/appointments",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
/* =====================================================
   LOGOUT
===================================================== */

export const logoutPatient = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};


/* =====================================================
   DELETE PATIENT ACCOUNT
===================================================== */

export const deletePatientAccount = async () => {
  const token = localStorage.getItem("token");

  const res = await API.delete("/account", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};


export const changePatientPassword=async(data)=>{
  const token=localStorage.getItem("token");
  const res=await API.put("/change-password",data,{
    headers:{
      Authorization:`Bearer ${token}`,
    }
  })
  return res.data;    
}

export const getDepartments=async()=>{
  const token=localStorage.getItem("token");
  const res=await API.get("/departments",{
    headers:{
      Authorization:`Bearer ${token}`
    }
  })
  return res.data;
}

export const getDoctorsByDepartment=async(department)=>{
  const token=localStorage.getItem("token");
  const res=await API.get("/doctors",{
    params: {
        department,
      },
    headers: {
        Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

/* =====================================================
   GET DOCTOR SLOTS
===================================================== */

export const getDoctorSlots = async (
  doctorId,
  date
) => {

  const token = localStorage.getItem("token");

  const res = await API.get(
    `/doctors/${doctorId}/slots`,
    {
      params: {
        date,
      },

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
export const bookAppointment = async (data) => {

  const token=localStorage.getItem("token");

  const response = await API.post(
    "/appointments/book",
    data,{
    headers:{
      Authorization:`Bearer ${token}`,
    }
  }
  );

  return response.data;

};
// =====================================================
// GET MY APPOINTMENTS
// =====================================================

export const getMyAppointments = async () => {

  const token = localStorage.getItem("token");

  const response = await API.get(
    "/appointments/my",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
/* =====================================================
   GET MY MEDICAL HISTORY
===================================================== */

export const getMyMedicalHistory = async () => {

  const token =
    localStorage.getItem("token");

  const response =
    await MEDICAL_API.get(
      "/medical-history",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

  return response.data;
};
/* =====================================================
   GET MY COMPLETED PAYMENTS
===================================================== */

export const getPatientCompletedPayments = async () => {

  const token = localStorage.getItem("token");

  const response = await API.get(
    "/appointments/payments",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
/* =====================================================
   GET PATIENT DASHBOARD STATS
===================================================== */

export const getPatientDashboardStats = async () => {
  const token = localStorage.getItem("token");

  const response = await API.get(
    "/dashboard/stats",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};