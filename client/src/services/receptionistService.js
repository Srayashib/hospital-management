import axios from "axios";

const API =
  "http://localhost:5000/api/receptionists";

const getToken = () => {
  return localStorage.getItem("token");
};



export const getReceptionists = async () => {

  const res = await axios.get(
    API,
    {
      headers: {
        Authorization:
          `Bearer ${getToken()}`,
      },
    }
  );

  return res.data;
};

export const getReceptionistById = async (id) => {
  const res = await axios.get(
    `${API}/${id}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return res.data;
};
export const updateReceptionist = async (
  id,
  formData
) => {
  const res = await axios.put(
    `${API}/${id}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return res.data;
};


export const addReceptionist = async (
  formData
) => {

  const res = await axios.post(
    `${API}/add`,
    formData,
    {
      headers: {
        Authorization:
          `Bearer ${getToken()}`,
      },
    }
  );

  return res.data;
};


export const deleteReceptionist = async (
  id
) => {

  const res = await axios.delete(
    `${API}/${id}`,
    {
      headers: {
        Authorization:
          `Bearer ${getToken()}`,
      },
    }
  );

  return res.data;
};

export const searchPatientByEmail=async(email)=>{
  const token=localStorage.getItem("token");
  const res= await axios.get(`${API}/patients/search`,
    {
      params:{
        email,
      },
      headers:{
        Authorization:`Bearer ${token}`
      },
    }
  );
  return res.data;
}
export const getDepartments = async () => {
  const res = await axios.get(
    "http://localhost:5000/api/departments",
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return res.data;
};


export const getDoctorsByDepartment = async (department) => {
  const res = await axios.get(
    "http://localhost:5000/api/doctors/by-department",
    {
      params: {
        department,
      },
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return res.data;
};

// export const getSlotsByDoctorAndDate = async (doctorId, date) => {
//   const res = await axios.get(
//     `http://localhost:5000/api/doctor/doctor/${doctorId}/date/${date}`,
//     {
//       headers: {
//         Authorization: `Bearer ${getToken()}`,
//       },
//     }
//   );

//   return res.data;
// };

export const getSlotsByDoctorAndDate = async (doctorId, date) => {
  const res = await axios.get(
    `http://localhost:5000/api/doctor/slots/doctor/${doctorId}/date/${date}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return res.data;
};

export const receptionistBookAppointment = async ({
  patientId,
  slotId,
  reason,
  notes = "",
}) => {

  const res = await axios.post(
    `${API}/book-appointment`,
    {
      patientId,
      slotId,
      reason,
      notes,
    },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return res.data;
};

// export const getAppointmentSummary = async () => {

//   const res = await axios.get(
//     `${API}/appointments/summary`,
//     {
//       headers: {
//         Authorization: `Bearer ${getToken()}`,
//       },
//     }
//   );

//   return res.data;
// };

// export const getReceptionistAppointments = async (
//   filter = "today"
// ) => {

//   const token = localStorage.getItem("token");

//   const response = await axios.get(
//     `${API}/appointments`,
//     {
//       params: {
//         filter,
//       },

//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     }
//   );

//   return response.data;
// };


export const getAppointmentSummary = async (
  department = "all"
) => {

  const res = await axios.get(
    `${API}/appointments/summary`,
    {
      params: {
        department,
      },

      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return res.data;
};
export const getReceptionistAppointments = async (
  filter = "today",
  department = "all"
) => {

  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API}/appointments`,
    {
      params: {
        filter,
        department,
      },

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


export const updateAppointmentStatus = async (
  appointmentId,
  status
) => {

  const token = localStorage.getItem("token");

  const response = await axios.patch(
    `${API}/appointments/${appointmentId}/status`,
    {
      status,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

// =====================================================
// DELETE CANCELLED APPOINTMENT
// =====================================================

// =====================================================
// DELETE CANCELLED APPOINTMENT
// =====================================================

export const deleteCancelledAppointment = async (
  appointmentId
) => {

  try {

    const response = await axios.delete(
      `${API}/appointments/${appointmentId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return response.data;

  } catch (error) {

    console.error(
      "Delete cancelled appointment error:",
      error
    );

    throw error;

  }

};
// =====================================================
// GET ALL PATIENTS
// =====================================================

export const getReceptionistPatients = async () => {

  const res = await axios.get(
    `${API}/patients`,
    {
      headers: {
        Authorization:
          `Bearer ${getToken()}`,
      },
    }
  );

  return res.data;
};


// =====================================================
// RECEPTIONIST DASHBOARD STATS
// =====================================================

export const getReceptionistDashboardStats =
  async () => {

    const res = await axios.get(
      `${API}/dashboard/stats`,
      {
        headers: {
          Authorization:
            `Bearer ${getToken()}`,
        },
      }
    );

    return res.data;
  };
  export const getReceptionistAppointmentChart =
  async (period = "this-week") => {
    const response = await axios.get(
      `${API}/dashboard/appointment-chart`,
      {
        params: {
          period,
        },
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );

    return response.data;
  };