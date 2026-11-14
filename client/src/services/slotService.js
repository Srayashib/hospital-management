// import axios from "axios";

// const API = "http://localhost:5000/api/doctor";

// const getToken = () =>
//   localStorage.getItem("token");

// export const getAvailableSlots = async()=>{

//   const res = await axios.get(

//     `${API}/slots`,

//     {
//       headers:{
//         Authorization:`Bearer ${getToken()}`
//       }
//     }

//   );

//   return res.data;

// };

// // export const getSlotsByDate = async (date) => {

// //   const res = await axios.get(

// //     `${API}/slots/${date}`,

// //     {
// //       headers: {
// //         Authorization: `Bearer ${getToken()}`,
// //       },
// //     }

// //   );

// //   return res.data;

// // };

// export const getSlotsByDate = async (date) => {

//   const res = await axios.get(
//     `${API}/slots/date/${date}`,
//     {
//       headers: {
//         Authorization: `Bearer ${getToken()}`,
//       }
//     }
//   );

//   return res.data;
// };

// import axios from "axios";

// const API = "http://localhost:5000/api/doctor";

// const getToken = () =>
//   localStorage.getItem("token");


// // =====================================================
// // GET ALL AVAILABLE SLOTS FOR LOGGED-IN DOCTOR
// // =====================================================

// export const getAvailableSlots = async () => {

//   const res = await axios.get(
//     `${API}/slots`,
//     {
//       headers: {
//         Authorization: `Bearer ${getToken()}`
//       }
//     }
//   );

//   return res.data;
// };


// // =====================================================
// // GET SLOTS BY DATE FOR LOGGED-IN DOCTOR
// // =====================================================

// export const getSlotsByDate = async (date) => {

//   const res = await axios.get(
//     `${API}/slots/date/${date}`,
//     {
//       headers: {
//         Authorization: `Bearer ${getToken()}`
//       }
//     }
//   );

//   return res.data;
// };


import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/doctor",
});


// =====================================================
// GET AVAILABLE SLOTS
// =====================================================

export const getAvailableSlots = async () => {

  const token = localStorage.getItem("token");

  const response = await API.get(
    "/slots",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// =====================================================
// GET SLOTS BY DATE
// =====================================================

export const getSlotsByDate = async (date) => {

  const token = localStorage.getItem("token");

  const response = await API.get(
    `/slots/date/${date}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// =====================================================
// GET SLOTS BY DOCTOR + DATE
// =====================================================

export const getSlotsByDoctorAndDate = async (
  doctorId,
  date
) => {

  const token = localStorage.getItem("token");

  const response = await API.get(
    `/slots/doctor/${doctorId}/date/${date}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};