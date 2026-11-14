import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getReceptionists,
  deleteReceptionist,
} from "../../services/receptionistService";


const Receptionists = () => {
  const navigate = useNavigate();

  const [receptionists, setReceptionists] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReceptionist, setSelectedReceptionist] = useState(null);

  useEffect(() => {
    fetchReceptionists();
  }, []);

  const fetchReceptionists = async () => {
    try {
      setLoading(true);

      const res = await getReceptionists();

      setReceptionists(res.receptionists || []);
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load receptionists."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReceptionist = async () => {
    try {
      await deleteReceptionist(selectedReceptionist._id);

      setReceptionists((prev) =>
        prev.filter(
          (receptionist) =>
            receptionist._id !== selectedReceptionist._id
        )
      );

      toast.success("Receptionist deleted successfully.");
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          error.response?.data?.msg ||
          error.message ||
          "Unable to delete receptionist."
      );
    } finally {
      setShowDeleteModal(false);
      setSelectedReceptionist(null);
    }
  };

  return (
    <div>

      {/* ================= HEADER ================= */}

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Receptionists
        </h2>

        <button
          onClick={() =>
            navigate("/admin/receptionists/add")
          }
          className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition"
        >
          + Add Receptionist
        </button>

      </div>

      {/* ================= LOADING ================= */}

      {loading ? (

        <div className="text-center py-10">
          Loading receptionists...
        </div>

      ) : receptionists.length === 0 ? (

        <div className="text-center py-10 text-gray-500">
          No receptionists found.
        </div>

      ) : (

        /* ================= TABLE ================= */

        <div className="doctors-table-wrapper">

          <table className="doctors-table">

            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {receptionists.map((receptionist) => (

                <tr key={receptionist._id}>

                  {/* Image */}

                  <td>

                    <img
                      src={
                        receptionist.image
                          ? `http://localhost:5000/uploads/receptionists/${receptionist.image}`
                          : "/default-user.png"
                      }
                      alt={receptionist.name}
                      className="doctors-table-image"
                    />

                  </td>

                  {/* Name */}

                  <td>
                    {receptionist.name}
                  </td>

                  {/* Email */}

                  <td>
                    {receptionist.email}
                  </td>

                  {/* Phone */}

                  <td>
                    {receptionist.phone}
                  </td>

                  {/* Status */}

                  <td>

                    <span
                      className={`doctors-table-status ${
                        receptionist.status === "Active"
                          ? "active"
                          : "inactive"
                      }`}
                    >
                      {receptionist.status}
                    </span>

                  </td>

                  {/* Actions */}

                  <td>

                    <div className="flex items-center gap-2">

                      <button
                        onClick={() =>
                          navigate(
                            `/admin/receptionists/edit/${receptionist._id}`,
                            {
                              state: {
                                receptionist,
                              },
                            }
                          )
                        }
                        className="px-3 py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                        title="Edit Receptionist"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() => {
                          setSelectedReceptionist(
                            receptionist
                          );
                          setShowDeleteModal(true);
                        }}
                        className="px-3 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                        title="Delete Receptionist"
                      >
                        🗑 Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

      {/* ================= DELETE MODAL ================= */}

      {showDeleteModal && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-[fadeIn_.25s_ease]">

            {/* Header */}

            <div className="flex items-center gap-4 p-6 border-b">

              <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-3xl">
                🗑️
              </div>

              <div>

                <h2 className="text-xl font-bold text-gray-800">
                  Delete Receptionist
                </h2>

                <p className="text-sm text-gray-500">
                  This action cannot be undone.
                </p>

              </div>

            </div>

            {/* Body */}

            <div className="px-6 py-5">

              <p className="text-gray-700 leading-7">

                Are you sure you want to permanently
                delete

                <span className="font-semibold text-red-600">
                  {" "}
                  {selectedReceptionist?.name}
                </span>
                ?

              </p>

            </div>

            {/* Footer */}

            <div className="flex justify-end gap-3 px-6 py-5 bg-gray-50">

              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedReceptionist(null);
                }}
                className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteReceptionist}
                className="px-5 py-2.5 rounded-lg bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition"
              >
                Delete Receptionist
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default Receptionists;