import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";

import {
  addReceptionist,
  getReceptionistById,
  updateReceptionist,
} from "../../services/receptionistService";

import toast from "react-hot-toast";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaLock,
  FaImage,
} from "react-icons/fa";

import "../../../src/assets/css/doctor.css";
import "../../assets/css/receptionist.css";

const AddReceptionist = () => {
  
  const navigate = useNavigate();
  const location = useLocation();

  const { id } = useParams();

  const isEdit = !!id;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  const [preview, setPreview] = useState(null);
  const [receptionistImage, setReceptionistImage] = useState(null);
  const [imageError, setImageError] = useState("");
  const [removeImage, setRemoveImage] = useState(false);
  const receptionistFromList =
  location.state?.receptionist;

  // ==========================================
  // LOAD RECEPTIONIST FOR EDIT
  // ==========================================

useEffect(() => {
  if (isEdit && receptionistFromList) {
    const receptionist = receptionistFromList;

    reset({
      name: receptionist.name || "",
      email: receptionist.email || "",
      phone: receptionist.phone || "",
      gender: receptionist.gender || "Male",

      dateOfBirth: receptionist.dateOfBirth
        ? receptionist.dateOfBirth.split("T")[0]
        : "",

      bloodGroup: receptionist.bloodGroup || "",

      address: receptionist.address || "",

      joiningDate: receptionist.joiningDate
        ? receptionist.joiningDate.split("T")[0]
        : "",

      weeklyHolidays:
        receptionist.weeklyHolidays || [],

      status: receptionist.status || "Active",
    });

    if (receptionist.image) {
      setPreview(
        `http://localhost:5000/uploads/receptionists/${receptionist.image}`
      );
    }
  }
}, [isEdit, receptionistFromList, reset]);

  const loadReceptionist = async () => {
    try {
      const res = await getReceptionistById(id);

      const receptionist = res.receptionist;

      reset({
        name: receptionist.name || "",
        email: receptionist.email || "",
        phone: receptionist.phone || "",
        gender: receptionist.gender || "Male",

        dateOfBirth: receptionist.dateOfBirth
          ? receptionist.dateOfBirth.split("T")[0]
          : "",

        bloodGroup: receptionist.bloodGroup || "",

        address: receptionist.address || "",

        joiningDate: receptionist.joiningDate
          ? receptionist.joiningDate.split("T")[0]
          : "",

        weeklyHolidays:
          receptionist.weeklyHolidays || [],

        status: receptionist.status || "Active",
      });

      // Existing image
      if (receptionist.image) {
        setPreview(
          `http://localhost:5000/uploads/receptionists/${receptionist.image}`
        );

        setRemoveImage(false);
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load receptionist."
      );
    }
  };

  // ==========================================
  // SUBMIT
  // ==========================================

const onSubmit = async (data) => {
  // Image required only while adding
  if (!receptionistImage && !isEdit) {
    setImageError(
      "Receptionist image is required"
    );

    return;
  }

  try {
    const formData = new FormData();

    formData.append(
      "name",
      data.name
    );

    formData.append(
      "email",
      data.email
    );

    formData.append(
      "phone",
      data.phone
    );

    formData.append(
      "gender",
      data.gender
    );

    formData.append(
      "dateOfBirth",
      data.dateOfBirth || ""
    );

    formData.append(
      "bloodGroup",
      data.bloodGroup || ""
    );

    formData.append(
      "address",
      data.address
    );

    formData.append(
      "joiningDate",
      data.joiningDate
    );

    formData.append(
      "weeklyHolidays",
      JSON.stringify(
        data.weeklyHolidays || []
      )
    );

    formData.append(
      "status",
      data.status
    );

    formData.append(
      "removeImage",
      removeImage
    );

    // Password only when adding
    if (!isEdit) {
      formData.append(
        "password",
        data.password
      );
    }

    // New image
    if (receptionistImage) {
      formData.append(
        "image",
        receptionistImage
      );
    }

    let res;

    // ===============================
    // EDIT
    // ===============================

    if (isEdit) {
      res = await updateReceptionist(
        id,
        formData
      );

      toast.success(
        res.message ||
          "Receptionist updated successfully."
      );
    }

    // ===============================
    // ADD
    // ===============================

    else {
      res = await addReceptionist(
        formData
      );

      toast.success(
        res.message ||
          "Receptionist added successfully."
      );
    }

    reset();

    setPreview(null);
    setReceptionistImage(null);
    setImageError("");
    setRemoveImage(false);

    navigate(
      "/admin/receptionists"
    );

  } catch (error) {
    console.log(
      "Save Receptionist Error:",
      error
    );

    toast.error(
      error.response?.data?.message ||
        "Unable to save receptionist."
    );
  }
};

  // ==========================================
  // IMAGE REMOVE
  // ==========================================

  const removePreviewImage = () => {
    setPreview(null);
    setReceptionistImage(null);

    setRemoveImage(true);

    if (!isEdit) {
      setImageError(
        "Receptionist image is required"
      );
    }
  };

  // ==========================================
  // IMAGE PREVIEW
  // ==========================================

  const previewImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setImageError(
        "Only JPG, PNG and WEBP images are allowed."
      );

      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setImageError(
        "Image size must be less than 2MB."
      );

      return;
    }

    setImageError("");

    setReceptionistImage(file);

    setPreview(
      URL.createObjectURL(file)
    );

    setRemoveImage(false);
  };

  return (
    <div className="doctor-page">

      <div className="doctor-card">

        {/* ================= HEADER ================= */}

        <div className="doctor-header">

          <h2>
            {isEdit
              ? "Edit Receptionist"
              : "Add New Receptionist"}
          </h2>

          <p>
            {isEdit
              ? "Update receptionist's information."
              : "Fill in the receptionist's information below."}
          </p>

        </div>

        {/* ================= FORM ================= */}

        <form
          onSubmit={handleSubmit(onSubmit)}
        >

          {/* ================= PERSONAL INFORMATION ================= */}

          <h3 className="section-title">
            Personal Information
          </h3>

          <div className="grid-2">

            {/* Full Name */}

            <div className="form-group">

              <label>Full Name</label>

              <div className="input-box">

                <FaUser />

                <input
                  placeholder="Srayashi Basu"
                  {...register("name", {
                    required:
                      "Name is required",

                    minLength: {
                      value: 3,
                      message:
                        "Minimum 3 characters",
                    },
                  })}
                />

              </div>

              <span className="error-text">
                {errors.name?.message}
              </span>

            </div>

            {/* Email */}

            <div className="form-group">

              <label>Email</label>

              <div className="input-box">

                <FaEnvelope />

                <input
                  type="email"
                  placeholder="admin@gmail.com"
                  {...register("email", {
                    required:
                      "Email is required",

                    pattern: {
                      value:
                        /^\S+@\S+$/i,

                      message:
                        "Invalid email",
                    },
                  })}
                />

              </div>

              <span className="error-text">
                {errors.email?.message}
              </span>

            </div>

            {/* Phone */}

            <div className="form-group">

              <label>Phone</label>

              <div className="input-box">

                <FaPhone />

                <input
                  type="tel"
                  placeholder="9876543210"
                  {...register("phone", {
                    required:
                      "Phone number is required",

                    pattern: {
                      value:
                        /^[0-9]{10}$/,

                      message:
                        "Enter a valid 10 digit phone number",
                    },
                  })}
                />

              </div>

              <span className="error-text">
                {errors.phone?.message}
              </span>

            </div>

            {/* Gender */}

            <div className="form-group">

              <label>Gender</label>

              <select
                {...register("gender")}
              >

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>

            {/* Date Of Birth */}

            <div className="form-group">

              <label>Date of Birth</label>

              <div className="input-box">

                <FaCalendarAlt />

                <input
                  type="date"
                  {...register(
                    "dateOfBirth"
                  )}
                />

              </div>

            </div>

            {/* Blood Group */}

            <div className="form-group">

              <label>Blood Group</label>

              <select
                {...register(
                  "bloodGroup"
                )}
              >

                <option value="">
                  Select Blood Group
                </option>

                <option value="A+">
                  A+
                </option>

                <option value="A-">
                  A-
                </option>

                <option value="B+">
                  B+
                </option>

                <option value="B-">
                  B-
                </option>

                <option value="AB+">
                  AB+
                </option>

                <option value="AB-">
                  AB-
                </option>

                <option value="O+">
                  O+
                </option>

                <option value="O-">
                  O-
                </option>

              </select>

            </div>

          </div>

          {/* Address */}

          <div className="form-group">

            <label>Address</label>

            <div className="input-box">

              <FaMapMarkerAlt />

              <input
                placeholder="Enter address"
                {...register("address", {
                  required:
                    "Address is required",
                })}
              />

            </div>

            <span className="error-text">
              {errors.address?.message}
            </span>

          </div>

          {/* ================= EMPLOYMENT INFORMATION ================= */}

          <h3 className="section-title">
            Employment Information
          </h3>

          <div className="grid-2">

            {/* Joining Date */}

            <div className="form-group">

              <label>
                Joining Date
              </label>

              <div className="input-box">

                <FaCalendarAlt />

                <input
                  type="date"
                  {...register(
                    "joiningDate",
                    {
                      required:
                        "Joining date is required",
                    }
                  )}
                />

              </div>

              <span className="error-text">
                {errors.joiningDate?.message}
              </span>

            </div>

            {/* Weekly Holidays */}

            <div className="form-group">

              <label>
                Weekly Holidays
              </label>

              <div className="holiday-checkboxes">

                <label>
                  <input
                    type="checkbox"
                    value="Monday"
                    {...register(
                      "weeklyHolidays"
                    )}
                  />
                  Monday
                </label>

                <label>
                  <input
                    type="checkbox"
                    value="Tuesday"
                    {...register(
                      "weeklyHolidays"
                    )}
                  />
                  Tuesday
                </label>

                <label>
                  <input
                    type="checkbox"
                    value="Wednesday"
                    {...register(
                      "weeklyHolidays"
                    )}
                  />
                  Wednesday
                </label>

                <label>
                  <input
                    type="checkbox"
                    value="Thursday"
                    {...register(
                      "weeklyHolidays"
                    )}
                  />
                  Thursday
                </label>

                <label>
                  <input
                    type="checkbox"
                    value="Friday"
                    {...register(
                      "weeklyHolidays"
                    )}
                  />
                  Friday
                </label>

                <label>
                  <input
                    type="checkbox"
                    value="Saturday"
                    {...register(
                      "weeklyHolidays"
                    )}
                  />
                  Saturday
                </label>

                <label>
                  <input
                    type="checkbox"
                    value="Sunday"
                    {...register(
                      "weeklyHolidays"
                    )}
                  />
                  Sunday
                </label>

              </div>

            </div>

          </div>

          {/* ================= ACCOUNT INFORMATION ================= */}

          {!isEdit && (
            <>
              <h3 className="section-title">
                Account Information
              </h3>

              <div className="grid-2">

                {/* Password */}

                <div className="form-group">

                  <label>Password</label>

                  <div className="input-box">

                    <FaLock />

                    <input
                      type="password"
                      placeholder="Enter Password"
                      {...register(
                        "password",
                        {
                          required:
                            "Password is required",

                          minLength: {
                            value: 6,
                            message:
                              "Minimum 6 characters",
                          },
                        }
                      )}
                    />

                  </div>

                  <span className="error-text">
                    {errors.password?.message}
                  </span>

                </div>

                {/* Confirm Password */}

                <div className="form-group">

                  <label>
                    Confirm Password
                  </label>

                  <div className="input-box">

                    <FaLock />

                    <input
                      type="password"
                      placeholder="Confirm Password"
                      {...register(
                        "confirmPassword",
                        {
                          required:
                            "Confirm Password is required",

                          validate: (value) =>
                            value === password ||
                            "Passwords do not match",
                        }
                      )}
                    />

                  </div>

                  <span className="error-text">
                    {
                      errors
                        .confirmPassword
                        ?.message
                    }
                  </span>

                </div>

              </div>
            </>
          )}

          {/* ================= STATUS + IMAGE ================= */}

          <div className="grid-2">

            {/* Status */}

            <div className="form-group">

              <label>Status</label>

              <select
                {...register("status")}
                defaultValue="Active"
              >

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>

            </div>

            {/* Receptionist Image */}

            <div className="form-group">

              <label>
                Receptionist Image
              </label>

              <label className="upload-box">

                <FaImage />

                {preview
                  ? "Change Image"
                  : "Upload Image"}

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={previewImage}
                />

              </label>

              {imageError && (
                <span className="error-text">
                  {imageError}
                </span>
              )}

              {preview && (
                <div className="image-preview-wrapper">

                  <img
                    src={preview}
                    alt="Receptionist Preview"
                    className="preview"
                  />

                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={
                      removePreviewImage
                    }
                  >
                    ✕
                  </button>

                </div>
              )}

            </div>

          </div>

          {/* ================= BUTTONS ================= */}

          <div className="doctor-form-actions">

            <button
              type="submit"
              className="save-btn"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEdit
                  ? "Updating..."
                  : "Saving..."
                : isEdit
                ? "Update Receptionist"
                : "Add Receptionist"}
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin/receptionists"
                )
              }
              className="cancel-btn"
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AddReceptionist;