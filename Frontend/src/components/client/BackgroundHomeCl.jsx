import {Button} from '@mui/material';
import styled from 'styled-components';
import logoHome from '../../assets/client/backgroundHome.png'
import { Link } from 'react-router-dom';


const CompanyName = styled.h2`
  font-size: 1.5rem;
  color: #FFFFFF;
`

const CompanyPhrase = styled.h1`
  font-size: 2rem;
  color: #FFFFFF;
  width: 800px;
  text-align: center;
`


const ContainerBackground = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.875rem;
  height: 430px;
  background-image: url(${logoHome});
  justify-content: center;

  z-index: 1;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.30); /* oscurece la imagen */
    z-index: -1;
  }
`

const ButtonService = styled(Button)`
  &.MuiButton-root {
    text-transform: none;
    font-size: 1rem;
    background-color: #FFFFFF;
    color: #000000;
    font-weight: bold;
  }

`


const BackgroundHomeCl = () => {
  return (
    <ContainerBackground>
      <CompanyName>A & C Soluciones</CompanyName>
      <CompanyPhrase>Expertos en reparaciones hidroeléctricas: pequeña empresa, gran ingeniería.</CompanyPhrase>
      <ButtonService variant='contained' LinkComponent={Link} to="/cliente/servicios">Ver nuestro servicios</ButtonService>
      
    </ContainerBackground>

  )
}

export default BackgroundHomeCl;