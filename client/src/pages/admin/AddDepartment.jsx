import { useEffect, useState } from "react";
import {
  FaHospital,
  FaAlignLeft,
  FaUserMd,
  FaBuilding,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  addDepartment,
  updateDepartment,
  getDepartmentById,
} from "../../services/departmentService";
import "../../../src/assets/css/department.css";

const AddDepartment = () => {
  const navigate = useNavigate();

  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: "",
    head: "",
    location: "",
    description: "",
    status: "Active",
  });

  useEffect(() => {
    if (isEdit) {
      loadDepartment();
    }
  }, [id]);

  const loadDepartment = async () => {
    try {
      const res = await getDepartmentById(id);

      setFormData({
        name: res.department.name || "",
        head: res.department.head || "",
        location: res.department.location || "",
        description: res.department.description || "",
        status: res.department.status || "Active",
      });
    } catch (error) {
      toast.error("Unable to load department.");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;

      if (isEdit) {
        res = await updateDepartment(id, formData);
        toast.success("Department updated successfully.");
      } else {
        res = await addDepartment(formData);
        toast.success(res.message);
      }

      navigate("/admin/departments");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          (isEdit
            ? "Unable to update department."
            : "Unable to add department.")
      );
    }
  };

  return (
    <div className="department-page">
      <div className="department-card">
        <div className="department-header">
          <h2>
            {isEdit ? "Edit Department" : "Add Department"}
          </h2>

          <p>
            {isEdit
              ? "Update department information."
              : "Create a new hospital department."}
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="department-grid">

            <div className="department-group">
              <label>Department Name</label>

              <div className="department-input">
                <FaHospital />

                <input
                  type="text"
                  name="name"
                  placeholder="Cardiology"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="department-group">
              <label>Department Head</label>

              <div className="department-input">
                <FaUserMd />

                <input
                  type="text"
                  name="head"
                  placeholder="Dr. John Smith"
                  value={formData.head}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="department-group">
              <label>Location</label>

              <div className="department-input">
                <FaBuilding />

                <input
                  type="text"
                  name="location"
                  placeholder="2nd Floor"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="department-group">
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

          </div>

          <div className="department-group full-width">

            <label>Description</label>

            <div className="department-input textarea">
              <FaAlignLeft />

              <textarea
                rows="5"
                name="description"
                placeholder="Department description..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="department-actions">

            <button
              type="submit"
              className="department-save-btn"
            >
              {isEdit ? "Update Department" : "Add Department"}
            </button>

            <button
              type="button"
              className="department-cancel-btn"
              onClick={() => navigate("/admin/departments")}
            >
              Cancel
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default AddDepartment;