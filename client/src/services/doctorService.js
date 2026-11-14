import axios from "axios";

const API=axios.create({
    baseURL: "http://localhost:5000/api/doctors",
});

export const addDoctor=async(formData)=>{
    const res=await API.post("/add",formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return res.data;
};

export const getDoctors=async()=>{
    const res = await API.get("/");

    return res.data;
}

export const deleteDoctors=async(id)=>{
    const res=await API.delete(`/${id}`);
    return res.data;
}
export const getDoctorById = async (id) => {
  const res = await API.get(`/${id}`);
  return res.data;
};

export const updateDoctor = async (id, formData) => {
  const res = await API.put(`/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
export const getDoctorProfile = async (id) => {
    const res = await API.get(`/${id}`);
    return res.data;
};
export const getMyProfile = async () => {

  const token = localStorage.getItem("token");

  const response = await API.get(
    "/my-profile",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
export const getMyTodayAppointments = async () => {

  const token = localStorage.getItem("token");

  const res = await API.get(
    "/my-appointments/today",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
/* =====================================================
   COMPLETE APPOINTMENT
===================================================== */

/* =====================================================
   COMPLETE APPOINTMENT
===================================================== */

export const completeAppointment = async (
  appointmentId,
  medicalData
) => {

  const token =
    localStorage.getItem("token");


  const formData =
    new FormData();


  /* =================================================
     TEXT DATA
  ================================================= */

  formData.append(
    "diagnosis",
    medicalData.diagnosis || ""
  );


  formData.append(
    "clinicalFindings",
    medicalData.clinicalFindings || ""
  );


  formData.append(
    "bloodTestName",
    medicalData.bloodTestName || ""
  );


  formData.append(
    "bloodTestResult",
    medicalData.bloodTestResult || ""
  );


  formData.append(
    "treatmentNotes",
    medicalData.treatmentNotes || ""
  );


  formData.append(
    "remarks",
    medicalData.remarks || ""
  );


  formData.append(
    "followUpRequired",
    medicalData.followUpRequired
      ? "true"
      : "false"
  );


  formData.append(
    "followUpDate",
    medicalData.followUpDate || ""
  );


  /* =================================================
     PRESCRIPTIONS
  ================================================= */

  formData.append(
    "prescriptions",
    JSON.stringify(
      medicalData.prescriptions || []
    )
  );


  /* =================================================
     PRESCRIPTION FILE
  ================================================= */

  if (
    medicalData.prescriptionFile
  ) {

    formData.append(
      "prescriptionFile",
      medicalData.prescriptionFile
    );

  }


  /* =================================================
     LAB REPORT
  ================================================= */

  if (
    medicalData.labReportFile
  ) {

    formData.append(
      "labReportFile",
      medicalData.labReportFile
    );

  }


  /* =================================================
     OTHER MEDICAL DOCUMENT
  ================================================= */

  if (
    medicalData.otherMedicalFile
  ) {

    formData.append(
      "otherMedicalFile",
      medicalData.otherMedicalFile
    );

  }


  const res =
    await API.post(

      `/appointments/${appointmentId}/complete`,

      formData,

      {
        headers: {

          Authorization:
            `Bearer ${token}`,

          
        },

      }

    );


  return res.data;

};
export const getMedicalRecordByAppointment = async (
  appointmentId
) => {
  const token = localStorage.getItem("token");

  const res = await API.get(
    `/appointments/${appointmentId}/medical-record`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
export const getDoctorPatientMedicalHistory = async (patientId) => {
  const token = localStorage.getItem("token");

  const res = await API.get(
    `/patients/${patientId}/medical-history`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
export const getMyAllTodayAppointments = async () => {

  const token =
    localStorage.getItem("token");

  const res = await API.get(
    "/my-appointments/today-all",
    {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
export const getDoctorPatients = async () => {
  const token = localStorage.getItem("token");

  const res = await API.get("/my-patients", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
// =====================================================
// UPDATE PATIENT LATEST VITALS
// =====================================================

export const updatePatientVitals = async (
  patientId,
  data
) => {
  const token =
    localStorage.getItem("token");

  const res = await API.put(
    `/patients/${patientId}/vitals`,
    data,
    {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    }
  );

  return res.data;
};