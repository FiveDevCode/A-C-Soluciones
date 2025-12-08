import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

const PrivateRoute = ({ children, roleRequired }) => {
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setIsValidating(false);
      setIsValid(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const userRole = decoded.rol;

      if (userRole === roleRequired) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      setIsValid(false);
    } finally {
      setIsValidating(false);
    }
  }, [roleRequired]);

  if (isValidating) {
    // Muestra nada o un loader mientras valida
    return null;
  }

  if (!isValid) {
    return <Navigate to="/iniciar-sesion" replace />;
  }

  return children;
};

export default PrivateRoute;