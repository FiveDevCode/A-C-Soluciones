import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Skeleton } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { handleChangeStateTechnical } from "../../controllers/administrator/updateStateTechnical.controller";
import { ScreenConfirmation } from "../../components/administrator/ScreenConfirmation";
import { handleGetTechnical } from "../../controllers/administrator/getTechnicalAd.controller";

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
  gap: 2rem;
`;

const Imagen = styled.img`
  width: 120px;
  height: 120px;
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

const SkeletonButton = styled(Skeleton)`
  align-self: flex-end;
  &.MuiSkeleton-root {
    margin-right: 4rem;

  }

`

const DetailsSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  gap: 1rem;

`


const SkeletonLoader = () => (
  <Container>
    <Header>
      <UsuarioInfo>
        <Skeleton variant="circular" width={120} height={120} />
        <Skeleton variant="text" width={400} height={40} />
      </UsuarioInfo>
      <SkeletonButton variant="rectangular" width={150} height={36}/>
    </Header>
    <Divider />
    <Skeleton variant="text" width={200} height={30} style={{ marginTop: '1rem' }} />
    <DetailsSkeleton>
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="50%" />
      <Skeleton variant="text" width="70%" />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="50%" />
      <Skeleton variant="text" width="70%" />
    </DetailsSkeleton>
    <SkeletonButton variant="rectangular" width={250} height={36} style={{ marginTop: '2rem' }}/>
  </Container>
);


const UserProfileAd = () => {

  const { id } = useParams(); 
  const [technicalData, setTechnicalData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);


  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await handleGetTechnical(id);
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
  
  if (!technicalData) {
    return <SkeletonLoader/>;
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
            src="https://cdn-icons-png.flaticon.com/512/219/219983.png"
            alt="usuario"
          />
          <Nombre>{technicalData.nombre} {technicalData.apellido}</Nombre>
        </UsuarioInfo>

        <Button
          variant="contained"
          onClick={() => setShowConfirmation(true)}
          color={technicalData.estado === "activo" ? "error" : "success"}
          style={{ alignSelf: "flex-end", width: "200px", marginRight: "4rem" }}
        >
          {technicalData.estado === "activo" ? "DESHABILITAR" : "HABILITAR"}
        </Button>
      </Header>

      <Divider />

      <Seccion>
        <Label style={{ marginBottom: "30px" }}>Informacion personal</Label>

        <Label>Cedula:</Label>
        <Texto>{technicalData.numero_de_cedula.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</Texto>

        <Label>Nombre:</Label>
        <Texto>{technicalData.nombre}</Texto>

        <Label>Apellido:</Label>
        <Texto>{technicalData.apellido}</Texto>

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
          to={`/admin/editar-tecnico/${id}`}
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