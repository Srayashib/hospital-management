import { useEffect, useState } from "react";

import {
  FaUserMd,
  FaArrowLeft,
  FaUsers,
  FaCheckCircle,
  FaTimesCircle,
  FaBuilding,
} from "react-icons/fa";

import { getDoctors } from "../../services/doctorService";
import { getDepartments } from "../../services/departmentService";


const DoctorAvailability = () => {

  const [departments, setDepartments] = useState([]);

  const [doctors, setDoctors] = useState([]);

  const [selectedDepartment, setSelectedDepartment] =
    useState(null);

  const [loading, setLoading] = useState(true);


  // ==========================================
  // LOAD DEPARTMENTS AND DOCTORS
  // ==========================================

  useEffect(() => {

    loadData();

  }, []);


  const loadData = async () => {

    try {

      setLoading(true);

      const [departmentResponse, doctorResponse] =
        await Promise.all([
          getDepartments(),
          getDoctors(),
        ]);


      setDepartments(
        departmentResponse.departments ||
        departmentResponse.data ||
        []
      );


      setDoctors(
        doctorResponse.doctors ||
        doctorResponse.data ||
        []
      );


    } catch (error) {

      console.error(
        "Doctor Availability Error:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  // ==========================================
  // CHECK DOCTOR AVAILABILITY
  // ==========================================

  const isDoctorAvailable = (doctor) => {

    if (
      doctor.status &&
      doctor.status.toLowerCase() !== "active"
    ) {
      return false;
    }


    const today = new Date();

    const dayName =
      today.toLocaleDateString(
        "en-US",
        {
          weekday: "long",
        }
      );


    if (
      doctor.weeklyHolidays?.includes(dayName)
    ) {
      return false;
    }


    return true;

  };


  // ==========================================
  // GET DEPARTMENT DOCTORS
  // ==========================================

  const getDepartmentDoctors = (departmentName) => {

    return doctors.filter(
      (doctor) =>
        doctor.department === departmentName
    );

  };


  // ==========================================
  // SELECT DEPARTMENT
  // ==========================================

  const handleDepartmentClick = (department) => {

    setSelectedDepartment(department);

  };


  // ==========================================
  // BACK TO DEPARTMENTS
  // ==========================================

  const handleBack = () => {

    setSelectedDepartment(null);

  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (

      <div className="p-6">

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-10 text-center">

          <p className="text-slate-500">
            Loading doctor availability...
          </p>

        </div>

      </div>

    );

  }


  // ==========================================
  // DEPARTMENT DOCTORS
  // ==========================================

  if (selectedDepartment) {

    const departmentDoctors =
      getDepartmentDoctors(
        selectedDepartment.name
      );


    return (

      <div className="p-6">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="flex items-center gap-4 mb-6">

          <button
            type="button"
            onClick={handleBack}
            className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition"
          >
            <FaArrowLeft />
          </button>


          <div>

            <h1 className="text-2xl font-bold text-slate-800">
              {selectedDepartment.name}
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Doctors and their current availability.
            </p>

          </div>

        </div>


        {/* =====================================
            DOCTOR COUNT
        ===================================== */}

        <div className="mb-6">

          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 text-sm font-semibold">

            <FaUsers />

            {departmentDoctors.length} Doctors

          </span>

        </div>


        {/* =====================================
            DOCTORS
        ===================================== */}

        {departmentDoctors.length > 0 ? (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

            {departmentDoctors.map((doctor) => {

              const available =
                isDoctorAvailable(doctor);


              return (

                <div
                  key={doctor._id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition"
                >

                  {/* DOCTOR HEADER */}

                  <div className="flex items-center gap-4">

                    <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center text-2xl overflow-hidden">

                      {doctor.image ? (

                        <img
                          src={`http://localhost:5000/uploads/doctors/${doctor.image}`}
                          alt={doctor.name}
                          className="w-full h-full object-cover"
                        />

                      ) : (

                        <FaUserMd />

                      )}

                    </div>


                    <div className="flex-1 min-w-0">

                      <h3 className="font-bold text-slate-800 truncate">

                        {doctor.name}

                      </h3>


                      <p className="text-sm text-slate-500 truncate">

                        {doctor.qualification ||
                          "Doctor"}

                      </p>

                    </div>

                  </div>


                  {/* DIVIDER */}

                  <div className="border-t border-slate-100 my-4" />


                  {/* DETAILS */}

                  <div className="space-y-3">

                    <div className="flex justify-between text-sm">

                      <span className="text-slate-400">
                        Experience
                      </span>

                      <span className="font-semibold text-slate-700">

                        {doctor.experience || 0} Years

                      </span>

                    </div>


                    <div className="flex justify-between text-sm">

                      <span className="text-slate-400">
                        Consultation Fee
                      </span>

                      <span className="font-semibold text-slate-700">

                        {doctor.fee
                          ? `$${doctor.fee}`
                          : "Not Set"}

                      </span>

                    </div>

                  </div>


                  {/* AVAILABILITY */}

                  <div className="mt-5">

                    {available ? (

                      <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-50 text-green-700 border border-green-200 font-semibold text-sm">

                        <FaCheckCircle />

                        Available

                      </div>

                    ) : (

                      <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-700 border border-red-200 font-semibold text-sm">

                        <FaTimesCircle />

                        Not Available

                      </div>

                    )}

                  </div>

                </div>

              );

            })}

          </div>

        ) : (

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">

            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl mb-4">

              <FaUserMd />

            </div>


            <h3 className="text-lg font-bold text-slate-700">

              No Doctors Found

            </h3>


            <p className="text-sm text-slate-400 mt-1">

              There are no doctors assigned to this department.

            </p>

          </div>

        )}

      </div>

    );

  }


  // ==========================================
  // DEPARTMENT LIST
  // ==========================================

  return (

    <div className="p-6">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="mb-6">

        <h1 className="text-2xl font-bold text-slate-800">

          Doctor Availability

        </h1>

        <p className="text-sm text-slate-500 mt-1">

          Select a department to view its doctors
          and availability.

        </p>

      </div>


      {/* =====================================
          DEPARTMENT COUNT
      ===================================== */}

      <div className="mb-6">

        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 text-sm font-semibold">

          <FaBuilding />

          {departments.length} Departments

        </span>

      </div>


      {/* =====================================
          DEPARTMENT CARDS
      ===================================== */}

      {departments.length > 0 ? (

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

          {departments.map((department) => {

            const departmentDoctors =
              getDepartmentDoctors(
                department.name
              );


            return (

              <button
                type="button"
                key={department._id}
                onClick={() =>
                  handleDepartmentClick(
                    department
                  )
                }
                className="text-left bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-lg hover:border-sky-200 transition group"
              >

                {/* ICON */}

                <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center text-2xl mb-5 group-hover:bg-sky-500 group-hover:text-white transition">

                  <FaBuilding />

                </div>


                {/* NAME */}

                <h3 className="text-lg font-bold text-slate-800">

                  {department.name}

                </h3>


                {/* DESCRIPTION */}

                <p className="text-sm text-slate-500 mt-2 line-clamp-2">

                  {department.description ||
                    "View doctors available in this department."}

                </p>


                {/* DOCTOR COUNT */}

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">

                  <span className="flex items-center gap-2 text-sm text-slate-500">

                    <FaUsers />

                    {departmentDoctors.length} Doctors

                  </span>


                  <span className="text-sm font-semibold text-sky-500">

                    View Doctors →

                  </span>

                </div>

              </button>

            );

          })}

        </div>

      ) : (

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">

          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto text-2xl mb-4">

            <FaBuilding />

          </div>


          <h3 className="text-lg font-bold text-slate-700">

            No Departments Found

          </h3>


          <p className="text-sm text-slate-400 mt-1">

            No departments are currently available.

          </p>

        </div>

      )}

    </div>

  );

};


export default DoctorAvailability;