import { useEffect, useState } from "react";
import { FaUserMd, FaEnvelope, FaPhone, FaBuilding, FaGraduationCap, FaBriefcase, FaMoneyBillWave, FaIdCard, FaMapMarkerAlt, FaCalendarAlt, FaVenusMars, FaTint, FaCalendarCheck } from "react-icons/fa";

import { getMyProfile } from "../../services/doctorService";

const ProfileForm = () => {

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {

    try {

      const res = await getMyProfile();

      setDoctor(res.doctor);

    } catch (error) {

      console.log(
        "Doctor Profile Error:",
        error
      );

    } finally {

      setLoading(false);

    }

  };

  if (loading) {
    return (
      <div className="doctor-profile-loading">
        Loading profile...
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="doctor-profile-error">
        Unable to load doctor profile.
      </div>
    );
  }

  return (

    <div className="doctor-profile-wrapper">

      {/* ================================= */}
      {/* PROFILE TOP */}
      {/* ================================= */}

      <div className="doctor-profile-card doctor-profile-main-card">

        <div className="doctor-profile-main">

          <div className="doctor-profile-image-wrapper">

            {doctor.image ? (

              <img
                src={`http://localhost:5000/uploads/doctors/${doctor.image}`}
                alt={doctor.name}
                className="doctor-profile-image"
              />

            ) : (

              <div className="doctor-profile-image-placeholder">
                <FaUserMd />
              </div>

            )}

          </div>

          <div className="doctor-profile-basic">

            <h2>{doctor.name}</h2>

            <p className="doctor-profile-department">
              {doctor.department}
            </p>

            <div className="doctor-profile-status">

              <span className="doctor-status-dot"></span>

              {doctor.status}

            </div>

          </div>

        </div>

      </div>


      {/* ================================= */}
      {/* PERSONAL INFORMATION */}
      {/* ================================= */}

      <div className="doctor-profile-card">

        <div className="doctor-profile-section-header">

          <div className="doctor-profile-section-icon">
            <FaUserMd />
          </div>

          <div>
            <h3>Personal Information</h3>
            <p>Basic personal details</p>
          </div>

        </div>


        <div className="doctor-profile-grid">

          <div className="doctor-profile-field">

            <span>
              <FaUserMd />
              Full Name
            </span>

            <strong>
              {doctor.name || "N/A"}
            </strong>

          </div>


          <div className="doctor-profile-field">

            <span>
              <FaEnvelope />
              Email
            </span>

            <strong>
              {doctor.email || "N/A"}
            </strong>

          </div>


          <div className="doctor-profile-field">

            <span>
              <FaPhone />
              Phone
            </span>

            <strong>
              {doctor.phone || "N/A"}
            </strong>

          </div>


          <div className="doctor-profile-field">

            <span>
              <FaVenusMars />
              Gender
            </span>

            <strong>
              {doctor.gender || "N/A"}
            </strong>

          </div>


          <div className="doctor-profile-field">

            <span>
              <FaCalendarAlt />
              Date of Birth
            </span>

            <strong>
              {doctor.dob
                ? new Date(
                    doctor.dob
                  ).toLocaleDateString()
                : "N/A"}
            </strong>

          </div>


          <div className="doctor-profile-field">

            <span>
              <FaTint />
              Blood Group
            </span>

            <strong>
              {doctor.bloodGroup || "N/A"}
            </strong>

          </div>


          <div className="doctor-profile-field doctor-profile-full">

            <span>
              <FaMapMarkerAlt />
              Address
            </span>

            <strong>
              {doctor.address || "N/A"}
            </strong>

          </div>

        </div>

      </div>


      {/* ================================= */}
      {/* PROFESSIONAL INFORMATION */}
      {/* ================================= */}

      <div className="doctor-profile-card">

        <div className="doctor-profile-section-header">

          <div className="doctor-profile-section-icon">
            <FaBriefcase />
          </div>

          <div>
            <h3>Professional Information</h3>
            <p>Professional and employment details</p>
          </div>

        </div>


        <div className="doctor-profile-grid">

          <div className="doctor-profile-field">

            <span>
              <FaBuilding />
              Department
            </span>

            <strong>
              {doctor.department || "N/A"}
            </strong>

          </div>


          <div className="doctor-profile-field">

            <span>
              <FaGraduationCap />
              Qualification
            </span>

            <strong>
              {doctor.qualification || "N/A"}
            </strong>

          </div>


          <div className="doctor-profile-field">

            <span>
              <FaBriefcase />
              Experience
            </span>

            <strong>
              {doctor.experience
                ? `${doctor.experience} Years`
                : "N/A"}
            </strong>

          </div>


          <div className="doctor-profile-field">

            <span>
              <FaMoneyBillWave />
              Consultation Fee
            </span>

            <strong>
              {doctor.fee
                ? `₹${doctor.fee}`
                : "N/A"}
            </strong>

          </div>


          <div className="doctor-profile-field">

            <span>
              <FaIdCard />
              Medical License
            </span>

            <strong>
              {doctor.license || "N/A"}
            </strong>

          </div>


          <div className="doctor-profile-field">

            <span>
              <FaCalendarCheck />
              Joining Date
            </span>

            <strong>
              {doctor.joiningDate
                ? new Date(
                    doctor.joiningDate
                  ).toLocaleDateString()
                : "N/A"}
            </strong>

          </div>

        </div>

      </div>


      {/* ================================= */}
      {/* WEEKLY HOLIDAYS */}
      {/* ================================= */}

      <div className="doctor-profile-card">

        <div className="doctor-profile-section-header">

          <div className="doctor-profile-section-icon">
            <FaCalendarCheck />
          </div>

          <div>
            <h3>Weekly Holidays</h3>
            <p>Your regular weekly days off</p>
          </div>

        </div>


        <div className="doctor-holiday-list">

          {doctor.weeklyHolidays &&
          doctor.weeklyHolidays.length > 0 ? (

            doctor.weeklyHolidays.map(
              (day) => (
                <span
                  key={day}
                  className="doctor-holiday-badge"
                >
                  {day}
                </span>
              )
            )

          ) : (

            <span className="doctor-no-holiday">
              No weekly holidays configured
            </span>

          )}

        </div>

      </div>


      {/* ================================= */}
      {/* ACCOUNT STATUS */}
      {/* ================================= */}

      <div className="doctor-profile-card doctor-account-card">

        <div>

          <h3>Account Status</h3>

          <p>
            Your account is currently{" "}
            <strong>
              {doctor.status}
            </strong>.
          </p>

        </div>

        <span className="doctor-account-status">
          <span></span>
          {doctor.status}
        </span>

      </div>

    </div>
  );
};

export default ProfileForm;