import { useState } from "react";

import {
  FaTimes,
  FaCalendarAlt,
  FaClipboardList,
  FaRegCommentDots,
} from "react-icons/fa";

import { applyLeave } from "../../services/leaveService";


const LeaveRequestForm = ({ onClose, onSuccess }) => {

  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [loading, setLoading] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("success");
  const [popupMessage, setPopupMessage] = useState("");


  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };


  // ==========================================
  // SUBMIT
  // ==========================================


const handleSubmit = async (e) => {

  e.preventDefault();

  if (loading) {
    return;
  }

  try {

    setLoading(true);

    console.log(
      "LEAVE DATA BEING SENT:",
      formData
    );


    // ======================================
    // CALL BACKEND
    // ======================================

    const response = await applyLeave(formData);


    console.log(
      "BACKEND RESPONSE:",
      response
    );


    // ======================================
    // ONLY SUCCESS IF BACKEND SUCCESS
    // ======================================

    if (response.success) {

      setPopupType("success");

      setPopupMessage(
        "Leave request submitted successfully!"
      );

      setShowPopup(true);


      // Refresh leave list
      if (onSuccess) {
        onSuccess();
      }


    } else {

      setPopupType("error");

      setPopupMessage(
        response.message ||
        "Failed to submit leave request."
      );

      setShowPopup(true);

    }

  } catch (error) {

    console.error(
      "LEAVE SUBMIT ERROR:",
      error
    );

    console.error(
      "SERVER RESPONSE:",
      error.response?.data
    );


    setPopupType("error");

    setPopupMessage(
      error.response?.data?.message ||
      "Failed to submit leave request."
    );

    setShowPopup(true);

  } finally {

    setLoading(false);

  }

};


  return (
    <>

    <div className="doctor-leave-modal-overlay">

      <div className="doctor-leave-modal">


        {/* =================================
            MODAL HEADER
        ================================= */}

        <div className="doctor-leave-modal-header">

          <div>

            <h3>
              Request Leave
            </h3>

            <p>
              Submit a new leave application.
            </p>

          </div>


          <button
            type="button"
            className="doctor-leave-close-btn"
            onClick={onClose}
            disabled={loading}
          >
            <FaTimes />
          </button>

        </div>


        {/* =================================
            FORM
        ================================= */}

        <form
          className="doctor-leave-form"
          onSubmit={handleSubmit}
        >


          {/* =================================
              LEAVE TYPE
          ================================= */}

          <div className="doctor-leave-form-group">

            <label>
              Leave Type
            </label>


            <div className="doctor-leave-input-wrapper">

              <FaClipboardList />


              <select
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                required
                disabled={loading}
              >

                <option value="">
                  Select leave type
                </option>

                <option value="Personal">
                  Personal Leave
                </option>

                <option value="Medical">
                  Medical Leave
                </option>

                <option value="Emergency">
                  Emergency Leave
                </option>

                <option value="Vacation">
                  Vacation
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>

          </div>


          {/* =================================
              DATES
          ================================= */}

          <div className="doctor-leave-date-row">


            {/* START DATE */}

            <div className="doctor-leave-form-group">

              <label>
                Start Date
              </label>


              <div className="doctor-leave-input-wrapper">

                <FaCalendarAlt />


                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />

              </div>

            </div>


            {/* END DATE */}

            <div className="doctor-leave-form-group">

              <label>
                End Date
              </label>


              <div className="doctor-leave-input-wrapper">

                <FaCalendarAlt />


                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate}
                  required
                  disabled={loading}
                />

              </div>

            </div>

          </div>


          {/* =================================
              REASON
          ================================= */}

          <div className="doctor-leave-form-group">

            <label>
              Reason
            </label>


            <div className="doctor-leave-textarea-wrapper">

              <FaRegCommentDots />


              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Enter the reason for your leave..."
                rows="5"
                required
                disabled={loading}
              />

            </div>

          </div>


          {/* =================================
              ACTIONS
          ================================= */}

          <div className="doctor-leave-form-actions">


            <button
              type="button"
              className="doctor-leave-cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>


            <button
              type="submit"
              className="doctor-leave-submit-btn"
              disabled={loading}
            >

              {loading
                ? "Submitting..."
                : "Submit Request"}

            </button>

          </div>

        </form>

      </div>

    </div>
{/* =================================
    SUCCESS / ERROR POPUP
================================= */}

{showPopup && (

  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">

    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">

      {/* ICON */}

      <div className="flex justify-center mb-4">

        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
            popupType === "success"
              ? "bg-green-50 text-green-500"
              : "bg-red-50 text-red-500"
          }`}
        >

          {popupType === "success"
            ? "✓"
            : "!"
          }

        </div>

      </div>


      {/* TITLE */}

      <h3 className="text-xl font-bold text-slate-800 text-center">

        {popupType === "success"
          ? "Leave Request Submitted"
          : "Submission Failed"
        }

      </h3>


      {/* MESSAGE */}

      <p className="text-sm text-slate-500 text-center mt-2">

        {popupMessage}

      </p>


      {/* BUTTON */}

      <button
        type="button"
        onClick={() => {

          setShowPopup(false);

          if (popupType === "success") {
            onClose();
          }

        }}
        className={`w-full mt-6 px-4 py-3 rounded-xl text-white font-semibold transition ${
          popupType === "success"
            ? "bg-green-500 hover:bg-green-600"
            : "bg-red-500 hover:bg-red-600"
        }`}
      >

        OK

      </button>

    </div>

  </div>

)}
    </>

  );

};


export default LeaveRequestForm;