import axios from "axios";


const API = axios.create({
  baseURL: "http://localhost:5000/api/hospital-settings",
});


// ==========================================
// GET HOSPITAL SETTINGS
// ==========================================

export const getHospitalSettings = async () => {

  const res = await API.get("/");

  return res.data;

};


// ==========================================
// UPDATE HOSPITAL INFORMATION
// ==========================================

export const updateHospitalInformation = async (data) => {

  const res = await API.put(
    "/hospital-information",
    data
  );

  return res.data;

};
// ==========================================
// UPDATE WORKING HOURS
// ==========================================

export const updateWorkingHours = async (data) => {

  const res = await API.put(
    "/working-hours",
    data
  );

  return res.data;

};
// ==========================================
// UPDATE APPOINTMENT SETTINGS
// ==========================================

export const updateAppointmentSettings = async (data) => {

  const res = await API.put(
    "/appointment-settings",
    data
  );

  return res.data;

};
export const updateSystemSettings = async (data) => {

  const res = await API.put(
    "/system-settings",
    data
  );

  return res.data;

};