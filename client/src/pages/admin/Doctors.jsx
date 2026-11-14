import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDoctors ,deleteDoctors} from "../../services/doctorService";
import toast from "react-hot-toast";

const Doctors = () => {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const res = await getDoctors();

      setDoctors(res.doctors);

    } catch (error) {
      console.log(error);

      toast.error("Unable to load doctors.");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteDoctor = async () => {
    try {

      await deleteDoctors(selectedDoctor._id);

      setDoctors((prev) =>
        prev.filter((doctor) => doctor._id !== selectedDoctor._id)
      );

      toast.success("Doctor deleted successfully.");

    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
        error.response?.data?.msg ||
        error.message
      );
    } finally {

      setShowDeleteModal(false);
      setSelectedDoctor(null);

    }
  };
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Doctors
        </h2>

        <button
          onClick={() => navigate("/admin/doctors/add")}
          className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition"
        >
          + Add Doctor
        </button>

      </div>

      {loading ? (

        <div className="text-center py-10">
          Loading doctors...
        </div>

      ) : doctors.length === 0 ? (

        <div className="text-center py-10 text-gray-500">
          No doctors found.
        </div>

      ) : (

      <div className="doctors-table-wrapper">
  <table className="doctors-table">

    <thead>
      <tr>
        <th>Image</th>
        <th>Name</th>
        <th>Department</th>
        <th>Phone</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    </thead>

    <tbody>
      {doctors.map((doctor) => (
        <tr key={doctor._id}>

          <td>
            <img
              src={`http://localhost:5000/uploads/doctors/${doctor.image}`}
              alt={doctor.name}
              className="doctors-table-image"
            />
          </td>

          <td>{doctor.name}</td>

          <td>{doctor.department}</td>

          <td>{doctor.phone}</td>

          <td>
            <span
              className={`doctors-table-status ${
                doctor.status === "Active"
                  ? "active"
                  : "inactive"
              }`}
            >
              {doctor.status}
            </span>
          </td>
          <td>
            <div className="flex items-center  gap-2">
              <button
               onClick={() => navigate(`/admin/doctors/edit/${doctor._id}`)}
                className="px-3 py-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                title="Edit Doctor"
              >
                ✏️ Edit
              </button>

              <button
                onClick={() => {
                  setSelectedDoctor(doctor);
                  setShowDeleteModal(true);
                }}
                className="px-3 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
              >
                🗑 Delete
              </button>
            </div>
          </td>

        </tr>
      ))}
    </tbody>

  </table>
{showDeleteModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-[fadeIn_.25s_ease]">

      {/* Header */}
      <div className="flex items-center gap-4 p-6 border-b">

        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-3xl">
          🗑️
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-800">
            Delete Doctor
          </h2>

          <p className="text-sm text-gray-500">
            This action cannot be undone.
          </p>
        </div>

      </div>

      {/* Body */}
      <div className="px-6 py-5">

        <p className="text-gray-700 leading-7">
          Are you sure you want to permanently delete
          <span className="font-semibold text-red-600">
            {" "}
            {selectedDoctor?.name}
          </span>
          ?
        </p>

      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 px-6 py-5 bg-gray-50">

        <button
          onClick={() => {
            setShowDeleteModal(false);
            setSelectedDoctor(null);
          }}
          className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-100 transition"
        >
          Cancel
        </button>

        <button
          onClick={handleDeleteDoctor}
          className="px-5 py-2.5 rounded-lg bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition"
        >
          Delete Doctor
        </button>

      </div>

    </div>

  </div>
)}
</div>

      )}

    </div>
  );
};

export default Doctors;