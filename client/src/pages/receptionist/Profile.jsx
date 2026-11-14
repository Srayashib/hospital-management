import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaVenusMars,
  FaBirthdayCake,
  FaTint,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaCalendarCheck,
  FaClock,
  FaIdBadge,
  FaUserTie,
} from "react-icons/fa";

import { getReceptionistById } from "../../services/receptionistService";

import "../../assets/css/receptionistProfile.css";

const ReceptionistProfile = () => {

  const [receptionist, setReceptionist] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadProfile = async () => {

      try {

        const storedUser =
          JSON.parse(localStorage.getItem("user"));

        /*
         * The receptionist ID should be stored
         * inside localStorage.user after login.
         */

        const receptionistId = storedUser?.id;

        if (!receptionistId) {
          toast.error("Receptionist information not found.");
          setLoading(false);
          return;
        }

        const res =
          await getReceptionistById(receptionistId);

        setReceptionist(res.receptionist);

      } catch (error) {

        console.log(
          "Receptionist Profile Error:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Unable to load profile."
        );

      } finally {

        setLoading(false);

      }

    };

    loadProfile();

  }, []);


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="receptionist-profile-page">

        <div className="receptionist-profile-loading">

          <div className="receptionist-profile-spinner"></div>

          <p>Loading profile...</p>

        </div>

      </div>
    );
  }


  // ==========================================
  // NO DATA
  // ==========================================

  if (!receptionist) {
    return (
      <div className="receptionist-profile-page">

        <div className="receptionist-profile-empty">

          <FaUser />

          <h3>Profile Not Found</h3>

          <p>
            We could not load your receptionist
            profile information.
          </p>

        </div>

      </div>
    );
  }


  // ==========================================
  // IMAGE
  // ==========================================

  const imageUrl = receptionist.image
    ? `http://localhost:5000/uploads/receptionists/${receptionist.image}`
    : null;


  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (date) => {

    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-US",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };


  // ==========================================
  // PROFILE
  // ==========================================

  return (

    <div className="receptionist-profile-page">

      {/* ===================================== */}
      {/* PAGE HEADER */}
      {/* ===================================== */}

      <div className="receptionist-profile-topbar">

        <div>

          <div className="receptionist-profile-title-row">

            <div className="receptionist-profile-title-icon">
              <FaUserTie />
            </div>

            <div>

              <h1>My Profile</h1>

              <p>
                View your personal and employment
                information.
              </p>

            </div>

          </div>

        </div>

        <div className="receptionist-profile-status">

          <span className="receptionist-status-dot"></span>

          {receptionist.status}

        </div>

      </div>


      {/* ===================================== */}
      {/* PROFILE HERO */}
      {/* ===================================== */}

      <div className="receptionist-profile-card">

        <div className="receptionist-profile-cover">

          <div className="receptionist-profile-avatar">

            {imageUrl ? (

              <img
                src={imageUrl}
                alt={receptionist.name}
              />

            ) : (

              <FaUser />

            )}

          </div>

        </div>


        <div className="receptionist-profile-main">

          <div className="receptionist-profile-name">

            <h2>
              {receptionist.name}
            </h2>

            <span>
              <FaIdBadge />
              Receptionist
            </span>

          </div>

          <p className="receptionist-profile-email">

            <FaEnvelope />

            {receptionist.email}

          </p>

        </div>

      </div>


      {/* ===================================== */}
      {/* PERSONAL INFORMATION */}
      {/* ===================================== */}

      <div className="receptionist-profile-section">

        <div className="receptionist-profile-section-header">

          <div className="receptionist-profile-section-icon">
            <FaUser />
          </div>

          <div>

            <h3>Personal Information</h3>

            <p>
              Basic personal details
            </p>

          </div>

        </div>


        <div className="receptionist-profile-grid">

          {/* Name */}

          <div className="receptionist-profile-detail">

            <div className="receptionist-detail-icon">
              <FaUser />
            </div>

            <div>

              <span>Full Name</span>

              <strong>
                {receptionist.name || "N/A"}
              </strong>

            </div>

          </div>


          {/* Email */}

          <div className="receptionist-profile-detail">

            <div className="receptionist-detail-icon">
              <FaEnvelope />
            </div>

            <div>

              <span>Email Address</span>

              <strong>
                {receptionist.email || "N/A"}
              </strong>

            </div>

          </div>


          {/* Phone */}

          <div className="receptionist-profile-detail">

            <div className="receptionist-detail-icon">
              <FaPhone />
            </div>

            <div>

              <span>Phone Number</span>

              <strong>
                {receptionist.phone || "N/A"}
              </strong>

            </div>

          </div>


          {/* Gender */}

          <div className="receptionist-profile-detail">

            <div className="receptionist-detail-icon">
              <FaVenusMars />
            </div>

            <div>

              <span>Gender</span>

              <strong>
                {receptionist.gender || "N/A"}
              </strong>

            </div>

          </div>


          {/* Date of Birth */}

          <div className="receptionist-profile-detail">

            <div className="receptionist-detail-icon">
              <FaBirthdayCake />
            </div>

            <div>

              <span>Date of Birth</span>

              <strong>
                {formatDate(
                  receptionist.dateOfBirth
                )}
              </strong>

            </div>

          </div>


          {/* Blood Group */}

          <div className="receptionist-profile-detail">

            <div className="receptionist-detail-icon">
              <FaTint />
            </div>

            <div>

              <span>Blood Group</span>

              <strong>
                {receptionist.bloodGroup || "N/A"}
              </strong>

            </div>

          </div>


          {/* Address */}

          <div className="receptionist-profile-detail receptionist-profile-detail-full">

            <div className="receptionist-detail-icon">
              <FaMapMarkerAlt />
            </div>

            <div>

              <span>Address</span>

              <strong>
                {receptionist.address || "N/A"}
              </strong>

            </div>

          </div>

        </div>

      </div>


      {/* ===================================== */}
      {/* EMPLOYMENT INFORMATION */}
      {/* ===================================== */}

      <div className="receptionist-profile-section">

        <div className="receptionist-profile-section-header">

          <div className="receptionist-profile-section-icon">
            <FaCalendarCheck />
          </div>

          <div>

            <h3>Employment Information</h3>

            <p>
              Your hospital employment details
            </p>

          </div>

        </div>


        <div className="receptionist-profile-grid">

          {/* Joining Date */}

          <div className="receptionist-profile-detail">

            <div className="receptionist-detail-icon">
              <FaCalendarAlt />
            </div>

            <div>

              <span>Joining Date</span>

              <strong>
                {formatDate(
                  receptionist.joiningDate
                )}
              </strong>

            </div>

          </div>


          {/* Status */}

          <div className="receptionist-profile-detail">

            <div className="receptionist-detail-icon">
              <FaClock />
            </div>

            <div>

              <span>Employment Status</span>

              <strong
                className={
                  receptionist.status === "Active"
                    ? "receptionist-active-text"
                    : "receptionist-inactive-text"
                }
              >
                {receptionist.status || "N/A"}
              </strong>

            </div>

          </div>


          {/* Role */}

          <div className="receptionist-profile-detail">

            <div className="receptionist-detail-icon">
              <FaUserTie />
            </div>

            <div>

              <span>Role</span>

              <strong>
                Receptionist
              </strong>

            </div>

          </div>


          {/* Weekly Holidays */}

          <div className="receptionist-profile-detail">

            <div className="receptionist-detail-icon">
              <FaCalendarCheck />
            </div>

            <div>

              <span>Weekly Holidays</span>

              <strong>

                {receptionist.weeklyHolidays?.length
                  ? receptionist.weeklyHolidays.join(
                      ", "
                    )
                  : "No holidays selected"}

              </strong>

            </div>

          </div>

        </div>

      </div>


      {/* ===================================== */}
      {/* ACCOUNT SUMMARY */}
      {/* ===================================== */}

      <div className="receptionist-profile-summary">

        <div className="receptionist-summary-item">

          <span>Account Created</span>

          <strong>
            {formatDate(
              receptionist.createdAt
            )}
          </strong>

        </div>

        <div className="receptionist-summary-divider"></div>

        <div className="receptionist-summary-item">

          <span>Last Updated</span>

          <strong>
            {formatDate(
              receptionist.updatedAt
            )}
          </strong>

        </div>

        <div className="receptionist-summary-divider"></div>

        <div className="receptionist-summary-item">

          <span>Account Status</span>

          <strong className="receptionist-active-text">
            {receptionist.status}
          </strong>

        </div>

      </div>

    </div>

  );
};

export default ReceptionistProfile;