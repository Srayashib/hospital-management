import { useForm } from "react-hook-form";
import "../../assets/css/auth.css";
import { registerUser } from "../../services/authService";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaPhone, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";

const Register = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();
  const password = watch("password");

  const onSubmit = async (data) => {
  try {
    const { confirmPassword, ...userData } = data;

    const res = await registerUser(userData);

    toast.success(res.message);

    reset();
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Registration Failed"
    );
  }
};

  return (
  <div className="auth-page">
    <div className="auth-card">

      <h2 className="auth-title">
        Create Account
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="auth-group">
          <label className="auth-label">
            Full Name
          </label>

          <div className="auth-input-wrapper">
            <FaUser className="auth-icon" />

            <input
              type="text"
              placeholder="Enter your full name"
              className="auth-input"
              {...register("name", {
                required: "Name is required",
              })}
            />
          </div>

          <p className="auth-error">
            {errors.name?.message}
          </p>
        </div>

        <div className="auth-group">
          <label className="auth-label">
            Email
          </label>

          <div className="auth-input-wrapper">
            <FaEnvelope className="auth-icon" />

            <input
              type="email"
              placeholder="Enter your email"
              className="auth-input"
              {...register("email", {
                required: "Email is required",
              })}
            />
          </div>

          <p className="auth-error">
            {errors.email?.message}
          </p>
        </div>

        <div className="auth-group">
          <label className="auth-label">
            Phone
          </label>

          <div className="auth-input-wrapper">
            <FaPhone className="auth-icon" />

            <input
              type="text"
              placeholder="Enter your phone"
              className="auth-input"
              {...register("phone", {
                required: "Phone is required",
              })}
            />
          </div>

          <p className="auth-error">
            {errors.phone?.message}
          </p>
        </div>

        <div className="auth-group">
          <label className="auth-label">
            Password
          </label>

          <div className="auth-input-wrapper">
            <FaLock className="auth-icon" />

            <input
              type="password"
              placeholder="Enter password"
              className="auth-input"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters",
                },
              })}
            />
          </div>

          <p className="auth-error">
            {errors.password?.message}
          </p>
        </div>

        <div className="auth-group">
          <label className="auth-label">
            Confirm Password
          </label>

          <div className="auth-input-wrapper">
            <FaLock className="auth-icon" />

            <input
              type="password"
              placeholder="Confirm password"
              className="auth-input"
              {...register("confirmPassword", {
                required: "Confirm Password is required",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
          </div>

          <p className="auth-error">
            {errors.confirmPassword?.message}
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="auth-btn"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>

      </form>

      <p className="auth-footer">
        Already have an account?{" "}
        <Link
          to="/login"
          className="auth-link"
        >
          Login
        </Link>
      </p>

    </div>
  </div>
);
};

export default Register;