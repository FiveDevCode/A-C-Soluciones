import { Button } from "@mui/material";
import styled from "styled-components";
import ScreenRequestCl from "./ScreenRequestCl";
import { useState } from "react";

const ContainerService = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 5000;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0,0.35);
  width: 100vw;
  height: 100vh;
`
const ContainerOpen = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #FFFFFF;
  border: 1px solid rgba(0,0,0,0.25);
  border-radius: 5px;
  width: 35%;
`

const ContainerTitle = styled.div`
  display: flex;
  border-bottom: 1px solid rgba(0,0,0,0.25);
  padding: 1rem;
`
const Title = styled.h1`
  font-size: 1.25rem;
`
const ContainerDescription = styled.div`
  display: flex;
  border-bottom: 1px solid rgba(0,0,0,0.25);
`
const Description = styled.h2`
  font-size: 1rem;
  font-weight: normal;
  padding: 1rem;
  padding-bottom: 3rem;
  width: 50%;

`

const ContainerButton = styled.div`
  text-align: end;
  padding: 1rem;
  & > :first-child{

    margin-right: 1.5rem;
  }
`
const ServiceOpenCl = ({servicio, onClose }) => {

  const [showRequestScreen, setShowRequestScreen] = useState(false);

  return (
    <ContainerService>
      <ContainerOpen>
        <ContainerTitle>
          <Title>{servicio.nombre}</Title>
        </ContainerTitle>
        <ContainerDescription>
          <Description>{servicio.descripcion}</Description>
        </ContainerDescription>
        <ContainerButton>
          <Button variant="contained" style={{backgroundColor: "#17A2B8"}} onClick={onClose}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={() => setShowRequestScreen(true)}
          >
            Solicitar revisión
          </Button>
        </ContainerButton>

        {showRequestScreen && (
          <ScreenRequestCl 
            requestId={servicio.id}
            onClose={() => {
              setShowRequestScreen(false); // cierra ScreenRequestCl
              onClose(); // cierra ServiceOpenCl
            }}
          />
        )}

        

      </ContainerOpen>
    </ContainerService>
  )
}

export default ServiceOpenCl;