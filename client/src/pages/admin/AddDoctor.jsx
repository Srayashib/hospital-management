import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaUserMd,
  FaEnvelope,
  FaPhone,
  FaGraduationCap,
  FaHospital,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaIdCard,
  FaLock,
  FaImage,
} from "react-icons/fa";
import {
  addDoctor,
  getDoctorById,
  updateDoctor,
} from "../../services/doctorService";
import toast from "react-hot-toast";
import "../../../src/assets/css/doctor.css";

const AddDoctor = () => {
  const navigate = useNavigate();

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
  const [doctorImage, setDoctorImage] = useState(null);
  const [imageError, setImageError] = useState("");
  useEffect(() => {
    if (isEdit) {
      loadDoctor();
    }
  }, [id]);
  const [removeImage, setRemoveImage] = useState(false);

  const loadDoctor = async () => {
  try {
    const res = await getDoctorById(id);

    const doctor = res.doctor;

    reset({
      name: doctor.name,
      email: doctor.email,
      phone: doctor.phone,
      gender: doctor.gender,
      dob: doctor.dob
        ? doctor.dob.split("T")[0]
        : "",
      bloodGroup: doctor.bloodGroup,
      address: doctor.address,
      department: doctor.department,
      qualification: doctor.qualification,
      experience: doctor.experience,
      fee: doctor.fee,
      license: doctor.license,
      joiningDate: doctor.joiningDate
        ? doctor.joiningDate.split("T")[0]
        : "",
      weeklyHolidays: doctor.weeklyHolidays || [],
      status: doctor.status,
    });

    if (doctor.image) {
      setPreview(
        `http://localhost:5000/uploads/doctors/${doctor.image}`
      );
      setRemoveImage(false);
    }

  } catch (error) {
    toast.error("Unable to load doctor.");
  }
};

  const onSubmit = async (data) => {
  if (!doctorImage && (!isEdit || removeImage)) {
    setImageError("Doctor image is required");
    return;
  }

  try {
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("gender", data.gender);
    formData.append("dob", data.dob);
    formData.append("bloodGroup", data.bloodGroup);
    formData.append("address", data.address);

    formData.append("department", data.department);
    formData.append("qualification", data.qualification);
    formData.append("experience", data.experience);
    formData.append("fee", data.fee);
    formData.append("license", data.license);
    formData.append("joiningDate", data.joiningDate);
    formData.append(
      "weeklyHolidays",
      JSON.stringify(data.weeklyHolidays || [])
    );

    // formData.append("password", data.password);
    if (!isEdit) {
      formData.append("password", data.password);
    }
    formData.append("status", data.status);
    formData.append("removeImage", removeImage);

    if (doctorImage) {
      formData.append("image", doctorImage);
    }

    let res;

    if (isEdit) {
      res = await updateDoctor(id, formData);
      toast.success("Doctor updated successfully.");
    } else {
      res = await addDoctor(formData);
      toast.success("Doctor added successfully.");
    }

    reset();

    navigate("/admin/doctors");

    setPreview(null);
    setDoctorImage(null);
    setImageError("");

  } catch (error) {
    toast.error(
      error.response?.data?.message || "Unable to add doctor."
    );
  }
};

  const removePreviewImage = () => {
    setPreview(null);
    setDoctorImage(null);
    setRemoveImage(true);
    setImageError("Doctor image is required");
  };
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
    setImageError("Only JPG, PNG and WEBP images are allowed.");
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    setImageError("Image size must be less than 2MB.");
    return;
  }

  setImageError("");

  setDoctorImage(file);
  setPreview(URL.createObjectURL(file));
};

  return (
    <div className="doctor-page">

      <div className="doctor-card">

        <div className="doctor-header">

          <h2>
            {isEdit ? "Edit Doctor" : "Add New Doctor"}
          </h2>

          <p>
            {isEdit
              ? "Update doctor's information."
              : "Fill in the doctor's information below."}
          </p>

        </div>

        <form onSubmit={handleSubmit(onSubmit)}>

          <h3 className="section-title">
            Personal Information
          </h3>

          <div className="grid-2">

            <div className="form-group">
              <label>Full Name</label>

              <div className="input-box">
                <FaUserMd />
                <input
                    placeholder="Dr. John Smith"
                    {...register("name", {
                        required: "Doctor name is required",
                        minLength: {
                        value: 3,
                        message: "Minimum 3 characters",
                        },
                    })}
                    />

                    
              </div>
              <span className="error-text">
                    {errors.name?.message}
                    </span>

              

            </div>

            <div className="form-group">
              <label>Email</label>

              <div className="input-box">
                <FaEnvelope />
                <input
                    type="email"
                    placeholder="doctor@email.com"
                    {...register("email", {
                        required: "Email is required",
                        pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email",
                        },
                    })}
                    />

                   
              </div>

               <span className="error-text">
                    {errors.email?.message}
                    </span>

            </div>

            <div className="form-group">
              <label>Phone</label>

              <div className="input-box">
                <FaPhone />
               <input
                    placeholder="9876543210"
                    {...register("phone", {
                        required: "Phone number is required",
                        pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Enter a valid 10 digit phone number",
                        },
                    })}
                    />

                    
              </div>

              <span className="error-text">
                    {errors.phone?.message}
                    </span>

            </div>

            <div className="form-group">
              <label>Gender</label>

              <select {...register("gender")}>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>

            </div>

            <div className="form-group">
              <label>Date of Birth</label>

              <div className="input-box">
                <FaCalendarAlt />
                <input
                  type="date"
                  {...register("dob")}
                />
              </div>

            </div>

            <div className="form-group">
              <label>Blood Group</label>

              <select {...register("bloodGroup")}>
                <option>A+</option>
                <option>B+</option>
                <option>AB+</option>
                <option>O+</option>
                <option>O-</option>
              </select>

            </div>

          </div>

          <div className="form-group">
            <label>Address</label>

            <div className="input-box">
              <FaMapMarkerAlt />
              <input {...register("address")} />
            </div>

          </div>

          <h3 className="section-title">
            Professional Information
          </h3>

          <div className="grid-2">

            <div className="form-group">
              <label>Department</label>

              <div className="input-box">
                <FaHospital />
                <input
                    placeholder="Cardiology"
                    {...register("department", {
                        required: "Department is required",
                    })}
                    />

                    
              </div>
              <span className="error-text">
                    {errors.department?.message}
                    </span>

            </div>

            <div className="form-group">
              <label>Qualification</label>

              <div className="input-box">
                <FaGraduationCap />
                <input
                    placeholder="MBBS, MD"
                    {...register("qualification", {
                        required: "Qualification is required",
                    })}
                    />

                   
              </div>
               <span className="error-text">
                    {errors.qualification?.message}
                    </span>

            </div>

            <div className="form-group">
              <label>Experience</label>

              <input
                type="number"
                placeholder="5"
                {...register("experience", {
                    required: "Experience is required",
                    min: {
                    value: 0,
                    message: "Cannot be negative",
                    },
                })}
                />

                
            </div>
            <span className="error-text">
                {errors.experience?.message}
                </span>

            <div className="form-group">
              <label>Consultation Fee</label>

              <div className="input-box">
                <FaMoneyBillWave />
                <input
                    type="number"
                    placeholder="500"
                    {...register("fee", {
                        required: "Consultation fee is required",
                        min: {
                        value: 1,
                        message: "Fee must be greater than 0",
                        },
                    })}
                    />

                    
              </div>
              <span className="error-text">
                    {errors.fee?.message}
                    </span>

            </div>

            <div className="form-group">
              <label>License Number</label>

              <div className="input-box">
                <FaIdCard />
                <input
                placeholder="LIC-123456"
                {...register("license", {
                    required: "License Number is required",
                })}
                />

                
              </div>
              <span className="error-text">
                {errors.license?.message}
                </span>

            </div>

            <div className="form-group">
              <label>Joining Date</label>

              <div className="input-box">
                <FaCalendarAlt />
                <input
                  type="date"
                  {...register("joiningDate")}
                />
              </div>

            </div>
            <div className="form-group">

              <label>Weekly Holidays</label>

              <div className="holiday-checkboxes">

              <label>
              <input
              type="checkbox"
              value="Monday"
              {...register("weeklyHolidays")}
              />
              Monday
              </label>

              <label>
              <input
              type="checkbox"
              value="Tuesday"
              {...register("weeklyHolidays")}
              />
              Tuesday
              </label>

              <label>
              <input
              type="checkbox"
              value="Wednesday"
              {...register("weeklyHolidays")}
              />
              Wednesday
              </label>

              <label>
              <input
              type="checkbox"
              value="Thursday"
              {...register("weeklyHolidays")}
              />
              Thursday
              </label>

              <label>
              <input
              type="checkbox"
              value="Friday"
              {...register("weeklyHolidays")}
              />
              Friday
              </label>

              <label>
              <input
              type="checkbox"
              value="Saturday"
              {...register("weeklyHolidays")}
              />
              Saturday
              </label>

              <label>
              <input
              type="checkbox"
              value="Sunday"
              {...register("weeklyHolidays")}
              />
              Sunday
              </label>

              </div>

              </div>

          </div>

          <h3 className="section-title">
            Account Information
          </h3>

          {!isEdit && (
              <>
                <h3 className="section-title">
                  Account Information
                </h3>

                <div className="grid-2">

                  <div className="form-group">
                    <label>Password</label>

                    <div className="input-box">
                      <FaLock />

                      <input
                        type="password"
                        placeholder="Enter Password"
                        {...register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Minimum 6 characters",
                          },
                        })}
                      />
                    </div>

                    <span className="error-text">
                      {errors.password?.message}
                    </span>
                  </div>

                  <div className="form-group">
                    <label>Confirm Password</label>

                    <div className="input-box">
                      <FaLock />

                      <input
                        type="password"
                        placeholder="Confirm Password"
                        {...register("confirmPassword", {
                          required: "Confirm Password is required",
                          validate: (value) =>
                            value === password || "Passwords do not match",
                        })}
                      />
                    </div>

                    <span className="error-text">
                      {errors.confirmPassword?.message}
                    </span>
                  </div>

                </div>
              </>
            )}

          <div className="grid-2">

            <div className="form-group">

              <label>Status</label>

              <select {...register("status")}>
                <option>Active</option>
                <option>Inactive</option>
              </select>

            </div>

            <div className="form-group">

              <label>Doctor Image</label>

              <label className="upload-box">

                <FaImage />

                {preview ? "Change Image" : "Upload Image"}

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
                    alt="Doctor Preview"
                    className="preview"
                  />

                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={removePreviewImage}
                  >
                    ✕
                  </button>

                </div>
              )}
           

            </div>

          </div>

          <div className="doctor-form-actions">

          <button
            type="submit"
            className="save-btn"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? (isEdit ? "Updating..." : "Saving...")
              : (isEdit ? "Update Doctor" : "Add Doctor")}
          </button>

          {isEdit && (
            <button
              type="button"
              onClick={() => navigate("/admin/doctors")}
              className="cancel-btn"
            >
              Cancel
            </button>
          )}

        </div>


        </form>

      </div>

    </div>
  );
};

export default AddDoctor;