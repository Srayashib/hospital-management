import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { getDepartments ,deleteDepartment,toggleDepartmentStatus,} from "../../services/departmentService";

const Departments = () => {
  const navigate = useNavigate();

  

  const [dbDepartments, setDbDepartments] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const res = await getDepartments();
      setDbDepartments(res.departments || []);
    } catch (error) {
      console.log(error);
    }
  };

  
  const handleDeleteDepartment = async () => {
  try {
    await deleteDepartment(selectedDepartment._id);

    setDbDepartments((prev) =>
      prev.filter(
        (department) =>
          department._id !== selectedDepartment._id
      )
    );

    toast.success("Department deleted successfully.");

  } catch (error) {

    toast.error(
      error.response?.data?.message ||
      "Unable to delete department."
    );

  } finally {

    setShowDeleteModal(false);
    setSelectedDepartment(null);

  }
};
const handleToggleStatus = async (department) => {
  try {
    const res = await toggleDepartmentStatus(department._id);

    setDbDepartments((prev) =>
      prev.map((item) =>
        item._id === department._id
          ? res.department
          : item
      )
    );

    toast.success("Department status updated.");
  } catch (error) {
    toast.error("Unable to update status.");
  }
};

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Departments
        </h2>

        <button
          onClick={() => navigate("/admin/departments/add")}
          className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition"
        >
          + Add Department
        </button>

      </div>

      <div className="grid md:grid-cols-3 gap-5">

          {dbDepartments.length === 0 ? (

            <div className="col-span-3 text-center py-10 text-gray-500">
              No departments found.
            </div>

          ) : (

            dbDepartments.map((department) => (

              <div
                key={department._id}
                className="border rounded-xl p-6 hover:shadow-md transition"
              >

                <div className="flex justify-between items-center">

                  <h3 className="font-semibold text-lg">
                    {department.name}
                  </h3>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleStatus(department)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                        department.status === "Active"
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          department.status === "Active"
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/admin/departments/edit/${department._id}`)
                      }
                      className="text-sky-600 hover:text-sky-800"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => {
                        setSelectedDepartment(department);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>

                  </div>

                </div>

              </div>

            ))

          )}

        </div>
      {showDeleteModal && (

<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

  <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

    <div className="flex items-center gap-4 p-6 border-b">

      <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center text-3xl">
        🗑️
      </div>

      <div>
        <h2 className="text-xl font-bold">
          Delete Department
        </h2>

        <p className="text-sm text-gray-500">
          This action cannot be undone.
        </p>

      </div>

    </div>

    <div className="px-6 py-5">

      <p className="text-gray-700 leading-7">
        Are you sure you want to permanently delete
        <span className="font-semibold text-red-600">
          {" "}
          {selectedDepartment?.name}
        </span>
        ?
      </p>

    </div>

    <div className="flex justify-end gap-3 px-6 py-5 bg-gray-50">

      <button
        onClick={() => {
          setShowDeleteModal(false);
          setSelectedDepartment(null);
        }}
        className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
      >
        Cancel
      </button>

      <button
        onClick={handleDeleteDepartment}
        className="px-5 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700"
      >
        Delete Department
      </button>

    </div>

  </div>

</div>

)}

    </div>
  );
};

export default Departments;