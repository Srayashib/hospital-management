import { useEffect, useState } from "react";

import {
  FiArrowLeft,
  FiCalendar,
  FiUser,
  FiMapPin,
} from "react-icons/fi";

import toast from "react-hot-toast";

import {
  getDepartments,
  getDoctorsByDepartment,
} from "../../services/patientProfileService";
import { useNavigate } from "react-router-dom";

const Doctors = () => {

  const [departments, setDepartments] =
    useState([]);

  const [doctors, setDoctors] =
    useState([]);

  const [selectedDepartment, setSelectedDepartment] =
    useState(null);

  const [loadingDepartments, setLoadingDepartments] =
    useState(true);

  const [loadingDoctors, setLoadingDoctors] =
    useState(false);
    const navigate = useNavigate();


  /* =====================================================
     LOAD DEPARTMENTS
  ===================================================== */

  useEffect(() => {

    const loadDepartments = async () => {

      try {

        setLoadingDepartments(true);

        const response =
          await getDepartments();


        setDepartments(
          response.departments || []
        );

      } catch (error) {

        console.error(
          "Department loading error:",
          error
        );

        toast.error(
          error.response?.data?.message ||
          "Failed to load departments"
        );

      } finally {

        setLoadingDepartments(false);

      }

    };


    loadDepartments();

  }, []);


  /* =====================================================
     LOAD DOCTORS
  ===================================================== */

  const handleDepartmentClick = async (
    department
  ) => {

    try {

      setSelectedDepartment(
        department
      );

      setLoadingDoctors(true);

      setDoctors([]);


      const response =
        await getDoctorsByDepartment(
          department.name
        );


      setDoctors(
        response.doctors || []
      );

    } catch (error) {

      console.error(
        "Doctor loading error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to load doctors"
      );

    } finally {

      setLoadingDoctors(false);

    }

  };


  /* =====================================================
     BACK TO DEPARTMENTS
  ===================================================== */

  const handleBack = () => {

    setSelectedDepartment(null);

    setDoctors([]);

  };


  /* =====================================================
     LOADING DEPARTMENTS
  ===================================================== */

  if (loadingDepartments) {

    return (

      <div className="p-4 sm:p-6 lg:p-8">

        <div className="max-w-[1200px] mx-auto">

          <div className="
            bg-white
            rounded-2xl
            border border-slate-200
            shadow-sm
            p-10
            text-center
          ">

            <div className="
              w-10 h-10
              border-4
              border-sky-100
              border-t-sky-600
              rounded-full
              animate-spin
              mx-auto
              mb-4
            " />

            <p className="text-slate-500">
              Loading departments...
            </p>

          </div>

        </div>

      </div>

    );

  }


  return (

    <div className="
      p-4
      sm:p-6
      lg:p-8
      max-w-[1200px]
      mx-auto
    ">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-7">

        <h1 className="
          text-2xl
          sm:text-3xl
          font-bold
          text-slate-900
        ">

          Find Doctors

        </h1>

        <p className="
          text-slate-500
          mt-2
        ">

          Choose a department to find available doctors.

        </p>

      </div>


      {/* =================================================
          DOCTORS VIEW
      ================================================= */}

      {selectedDepartment ? (

        <>

          {/* Back button */}

          <button
            type="button"
            onClick={handleBack}
            className="
              flex
              items-center
              gap-2
              mb-6
              text-sm
              font-semibold
              text-sky-600
              hover:text-sky-700
              cursor-pointer
            "
          >

            <FiArrowLeft />

            Back to Departments

          </button>


          {/* Department title */}

          <div className="mb-6">

            <h2 className="
              text-xl
              sm:text-2xl
              font-bold
              text-slate-900
            ">

              {selectedDepartment.name}

            </h2>

            <p className="
              text-sm
              text-slate-500
              mt-1
            ">

              Doctors available in this department

            </p>

          </div>


          {/* Loading doctors */}

          {loadingDoctors ? (

            <div className="
              bg-white
              rounded-2xl
              border border-slate-200
              p-10
              text-center
            ">

              <div className="
                w-10 h-10
                border-4
                border-sky-100
                border-t-sky-600
                rounded-full
                animate-spin
                mx-auto
                mb-4
              " />

              <p className="text-slate-500">
                Loading doctors...
              </p>

            </div>

          ) : doctors.length === 0 ? (

            <div className="
              bg-white
              rounded-2xl
              border border-slate-200
              p-10
              text-center
            ">

              <FiUser
                className="
                  mx-auto
                  text-slate-300
                "
                size={40}
              />

              <h3 className="
                mt-4
                font-semibold
                text-slate-700
              ">

                No doctors found

              </h3>

              <p className="
                text-sm
                text-slate-400
                mt-1
              ">

                There are currently no doctors
                in this department.

              </p>

            </div>

          ) : (

            /* =================================================
               DOCTOR CARDS
            ================================================= */

            <div className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-5
            ">

              {doctors.map((doctor) => (

                <div
                  key={doctor._id}
                  className="
                    bg-white
                    rounded-2xl
                    border border-slate-200
                    shadow-sm
                    p-5
                    hover:shadow-md
                    transition
                  "
                >

                  {/* Avatar */}

                  <div className="
                      w-16 h-16
                      rounded-2xl
                      overflow-hidden
                      bg-sky-100
                      text-sky-700
                      flex
                      items-center
                      justify-center
                      text-xl
                      font-bold
                      mb-4
                      shrink-0
                    ">

                      {doctor.image ? (

                        <img
                          src={`http://localhost:5000/uploads/doctors/${doctor.image}`}
                          alt={`Dr. ${doctor.name}`}
                          className="w-full h-full object-cover"
                        />

                      ) : (

                        doctor.name
                          ?.charAt(0)
                          ?.toUpperCase()

                      )}

                    </div>

                  {/* Doctor name */}

                  <h3 className="
                    text-lg
                    font-bold
                    text-slate-900
                  ">

                    Dr. {doctor.name}

                  </h3>


                  {/* Department */}

                  <p className="
                    text-sm
                    text-sky-600
                    font-medium
                    mt-1
                  ">

                    {doctor.department}

                  </p>


                  {/* Location */}

                  {doctor.location && (

                    <div className="
                      flex
                      items-center
                      gap-2
                      text-sm
                      text-slate-500
                      mt-3
                    ">

                      <FiMapPin />

                      {doctor.location}

                    </div>

                  )}


                  {/* Appointment button */}

                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/patient/doctors/${doctor._id}/availability`, {
                        state: {
                          doctor,
                          department: selectedDepartment,
                        },
                      })
                    }
                    className="
                      w-full
                      mt-5
                      px-4
                      py-2.5
                      bg-sky-600
                      hover:bg-sky-700
                      text-white
                      rounded-xl
                      text-sm
                      font-semibold
                      transition
                      cursor-pointer
                      flex
                      items-center
                      justify-center
                      gap-2
                    "
                  >
                    <FiCalendar />

                    Check Availability
                  </button>

                </div>

              ))}

            </div>

          )}

        </>

      ) : (

        /* =================================================
           DEPARTMENT VIEW
        ================================================= */

        <div className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          gap-5
        ">

          {departments.map((department) => (

            <button
              key={department._id}
              type="button"
              onClick={() =>
                handleDepartmentClick(
                  department
                )
              }
              className="
                text-left
                bg-white
                rounded-2xl
                border border-slate-200
                shadow-sm
                p-6
                hover:border-sky-300
                hover:shadow-md
                transition
                cursor-pointer
              "
            >

              <div className="
                w-14 h-14
                rounded-2xl
                bg-sky-100
                text-sky-600
                flex
                items-center
                justify-center
                mb-4
              ">

                <FiUser size={24} />

              </div>


              <h2 className="
                text-lg
                font-bold
                text-slate-900
              ">

                {department.name}

              </h2>


              {department.description && (

                <p className="
                  text-sm
                  text-slate-500
                  mt-2
                  line-clamp-2
                ">

                  {department.description}

                </p>

              )}


              <p className="
                text-sm
                text-sky-600
                font-semibold
                mt-4
              ">

                View Doctors →

              </p>

            </button>

          ))}

        </div>

      )}

    </div>

  );

};


export default Doctors;