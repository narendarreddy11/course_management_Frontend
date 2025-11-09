import { Navigate } from "react-router-dom";

function PrivateRoute({ children, allowedRoles = [] }) {
  const token = sessionStorage.getItem("token");
  const userRole = sessionStorage.getItem("role"); 

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;
