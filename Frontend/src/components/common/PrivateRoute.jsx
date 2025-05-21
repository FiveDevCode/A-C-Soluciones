import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children, roleRequired }) => {
  const token = sessionStorage.getItem("authToken");

  if (!token) {
    return <Navigate to="/iniciar-sesion" />;
  }

  try {
    const decoded = jwtDecode(token);
    const userRole = decoded.rol;


    console.log({decoded})
    console.log("userRole: ", userRole)
    console.log("roleRequired: ", roleRequired)

    if (userRole !== roleRequired) {
      return <Navigate to="/iniciar-sesion" />;
    }

    return children;
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return <Navigate to="/iniciar-sesion" />;
  }
};

export default PrivateRoute;