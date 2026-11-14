import { useEffect, useState } from "react";

import {
  FaCalendarCheck,
  FaUser,
  FaUserMd,
  FaCalendarAlt,
  FaClock,
  FaSearch,
  FaEnvelope,
  FaPhone,
  FaCheckCircle,
} from "react-icons/fa";

import toast from "react-hot-toast";

import {
  searchPatientByEmail,
  getDepartments,
  getDoctorsByDepartment,
  getSlotsByDoctorAndDate,
  receptionistBookAppointment,
} from "../../services/receptionistService";


const BookAppointment = () => {


  const [patientEmail, setPatientEmail] = useState("");

  const [patients, setPatients] = useState([]);

  const [selectedPatient, setSelectedPatient] =
    useState(null);

  const [searchingPatient, setSearchingPatient] =
    useState(false);

    const [departments, setDepartments] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState("");
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState("");
    const [loadingDepartments, setLoadingDepartments] = useState(false);
    const [loadingDoctors, setLoadingDoctors] = useState(false);
    const [appointmentDate, setAppointmentDate] = useState("");
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState("");
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [doctorFee, setDoctorFee] = useState(null);
    const [reason, setReason] = useState("");
    const [booking, setBooking] = useState(false);

  useEffect(() => {

    const searchPatient = async () => {

      const email = patientEmail.trim();


      if (email.length < 2) {

        setPatients([]);

        return;
      }


      try {

        setSearchingPatient(true);

        const response =
          await searchPatientByEmail(email);


        setPatients(
          response.patients || []
        );

      } catch (error) {

        console.error(
          "Patient search error:",
          error
        );

        toast.error(
          error.response?.data?.message ||
          "Failed to search patient"
        );

        setPatients([]);

      } finally {

        setSearchingPatient(false);

      }

    };


    const timer = setTimeout(
      searchPatient,
      400
    );


    return () => clearTimeout(timer);

  }, [patientEmail]);
useEffect(() => {
  const loadDepartments = async () => {
    try {
      setLoadingDepartments(true);

      const response = await getDepartments();

      setDepartments(response.departments || []);
    } catch (error) {
      console.error("Department loading error:", error);

      toast.error(
        error.response?.data?.message ||
        "Failed to load departments"
      );

      setDepartments([]);
    } finally {
      setLoadingDepartments(false);
    }
  };

  loadDepartments();
}, []);

useEffect(() => {
  const loadDoctors = async () => {
    if (!selectedDepartment) {
      setDoctors([]);
      setSelectedDoctor("");
      return;
    }

    try {
      setLoadingDoctors(true);

      const response = await getDoctorsByDepartment(
        selectedDepartment
      );

      setDoctors(response.doctors || []);
      setSelectedDoctor("");
    } catch (error) {
      console.error("Doctor loading error:", error);

      toast.error(
        error.response?.data?.message ||
        "Failed to load doctors"
      );

      setDoctors([]);
      setSelectedDoctor("");
    } finally {
      setLoadingDoctors(false);
    }
  };

  loadDoctors();
}, [selectedDepartment]);
useEffect(() => {

  const loadSlots = async () => {

    if (!selectedDoctor || !appointmentDate) {

      setSlots([]);
      setSelectedSlot("");

      return;
    }


    try {

      setLoadingSlots(true);

      setSelectedSlot("");


      const response =
        await getSlotsByDoctorAndDate(
          selectedDoctor,
          appointmentDate
        );


      setSlots(response.slots || []);


    } catch (error) {

      console.error(
        "Slot loading error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Failed to load available slots"
      );

      setSlots([]);

    } finally {

      setLoadingSlots(false);

    }

  };


  loadSlots();

}, [
  selectedDoctor,
  appointmentDate,
]);
const handleBookAppointment = async () => {

  // ==========================================
  // VALIDATE PATIENT
  // ==========================================

  if (!selectedPatient) {
    toast.error("Please select a patient.");
    return;
  }


  // ==========================================
  // VALIDATE DEPARTMENT
  // ==========================================

  if (!selectedDepartment) {
    toast.error("Please select a department.");
    return;
  }


  // ==========================================
  // VALIDATE DOCTOR
  // ==========================================

  if (!selectedDoctor) {
    toast.error("Please select a doctor.");
    return;
  }


  // ==========================================
  // VALIDATE DATE
  // ==========================================

  if (!appointmentDate) {
    toast.error("Please select appointment date.");
    return;
  }


  // ==========================================
  // VALIDATE SLOT
  // ==========================================

  if (!selectedSlot) {
    toast.error("Please select a time slot.");
    return;
  }


  // ==========================================
  // VALIDATE REASON
  // ==========================================

  if (!reason.trim()) {
    toast.error("Please enter reason for appointment.");
    return;
  }


  try {

    setBooking(true);


    const response =
      await receptionistBookAppointment({

        patientId: selectedPatient._id,

        slotId: selectedSlot,

        reason: reason.trim(),

      });


    // ==========================================
    // SUCCESS
    // ==========================================

    toast.success(
      response.message ||
      "Appointment booked successfully."
    );


    // ==========================================
    // RESET SLOT
    // ==========================================

    setSelectedSlot("");


    // Remove booked slot from available list
    setSlots((currentSlots) =>
      currentSlots.map((slot) =>
        slot._id === selectedSlot
          ? {
              ...slot,
              isAvailable: false,
              slotStatus: "Booked",
              appointmentStatus: "Pending",
            }
          : slot
      )
    );


    // ==========================================
    // RESET REASON
    // ==========================================

    setReason("");


  } catch (error) {

    console.error(
      "Appointment booking error:",
      error
    );


    toast.error(
      error.response?.data?.message ||
      "Failed to book appointment."
    );


  } finally {

    setBooking(false);

  }
};
  const handleSelectPatient = (patient) => {

    setSelectedPatient(patient);

    setPatientEmail(patient.email);

    setPatients([]);

  };

  const handleChangePatient = () => {

    setSelectedPatient(null);

    setPatientEmail("");

    setPatients([]);

  };


  return (

    <div className="
      p-4
      sm:p-6
      lg:p-8
    ">

     

      <div className="mb-7">

        <h1 className="
          text-2xl
          sm:text-3xl
          font-bold
          text-slate-900
        ">

          Book Appointment

        </h1>

        <p className="
          text-slate-500
          mt-2
        ">

          Book an appointment for a patient
          with an available doctor.

        </p>

      </div>

      <div className="
        bg-white
        rounded-2xl
        border border-slate-200
        shadow-sm
        p-6
        mb-6
      ">

        <h2 className="
          text-lg
          font-bold
          text-slate-900
          flex
          items-center
          gap-2
          mb-5
        ">

          <FaUser className="text-sky-600" />

          Patient Information

        </h2>


        {selectedPatient ? (

          <div className="
            border
            border-emerald-200
            bg-emerald-50
            rounded-xl
            p-4
          ">

            <div className="
              flex
              items-start
              justify-between
              gap-4
            ">

              <div className="
                flex
                items-center
                gap-3
              ">

                <div className="
                  w-11
                  h-11
                  rounded-full
                  bg-emerald-100
                  text-emerald-600
                  flex
                  items-center
                  justify-center
                ">

                  <FaCheckCircle />

                </div>


                <div>

                  <p className="
                    text-xs
                    text-emerald-600
                    font-semibold
                    uppercase
                  ">

                    Selected Patient

                  </p>

                  <h3 className="
                    text-lg
                    font-bold
                    text-slate-900
                  ">

                    {selectedPatient.name}

                  </h3>

                  <div className="
                    flex
                    flex-col
                    sm:flex-row
                    sm:items-center
                    gap-1
                    sm:gap-4
                    mt-1
                    text-sm
                    text-slate-500
                  ">

                    <span className="
                      flex
                      items-center
                      gap-2
                    ">

                      <FaEnvelope />

                      {selectedPatient.email}

                    </span>


                    {selectedPatient.phone && (

                      <span className="
                        flex
                        items-center
                        gap-2
                      ">

                        <FaPhone />

                        {selectedPatient.phone}

                      </span>

                    )}

                  </div>

                </div>

              </div>


              <button
                type="button"
                onClick={handleChangePatient}
                className="
                  text-sm
                  font-semibold
                  text-sky-600
                  hover:text-sky-700
                  cursor-pointer
                "
              >

                Change

              </button>

            </div>

          </div>

        ) : (

          <div>

            <label className="
              block
              text-sm
              font-semibold
              text-slate-700
              mb-2
            ">

              Patient Email

              <span className="text-red-500">
                *
              </span>

            </label>


            <div className="relative">

              <FaSearch className="
                absolute
                left-3
                top-3.5
                text-slate-400
              " />


              <input
                type="email"
                value={patientEmail}
                onChange={(e) => {

                  setPatientEmail(
                    e.target.value
                  );

                  if (selectedPatient) {
                    setSelectedPatient(null);
                  }

                }}
                placeholder="Enter patient email"
                className="
                  w-full
                  pl-10
                  pr-4
                  py-3
                  border
                  border-slate-200
                  rounded-xl
                  text-sm
                  outline-none
                  focus:border-sky-500
                  focus:ring-2
                  focus:ring-sky-100
                "
              />

            </div>


            {searchingPatient && (

              <div className="
                mt-2
                text-sm
                text-slate-500
              ">

                Searching patients...

              </div>

            )}


            {!searchingPatient &&
              patients.length > 0 && (

              <div className="
                mt-2
                border
                border-slate-200
                rounded-xl
                bg-white
                shadow-lg
                overflow-hidden
              ">

                {patients.map((patient) => (

                  <button
                    key={patient._id}
                    type="button"
                    onClick={() =>
                      handleSelectPatient(
                        patient
                      )
                    }
                    className="
                      w-full
                      text-left
                      px-4
                      py-3
                      hover:bg-sky-50
                      transition
                      border-b
                      border-slate-100
                      last:border-b-0
                      cursor-pointer
                    "
                  >

                    <div className="
                      flex
                      items-center
                      gap-3
                    ">

                      <div className="
                        w-10
                        h-10
                        rounded-full
                        bg-sky-100
                        text-sky-600
                        flex
                        items-center
                        justify-center
                        font-bold
                      ">

                        {patient.name
                          ?.charAt(0)
                          ?.toUpperCase()}

                      </div>


                      <div>

                        <p className="
                          font-semibold
                          text-slate-800
                        ">

                          {patient.name}

                        </p>


                        <p className="
                          text-sm
                          text-slate-500
                        ">

                          {patient.email}

                        </p>


                        {patient.phone && (

                          <p className="
                            text-xs
                            text-slate-400
                            mt-0.5
                          ">

                            {patient.phone}

                          </p>

                        )}

                      </div>

                    </div>

                  </button>

                ))}

              </div>

            )}


            {!searchingPatient &&
              patientEmail.trim().length >= 2 &&
              patients.length === 0 && (

              <p className="
                mt-2
                text-sm
                text-slate-400
              ">

                No patient found with this email.

              </p>

            )}

          </div>

        )}

      </div>

      <div className="
        bg-white
        rounded-2xl
        border border-slate-200
        shadow-sm
        p-6
      ">

        <h2 className="
          text-lg
          font-bold
          text-slate-900
          flex
          items-center
          gap-2
          mb-5
        ">

          <FaCalendarCheck className="text-sky-600" />

          Appointment Details

        </h2>


        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          gap-5
        ">

          {/* Department */}

            <div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">
                Department
            </label>

            <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                disabled={loadingDepartments}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500 disabled:bg-slate-100"
            >

                <option value="">
                {loadingDepartments
                    ? "Loading departments..."
                    : "Select Department"}
                </option>

                {departments.map((department) => (

                <option
                    key={department._id}
                    value={department.name}
                >
                    {department.name}
                </option>

                ))}

            </select>

            </div>


            <div>

            <label className="block text-sm font-semibold text-slate-700 mb-2">
                Doctor
            </label>

            <select
                value={selectedDoctor}
                onChange={(e) => {
                const doctorId = e.target.value;

                setSelectedDoctor(doctorId);
                setSelectedSlot("");

                const doctor = doctors.find(
                    (doctor) => doctor._id === doctorId
                );

                setDoctorFee(doctor?.fee ?? null);
                }}
                disabled={!selectedDepartment || loadingDoctors}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500 disabled:bg-slate-100"
            >

                <option value="">
                {!selectedDepartment
                    ? "Select Department First"
                    : loadingDoctors
                    ? "Loading doctors..."
                    : "Select Doctor"}
                </option>

                {doctors.map((doctor) => (

                <option
                    key={doctor._id}
                    value={doctor._id}
                >
                    Dr. {doctor.name}
                </option>

                ))}

            </select>

            </div>
            {selectedDoctor && doctorFee !== null && (
            <div className="
                mt-2
                flex
                items-center
                justify-between
                px-3
                py-2
                bg-sky-50
                border
                border-sky-100
                rounded-lg
            ">
                <span className="
                text-xs
                font-medium
                text-slate-500
                ">
                Consultation Fee
                </span>

                <span className="
                text-sm
                font-bold
                text-sky-700
                ">
                ₹{doctorFee}
                </span>
            </div>
            )}


          {/* Date */}

          <div>

            <label className="
              block
              text-sm
              font-semibold
              text-slate-700
              mb-2
            ">

              Appointment Date

            </label>

            <div className="relative">

              <FaCalendarAlt className="
                absolute
                left-3
                top-3.5
                text-slate-400
              " />

              <input
                type="date"
                value={appointmentDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setAppointmentDate(e.target.value)}
                disabled={!selectedDoctor}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500 disabled:bg-slate-100"
              />

            </div>

          </div>


          {/* Time */}

          <div>

            <label className="
              block
              text-sm
              font-semibold
              text-slate-700
              mb-2
            ">

              Time Slot

            </label>

            <div className="relative">

              <FaClock className="
                absolute
                left-3
                top-3.5
                text-slate-400
              " />

              <select
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
                disabled={!selectedDoctor || !appointmentDate || loadingSlots}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-sky-500 disabled:bg-slate-100"
                >
                <option value="">
                    {!selectedDoctor
                    ? "Select Doctor First"
                    : !appointmentDate
                    ? "Select Date First"
                    : loadingSlots
                    ? "Loading time slots..."
                    : slots.length === 0
                    ? "No slots available"
                    : "Select Time Slot"}
                </option>

                {slots.map((slot) => (
                    <option
                    key={slot._id}
                    value={slot._id}
                    disabled={!slot.isAvailable}
                    >
                    {slot.startTime} - {slot.endTime}
                    {!slot.isAvailable ? " — Booked" : " — Available"}
                    </option>
                ))}
            </select>

            </div>

          </div>

        </div>


        {/* Reason */}

        <div className="mt-5">

          <label className="
            block
            text-sm
            font-semibold
            text-slate-700
            mb-2
          ">

            Reason for Appointment

          </label>

          <textarea
            rows="4"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for appointment..."
            className="
              w-full
              px-4
              py-3
              border
              border-slate-200
              rounded-xl
              text-sm
              outline-none
              resize-none
              focus:border-sky-500
            "
          />

        </div>


        {/* Button */}

        <div className="
          mt-6
          flex
          justify-end
        ">

          <button
  type="button"
  onClick={handleBookAppointment}
  disabled={
    booking ||
    !selectedPatient ||
    !selectedDepartment ||
    !selectedDoctor ||
    !appointmentDate ||
    !selectedSlot ||
    !reason.trim()
  }
  className="
    px-6
    py-3
    bg-sky-600
    hover:bg-sky-700
    disabled:bg-slate-300
    disabled:cursor-not-allowed
    text-white
    rounded-xl
    text-sm
    font-semibold
    flex
    items-center
    gap-2
    cursor-pointer
  "
>
  <FaCalendarCheck />

  {booking
    ? "Booking..."
    : "Book Appointment"}
</button>

        </div>

      </div>

    </div>

  );
};


export default BookAppointment;