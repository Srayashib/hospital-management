import {
  FaUsers,
  FaSearch,
  FaUser,
  FaEye,
  FaEdit,
} from "react-icons/fa";

import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  getReceptionistPatients,
} from "../../services/receptionistService";


const Patients = () => {

  const [search, setSearch] =
    useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);

  const [patients, setPatients] =
    useState([]);

  const [summary, setSummary] =
    useState({
      totalPatients: 0,
      activePatients: 0,
      newThisMonth: 0,
    });

  const [loading, setLoading] =
    useState(true);

    const [selectedPatient, setSelectedPatient] =
  useState(null);


  /* =====================================================
     LOAD PATIENTS
  ===================================================== */

  const loadPatients = async () => {

    try {

      setLoading(true);

      const response =
        await getReceptionistPatients();


      if (response.success) {

        setPatients(
          response.patients || []
        );

        setSummary(
          response.summary || {
            totalPatients: 0,
            activePatients: 0,
            newThisMonth: 0,
          }
        );

      }

    } catch (error) {

      console.error(
        "Load patients error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
        "Failed to load patients"
      );

    } finally {

      setLoading(false);

    }

  };
  /* =====================================================
   FORMAT DATE
===================================================== */

const formatDate = (date) => {

  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );
};


/* =====================================================
   FULL ADDRESS
===================================================== */

const getFullAddress = (patient) => {

  const address = patient.address;

  if (!address) {
    return "—";
  }

  const parts = [
    address.street,
    address.city,
    address.state,
    address.zipCode,
    address.country,
  ].filter(Boolean);

  return parts.length
    ? parts.join(", ")
    : "—";
};


  /* =====================================================
     LOAD ON PAGE OPEN
  ===================================================== */

  useEffect(() => {

    loadPatients();

  }, []);



