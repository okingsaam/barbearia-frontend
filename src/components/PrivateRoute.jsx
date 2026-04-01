import { Navigate } from "react-router-dom";
import { getAuthToken } from "../services/authService";

function PrivateRoute({ children }) {
  if (!getAuthToken()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;