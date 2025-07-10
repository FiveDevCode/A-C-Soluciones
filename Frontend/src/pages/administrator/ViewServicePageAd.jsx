import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Skeleton } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { handleChangeStateTechnical } from "../../controllers/administrator/updateStateTechnical.controller";
import { ScreenConfirmation } from "../../components/administrator/ScreenConfirmation";
import { handleGetService } from "../../controllers/administrator/getServiceAd.controller";
import logoService from "../../assets/administrator/service-view.png"
import { handleChangeStateService } from "../../controllers/administrator/updateStateServiceAd.controller";

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
  border-radius: 5%;
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
        <Skeleton variant="text" width={300} height={40} />
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
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="50%" />
      <Skeleton variant="text" width="70%" />
    </DetailsSkeleton>
    <SkeletonButton variant="rectangular" width={250} height={36} sx={{marginTop: "1rem"}}/>
  </Container>
);

const ViewServicePageAd = () => {

  const { id } = useParams(); 
  const [serviceData, setServiceData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);


  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await handleGetService(id);
        setServiceData(response.data.data);  
      } catch (error) {
        console.log(error);
      }
    };

    fetchService();
  }, [id]); 

  if (!serviceData) {
    return <SkeletonLoader />
  }

  const handleToggleState = async () => {
    const newState = serviceData.estado === "activo" ? "inactivo" : "activo";
    try {
      await handleChangeStateService(id, newState);
      setServiceData(prev => ({ ...prev, estado: newState }));
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
    } finally {
      setShowConfirmation(false); // oculta el modal tras la acción
    }
  };

  const confirmationMessage = serviceData.estado === "activo"
    ? "¿Quieres deshabilitar este servicio?"
    : "¿Quieres habilitar este servicio?";

  return (
    <Container>
      <Header>
        <UsuarioInfo>
          <Imagen
            src={logoService}
            alt="usuario"
          />
          <Nombre>{serviceData.nombre}</Nombre>
        </UsuarioInfo>

        <Button
          variant="contained"
          onClick={() => setShowConfirmation(true)}
          color={serviceData.estado === "activo" ? "error" : "success"}
          style={{ alignSelf: "end", marginRight: "4rem", width: "200px"}}
        >
          {serviceData.estado === "activo" ? "DESHABILITAR" : "HABILITAR"}
        </Button>
      </Header>

      <Divider />

      <Seccion>
        <Label style={{ marginBottom: "30px" }}>Informacion personal</Label>

        <Label>Nombre servicio:</Label>
        <Texto>{serviceData.nombre}</Texto>
        
        <Label>Descripcion:</Label>
        <Texto>{serviceData.descripcion}</Texto>

        <Label>Fecha de creacion:</Label>
        <Texto>{new Date(serviceData.fecha_creacion).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}</Texto>
      </Seccion>

      <Footer>
        <Button 
          variant="contained" color="primary"
          style={{width:"15rem"}}
          LinkComponent={Link}
          to={`/admin/editar-servicio/${id}`}
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

export default ViewServicePageAd;