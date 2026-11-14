import { useForm } from "react-hook-form";
import { loginUser } from "../../services/authService";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "../../assets/css/auth.css";

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await loginUser(data);

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      toast.success(res.message);

      reset();

      const role = res.user.role;

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "doctor") {
        navigate("/doctor/dashboard");
      } else if (role === "receptionist") {
        navigate("/receptionist/dashboard");
      } else {
        navigate("/patient/dashboard");
      }
    }catch (error) {
      console.log(error.response?.data);

      toast.error(
        error.response?.data?.message || "Login Failed"
      );
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h2 className="auth-title">
          Welcome Back
        </h2>

        <p className="auth-subtitle">
          Login to your Hospital Management account.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="auth-group">
            <label className="auth-label">
              Email Address
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
              Password
            </label>

            <div className="auth-input-wrapper">
              <FaLock className="auth-icon" />

              <input
                type="password"
                placeholder="Enter your password"
                className="auth-input"
                {...register("password", {
                  required: "Password is required",
                })}
              />
            </div>

            <p className="auth-error">
              {errors.password?.message}
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="auth-btn"
          >
            {isSubmitting ? "Logging In..." : "Login"}
          </button>

        </form>

        <p className="auth-footer">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="auth-link"
          >
            Register
          </Link>
        </p>

      </div>

    </div>
  );
};

export default Login;