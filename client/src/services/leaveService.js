import axios from "axios";


const API = axios.create({

  baseURL:
    "http://localhost:5000/api/leaves",

});



// =====================================================
// DOCTOR - APPLY LEAVE
// =====================================================

export const applyLeave = async (
  leaveData
) => {

  const token =
    localStorage.getItem("token");


  const response = await API.post(

    "/apply",

    leaveData,

    {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }

  );


  return response.data;

};



// =====================================================
// DOCTOR - MY LEAVES
// =====================================================

export const getMyLeaves = async () => {

  const token =
    localStorage.getItem("token");


  const response = await API.get(

    "/my-leaves",

    {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }

  );


  return response.data;

};



// =====================================================
// DOCTOR - CANCEL LEAVE
// =====================================================

export const cancelLeave = async (
  leaveId
) => {

  const token =
    localStorage.getItem("token");


  const response = await API.put(

    `/cancel/${leaveId}`,

    {},

    {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }

  );


  return response.data;

};



// =====================================================
// ADMIN - ALL LEAVES
// =====================================================

export const getAllLeaves = async () => {

  const token =
    localStorage.getItem("token");


  const response = await API.get(

    "/all",

    {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }

  );


  return response.data;

};



// =====================================================
// ADMIN - PENDING LEAVES
// =====================================================

export const getPendingLeaves = async () => {

  const token =
    localStorage.getItem("token");


  const response = await API.get(

    "/pending",

    {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }

  );


  return response.data;

};



// =====================================================
// ADMIN - PENDING COUNT
// =====================================================

export const getPendingLeaveCount =
  async () => {

    const token =
      localStorage.getItem("token");


    const response = await API.get(

      "/pending/count",

      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }

    );


    return response.data;

  };
  // =====================================================
// ADMIN - APPROVE LEAVE
// =====================================================

export const approveLeave = async (leaveId) => {

  const token = localStorage.getItem("token");

  const response = await API.put(
    `/approve/${leaveId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


// =====================================================
// ADMIN - REJECT LEAVE
// =====================================================

export const rejectLeave = async (leaveId) => {

  const token = localStorage.getItem("token");

  const response = await API.put(
    `/reject/${leaveId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};