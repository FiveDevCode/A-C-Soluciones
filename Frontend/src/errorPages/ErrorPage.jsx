import styled from "styled-components";
import logo from "../assets/common/logoA&C.png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/common/Logo";
import { Button } from "@mui/material";

const ContainerError = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
`;

const ErrorImage = styled.img`
  max-width: 300px;
  margin-bottom: 2rem;
`;

const ErrorTitle = styled.h1`
  font-size: 2rem;
  color: #343875;
  margin-bottom: 1rem;
`;

const ErrorMessage = styled.p`
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 2rem;
`;

const BackHome = styled(Button)`
  text-decoration: none;
  color: #343875;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid #343875;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const ErrorPage = () => {

  const navigate = useNavigate();


  const handleBackHome = () => {
    const role = localStorage.getItem('userRole');

    switch (role) {
      case "cliente":
        navigate("/cliente/inicio");
        break;
      case "tecnico":
        navigate("/tecnico/inicio");
        break;
      case "administrador":
        navigate("/admin/inicio");
        break;
      case "Contador":
        navigate("/contador/inicio");
        break;
      default:
        navigate("/");
        break;
    }
  };

  return (
    <ContainerError>
      <Logo src={logo} style={{ marginBottom: "1.5rem" }} />
      <ErrorImage src="https://i.imgur.com/qIufhof.png" alt="Página no encontrada" />
      <ErrorTitle>404 - Página no encontrada</ErrorTitle>
      <ErrorMessage>Lo sentimos, la página que estás buscando no existe.</ErrorMessage>
      <BackHome variant="outlined" onClick={handleBackHome}>
        <FontAwesomeIcon icon={faArrowLeft} />
        Volver al inicio
      </BackHome>
    </ContainerError>
  );
};

export default ErrorPage;
