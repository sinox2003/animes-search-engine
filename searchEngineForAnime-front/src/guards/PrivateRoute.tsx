import {ReactNode} from "react";
import {Navigate} from "react-router-dom";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const token = localStorage.getItem("authToken");

  // If the user is not authenticated, redirect to the login page
  return token ? <>{children}</> : <Navigate to="/" replace />;
};

export default PrivateRoute;