useEffect(() => {

  // If search box is empty
  if (!search.trim()) {

    setSearchTerm("");
    setSearchLoading(false);

    return;

  }

  // Show search spinner immediately
  setSearchLoading(true);

  const timer = setTimeout(() => {

    // Perform search after 10 seconds
    setSearchTerm(search);

    // Hide spinner
    setSearchLoading(false);

  }, 3000);

  return () => {

    clearTimeout(timer);

  };

}, [search]);


  /* =====================================================
     CALCULATE AGE
  ===================================================== */

  const calculateAge = (dateOfBirth) => {

    if (!dateOfBirth) {
      return "—";
    }

    const birthDate =
      new Date(dateOfBirth);

    const today =
      new Date();

    let age =
      today.getFullYear() -
      birthDate.getFullYear();

    const monthDifference =
      today.getMonth() -
      birthDate.getMonth();


    if (
      monthDifference < 0 ||
      (
        monthDifference === 0 &&
        today.getDate() <
          birthDate.getDate()
      )
    ) {

      age--;

    }


    return age;

  };


  /* =====================================================
     PATIENT ID
  ===================================================== */

  const getPatientId = (id) => {

    if (!id) {
      return "PATIENT";
    }

    return `PAT-${id
      .slice(-6)
      .toUpperCase()}`;

  };


  /* =====================================================
     SEARCH
  ===================================================== */

 const filteredPatients =
  patients.filter((patient) => {

    const term =
      searchTerm.toLowerCase().trim();

    return (
      patient.name
        ?.toLowerCase()
        .includes(term)

      ||

      patient.email
        ?.toLowerCase()
        .includes(term)

      ||

      patient.phone
        ?.toLowerCase()
        .includes(term)

      ||

      getPatientId(patient._id)
        .toLowerCase()
        .includes(term)
    );

  });


  return (

    <div className="p-4 sm:p-6 lg:p-8">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="
        flex
        flex-col
        sm:flex-row
        sm:items-center
        sm:justify-between
        gap-4
        mb-7
      ">

        <div>

          <h1 className="
            text-2xl
            sm:text-3xl
            font-bold
            text-slate-900
          ">
            Patients
          </h1>

          <p className="
            text-slate-500
            mt-2
          ">
            View and manage registered patients.
          </p>

        </div>

      </div>


      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        gap-5
        mb-6
      ">


        {/* TOTAL */}

        <div className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          shadow-sm
          p-5
        ">

          <div className="
            flex
            items-center
            gap-4
          ">

            <div className="
              w-12
              h-12
              rounded-xl
              bg-sky-50
              text-sky-600
              flex
              items-center
              justify-center
            ">

              <FaUsers />

            </div>


            <div>

              <p className="
                text-sm
                text-slate-500
              ">
                Total Patients
              </p>

              <h3 className="
                text-2xl
                font-bold
                text-slate-900
              ">
                {summary.totalPatients}
              </h3>

            </div>

          </div>

        </div>


        {/* ACTIVE */}

        <div className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          shadow-sm
          p-5
        ">

          <p className="
            text-sm
            text-slate-500
          ">
            Active Patients
          </p>

          <h3 className="
            text-2xl
            font-bold
            text-green-600
            mt-1
          ">
            {summary.activePatients}
          </h3>

        </div>


        {/* NEW */}

        <div className="
          bg-white
          rounded-2xl
          border
          border-slate-200
          shadow-sm
          p-5
        ">

          <p className="
            text-sm
            text-slate-500
          ">
            New This Month
          </p>

          <h3 className="
            text-2xl
            font-bold
            text-sky-600
            mt-1
          ">
            {summary.newThisMonth}
          </h3>

        </div>

      </div>


      {/* =================================================
          PATIENT LIST
      ================================================= */}

      <div className="
        bg-white
        rounded-2xl
        border
        border-slate-200
        shadow-sm
        overflow-hidden
      ">


        {/* HEADER */}

        <div className="
          p-5
          border-b
          border-slate-200
          flex
          flex-col
          lg:flex-row
          lg:items-center
          lg:justify-between
          gap-4
        ">

          <div>

            <h2 className="
              text-lg
              font-bold
              text-slate-900
            ">
              Registered Patients
            </h2>

            <p className="
              text-sm
              text-slate-500
              mt-1
            ">
              {filteredPatients.length} patients shown
            </p>

          </div>


          {/* SEARCH */}

          <div className="w-full lg:w-96">

            {/* SEARCH INPUT */}

            <div className="relative">

              <FaSearch className="
                absolute
                left-3
                top-3.5
                text-slate-400
              " />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search patient..."
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


            {/* SEARCH LOADING */}

            {searchLoading && (

              <div className="
                flex
                items-center
                gap-2
                mt-2
                text-sm
                text-sky-600
              ">

                <div className="
                  w-4
                  h-4
                  border-2
                  border-sky-200
                  border-t-sky-600
                  rounded-full
                  animate-spin
                " />

                <span>
                  Searching patients...
                </span>

              </div>

            )}

          </div>

        </div>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading ? (

          <div className="
            py-16
            text-center
            text-slate-500
          ">
            Loading patients...
          </div>

        ) : filteredPatients.length === 0 ? (

          <div className="
            py-16
            text-center
            text-slate-500
          ">

            <FaUsers className="
              mx-auto
              text-4xl
              text-slate-300
              mb-3
            " />

            <p>
              No patients found.
            </p>

          </div>

        ) : (

          /* =================================================
             TABLE
          ================================================= */

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-slate-50">

                <tr>

                  <th className="
                    px-5
                    py-4
                    text-left
                    text-xs
                    font-semibold
                    text-slate-500
                    uppercase
                  ">
                    Patient
                  </th>

                  <th className="
                    px-5
                    py-4
                    text-left
                    text-xs
                    font-semibold
                    text-slate-500
                    uppercase
                  ">
                    Contact
                  </th>

                  <th className="
                    px-5
                    py-4
                    text-left
                    text-xs
                    font-semibold
                    text-slate-500
                    uppercase
                  ">
                    Gender
                  </th>

                  <th className="
                    px-5
                    py-4
                    text-left
                    text-xs
                    font-semibold
                    text-slate-500
                    uppercase
                  ">
                    Age
                  </th>

                  <th className="
                    px-5
                    py-4
                    text-left
                    text-xs
                    font-semibold
                    text-slate-500
                    uppercase
                  ">
                    Status
                  </th>

                  <th className="
                    px-5
                    py-4
                    text-right
                    text-xs
                    font-semibold
                    text-slate-500
                    uppercase
                  ">
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody className="
                divide-y
                divide-slate-100
              ">

                {filteredPatients.map(
                  (patient) => (

                    <tr
                      key={patient._id}
                      className="
                        hover:bg-slate-50
                      "
                    >


                      {/* PATIENT */}

                      <td className="px-5 py-4">

                        <div className="
                          flex
                          items-center
                          gap-3
                        ">

                          <div className="
                            w-10
                            h-10
                            rounded-full
                            bg-sky-50
                            text-sky-600
                            flex
                            items-center
                            justify-center
                          ">
                            <FaUser />
                          </div>


                          <div>

                            <p className="
                              font-semibold
                              text-slate-800
                            ">
                              {patient.name}
                            </p>

                            <p className="
                              text-xs
                              text-slate-400
                            ">
                              {getPatientId(
                                patient._id
                              )}
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* CONTACT */}

                      <td className="px-5 py-4">

                        <p className="
                          text-sm
                          text-slate-700
                        ">
                          {patient.phone || "—"}
                        </p>

                        <p className="
                          text-xs
                          text-slate-400
                          mt-1
                        ">
                          {patient.email || "—"}
                        </p>

                      </td>


                      {/* GENDER */}

                      <td className="
                        px-5
                        py-4
                        text-sm
                        text-slate-600
                      ">
                        {patient.gender || "—"}
                      </td>


                      {/* AGE */}

                      <td className="
                        px-5
                        py-4
                        text-sm
                        text-slate-600
                      ">
                        {calculateAge(
                          patient.dateOfBirth
                        )}
                      </td>


                      {/* STATUS */}

                      <td className="px-5 py-4">

                        <span className={`
                          inline-flex
                          px-3
                          py-1.5
                          rounded-full
                          text-xs
                          font-semibold

                          ${
                            patient.status ===
                            "Active"

                              ? "bg-green-50 text-green-700"

                              : "bg-slate-100 text-slate-500"
                          }
                        `}>

                          {patient.status}

                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td className="
                        px-5
                        py-4
                        text-right
                      ">

                        <div className="
                          flex
                          justify-end
                          gap-2
                        ">

                         <button
                            type="button"
                            onClick={() => setSelectedPatient(patient)}
                            className="
                              p-2.5
                              rounded-lg
                              bg-sky-50
                              text-sky-600
                              hover:bg-sky-100
                              transition
                            "
                            title="View patient"
                          >
                            <FaEye />
                          </button>


                          {/* <button
                            type="button"
                            className="
                              p-2.5
                              rounded-lg
                              bg-slate-50
                              text-slate-600
                              hover:bg-slate-100
                            "
                            title="Edit patient"
                          >
                            <FaEdit />
                          </button> */}

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>
      {/* =====================================================
    PATIENT DETAILS MODAL
===================================================== */}

{selectedPatient && (

  <div
    className="
      fixed
      inset-0
      z-50
      flex
      items-center
      justify-center
      bg-slate-900/60
      backdrop-blur-sm
      p-4
    "
    onClick={() => setSelectedPatient(null)}
  >

    <div
      className="
        relative
        w-full
        max-w-3xl
        max-h-[90vh]
        overflow-y-auto
        bg-white
        rounded-3xl
        shadow-2xl
      "
      onClick={(e) =>
        e.stopPropagation()
      }
    >

      {/* =================================================
          MODAL HEADER
      ================================================= */}

      <div
        className="
          relative
          bg-gradient-to-r
          from-sky-600
          to-cyan-500
          px-6
          py-7
          sm:px-8
        "
      >

        {/* CLOSE */}

        <button
          type="button"
          onClick={() =>
            setSelectedPatient(null)
          }
          className="
            absolute
            top-4
            right-4
            w-10
            h-10
            rounded-full
            bg-white/20
            text-white
            flex
            items-center
            justify-center
            hover:bg-white/30
            transition
            text-xl
          "
          title="Close"
        >
          ×
        </button>


        <div
          className="
            flex
            flex-col
            sm:flex-row
            items-center
            sm:items-start
            gap-5
          "
        >

          {/* =================================================
              PATIENT IMAGE
          ================================================= */}

          <div
            className="
              w-24
              h-24
              rounded-2xl
              bg-white
              flex
              items-center
              justify-center
              overflow-hidden
              shadow-lg
              flex-shrink-0
            "
          >

            {selectedPatient.image ||
            selectedPatient.profileImage ||
            selectedPatient.photo ? (

              <img
                src={
                  selectedPatient.image ||
                  selectedPatient.profileImage ||
                  selectedPatient.photo
                }
                alt={selectedPatient.name}
                className="
                  w-full
                  h-full
                  object-cover
                "
              />

            ) : (

              <FaUser
                className="
                  text-4xl
                  text-sky-500
                "
              />

            )}

          </div>


          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <div
            className="
              text-center
              sm:text-left
            "
          >

            <p
              className="
                text-sky-100
                text-sm
                font-medium
              "
            >
              Patient Profile
            </p>

            <h2
              className="
                text-2xl
                sm:text-3xl
                font-bold
                text-white
                mt-1
              "
            >
              {selectedPatient.name || "—"}
            </h2>

            <p
              className="
                text-sky-100
                text-sm
                mt-2
              "
            >
              {getPatientId(
                selectedPatient._id
              )}
            </p>

          </div>

        </div>

      </div>


      {/* =================================================
          MODAL CONTENT
      ================================================= */}

      <div className="p-6 sm:p-8">


        {/* =================================================
            PERSONAL INFORMATION
        ================================================= */}

        <div className="mb-7">

          <h3
            className="
              text-lg
              font-bold
              text-slate-900
              mb-4
            "
          >
            Personal Information
          </h3>


          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-4
            "
          >

            {/* NAME */}

            <div
              className="
                rounded-xl
                bg-slate-50
                border
                border-slate-100
                p-4
              "
            >

              <p
                className="
                  text-xs
                  font-medium
                  text-slate-400
                  uppercase
                "
              >
                Full Name
              </p>

              <p
                className="
                  text-sm
                  font-semibold
                  text-slate-800
                  mt-1
                "
              >
                {selectedPatient.name || "—"}
              </p>

            </div>


            {/* PATIENT ID */}

            <div
              className="
                rounded-xl
                bg-slate-50
                border
                border-slate-100
                p-4
              "
            >

              <p
                className="
                  text-xs
                  font-medium
                  text-slate-400
                  uppercase
                "
              >
                Patient ID
              </p>

              <p
                className="
                  text-sm
                  font-semibold
                  text-sky-600
                  mt-1
                "
              >
                {getPatientId(
                  selectedPatient._id
                )}
              </p>

            </div>


            {/* GENDER */}

            <div
              className="
                rounded-xl
                bg-slate-50
                border
                border-slate-100
                p-4
              "
            >

              <p
                className="
                  text-xs
                  font-medium
                  text-slate-400
                  uppercase
                "
              >
                Gender
              </p>

              <p
                className="
                  text-sm
                  font-semibold
                  text-slate-800
                  mt-1
                "
              >
                {selectedPatient.gender ||
                  "—"}
              </p>

            </div>


            {/* DATE OF BIRTH */}

            <div
              className="
                rounded-xl
                bg-slate-50
                border
                border-slate-100
                p-4
              "
            >

              <p
                className="
                  text-xs
                  font-medium
                  text-slate-400
                  uppercase
                "
              >
                Date of Birth
              </p>

              <p
                className="
                  text-sm
                  font-semibold
                  text-slate-800
                  mt-1
                "
              >
                {formatDate(
                  selectedPatient.dateOfBirth
                )}
              </p>

            </div>


            {/* AGE */}

            <div
              className="
                rounded-xl
                bg-slate-50
                border
                border-slate-100
                p-4
              "
            >

              <p
                className="
                  text-xs
                  font-medium
                  text-slate-400
                  uppercase
                "
              >
                Age
              </p>

              <p
                className="
                  text-sm
                  font-semibold
                  text-slate-800
                  mt-1
                "
              >
                {calculateAge(
                  selectedPatient.dateOfBirth
                )}
                {selectedPatient.dateOfBirth
                  ? " years"
                  : ""}
              </p>

            </div>


            {/* STATUS */}

            <div
              className="
                rounded-xl
                bg-slate-50
                border
                border-slate-100
                p-4
              "
            >

              <p
                className="
                  text-xs
                  font-medium
                  text-slate-400
                  uppercase
                "
              >
                Account Status
              </p>

              <div className="mt-1">

                <span
                  className={`
                    inline-flex
                    px-3
                    py-1
                    rounded-full
                    text-xs
                    font-semibold
                    ${
                      selectedPatient.status ===
                      "Active"

                        ? "bg-green-50 text-green-700"

                        : "bg-slate-100 text-slate-500"
                    }
                  `}
                >
                  {selectedPatient.status ||
                    "—"}
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            CONTACT INFORMATION
        ================================================= */}

        <div className="mb-7">

          <h3
            className="
              text-lg
              font-bold
              text-slate-900
              mb-4
            "
          >
            Contact Information
          </h3>


          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-4
            "
          >

            {/* EMAIL */}

            <div
              className="
                rounded-xl
                border
                border-slate-200
                p-4
              "
            >

              <p
                className="
                  text-xs
                  font-medium
                  text-slate-400
                  uppercase
                "
              >
                Email
              </p>

              <p
                className="
                  text-sm
                  font-medium
                  text-slate-700
                  mt-1
                  break-all
                "
              >
                {selectedPatient.email ||
                  "—"}
              </p>

            </div>


            {/* PHONE */}

            <div
              className="
                rounded-xl
                border
                border-slate-200
                p-4
              "
            >

              <p
                className="
                  text-xs
                  font-medium
                  text-slate-400
                  uppercase
                "
              >
                Phone
              </p>

              <p
                className="
                  text-sm
                  font-medium
                  text-slate-700
                  mt-1
                "
              >
                {selectedPatient.phone ||
                  "—"}
              </p>

            </div>

          </div>

        </div>


        {/* =================================================
            ADDRESS
        ================================================= */}

        <div className="mb-7">

          <h3
            className="
              text-lg
              font-bold
              text-slate-900
              mb-4
            "
          >
            Address
          </h3>

          <div
            className="
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              p-4
            "
          >

            <p
              className="
                text-sm
                text-slate-700
                leading-6
              "
            >
              {getFullAddress(
                selectedPatient
              )}
            </p>

          </div>

        </div>


        {/* =================================================
            ACCOUNT INFORMATION
        ================================================= */}

        <div>

          <h3
            className="
              text-lg
              font-bold
              text-slate-900
              mb-4
            "
          >
            Account Information
          </h3>


          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              gap-4
            "
          >

            <div
              className="
                rounded-xl
                bg-slate-50
                border
                border-slate-100
                p-4
              "
            >

              <p
                className="
                  text-xs
                  font-medium
                  text-slate-400
                  uppercase
                "
              >
                Registered On
              </p>

              <p
                className="
                  text-sm
                  font-semibold
                  text-slate-800
                  mt-1
                "
              >
                {formatDate(
                  selectedPatient.createdAt
                )}
              </p>

            </div>


            <div
              className="
                rounded-xl
                bg-slate-50
                border
                border-slate-100
                p-4
              "
            >

              <p
                className="
                  text-xs
                  font-medium
                  text-slate-400
                  uppercase
                "
              >
                Last Updated
              </p>

              <p
                className="
                  text-sm
                  font-semibold
                  text-slate-800
                  mt-1
                "
              >
                {formatDate(
                  selectedPatient.updatedAt
                )}
              </p>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          FOOTER
      ================================================= */}

      <div
        className="
          px-6
          sm:px-8
          py-4
          border-t
          border-slate-200
          flex
          justify-end
        "
      >

        <button
          type="button"
          onClick={() =>
            setSelectedPatient(null)
          }
          className="
            px-5
            py-2.5
            rounded-xl
            bg-slate-900
            text-white
            text-sm
            font-semibold
            hover:bg-slate-800
            transition
          "
        >
          Close
        </button>

      </div>

    </div>

  </div>

)}

    </div>

  );

};

export default Patients;