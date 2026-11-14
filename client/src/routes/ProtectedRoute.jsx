import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {

  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  // Not logged in
  if (!token || !userData) {
    return <Navigate to="/login" replace />;
  }

  let user;

  try {

    user = JSON.parse(userData);

  } catch (error) {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/login" replace />;

  }

  // Check role
  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {

    // Send user to their own dashboard
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user.role === "doctor") {
      return <Navigate to="/doctor/dashboard" replace />;
    }

    if (user.role === "receptionist") {
      return <Navigate to="/receptionist/dashboard" replace />;
    }

    if (user.role === "patient") {
      return <Navigate to="/patient/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;