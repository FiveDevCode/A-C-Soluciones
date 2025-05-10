import { Button } from "@mui/material"
import styled from "styled-components"


const ContainerScreen = styled.section`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0,0,0,0.35);
  
`

const ContentConfirmation = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #FFFFFF;
  padding: 1rem;
  border: 1px solid rgba(0,0,0,0.25);
  border-radius: 5px;
`

const TitleConfirmation = styled.h1`
  font-size: 1rem;
`

const ContainerButton = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
`

const ButtonConfirm = styled(Button)`
  &.MuiButton-root {
    text-transform: none;
    font-size: 1rem;
    background-color: #FE2C55;
    color: #FFFFFF;
  }

`

const ButtonCancel = styled(Button)`
  &.MuiButton-root {
    text-transform: none;
    font-size: 1rem;
    background-color: #394AFF;
    color: #FFFFFF;
  }
`


export const ScreenConfirmation = ({ onConfirm, onCancel, message  }) => {
  return (
    <ContainerScreen>
      <ContentConfirmation>
        <TitleConfirmation>{message}</TitleConfirmation>
        <ContainerButton>
          <ButtonConfirm variant="contained" onClick={onConfirm}>Sí, estoy seguro</ButtonConfirm> 
          <ButtonCancel variant="contained" onClick={onCancel}>Cancelar</ButtonCancel>
        </ContainerButton>
      </ContentConfirmation>
    </ContainerScreen>
  );
};

