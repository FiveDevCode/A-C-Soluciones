import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { handleGetTechical } from "../../controllers/administrator/getTechnicalAd.controller";
import { handleChangeStateTechnical } from "../../controllers/administrator/updateStateTechnical.controller";
import { ScreenConfirmation } from "../../components/administrator/ScreenConfirmation";

const Container = styled.div`
  padding: 2rem;
  width: 900px;
  background: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
`;


const UsuarioInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Imagen = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
`;

const Nombre = styled.h3`
  margin: 0;
  color: black;
`;

const Divider = styled.hr`
  margin: 2rem 0;
`;

const Seccion = styled.div`
  margin-bottom: 2rem;
`;

const Label = styled.p`
  font-weight: bold;
  margin: 0.5rem 0 0.2rem;
  color: black;
`;

const Texto = styled.p`
  margin: 0;
  color: black;
`;

const Correo = styled.a`
  color: #1976d2;
  text-decoration: none;
`;

const Footer = styled.div`
  text-align: left;
`;

const UserProfileAd = () => {

  const { id } = useParams(); 
  const [technicalData, setTechnicalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);


  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await handleGetTechical(id);
        console.log(response)
        setTechnicalData(response.data);  
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false); 
      }
    };

    fetchClient();
  }, [id]); 

  if (loading) {
    return <p>Cargando...</p>;
  }

  if (!technicalData) {
    return <p>No se encontró el cliente.</p>;
  }

  const handleToggleState = async () => {
    const newState = technicalData.estado === "activo" ? "inactivo" : "activo";
    try {
      await handleChangeStateTechnical(id, newState);
      setTechnicalData(prev => ({ ...prev, estado: newState }));
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
    } finally {
      setShowConfirmation(false); // oculta el modal tras la acción
    }
  };

  const confirmationMessage = technicalData.estado === "activo"
    ? "¿Quieres deshabilitar este técnico?"
    : "¿Quieres habilitar este técnico?";

  return (
    <Container>
      <Header>
        <UsuarioInfo>
          <Imagen
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="usuario"
          />
          <Nombre>{technicalData.nombre} {technicalData.apellido}</Nombre>
        </UsuarioInfo>

        <Button
          variant="contained"
          onClick={() => setShowConfirmation(true)}
          color={technicalData.estado === "activo" ? "error" : "success"}
          style={{ marginTop: "70px", marginRight: "15rem", width: "15rem" }}
        >
          {technicalData.estado === "activo" ? "DESHABILITAR" : "HABILITAR"}
        </Button>
      </Header>

      <Divider />

      <Seccion>
        <Label style={{ marginBottom: "30px" }}>Informacion personal</Label>

        <Label>Nombre:</Label>
        <Texto>{technicalData.nombre} {technicalData.apellido}</Texto>

        <Label>Cedula:</Label>
        <Texto>{technicalData.numero_de_cedula}</Texto>

        <Label>Telefono:</Label>
        <Texto>{technicalData.telefono}</Texto>

        <Label>Cargo:</Label>
        <Texto>{technicalData.especialidad}</Texto>

        <Label>Correo electronico:</Label>
        <Correo href={`mailto:${technicalData.correo_electronico}`}>
          {technicalData.correo_electronico}
        </Correo>
      </Seccion>

      <Footer>
        <Button 
          variant="contained" color="primary"
          style={{width:"15rem"}}
          LinkComponent={Link}
        >
            EDITAR
        </Button>
      </Footer>

      {showConfirmation && (
        <ScreenConfirmation 
          onConfirm={handleToggleState} 
          onCancel={() => setShowConfirmation(false)} 
          message={confirmationMessage}
        />
      )}
    </Container>
  );
};

export default UserProfileAd;