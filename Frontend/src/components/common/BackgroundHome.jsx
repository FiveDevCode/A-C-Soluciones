import { Button } from '@mui/material'
import styled from 'styled-components'
import { useEffect, useState } from 'react'

import logoHome from '../../assets/client/backgroundHome.png'
import logoHome1 from '../../assets/client/backgroundHome1.png'
import logoHome2 from '../../assets/client/backgroundHome2.png'
import { Link } from 'react-router-dom'

const images = [logoHome, logoHome1, logoHome2]

const BackgroundWrapper = styled.div`
  position: relative;
  height: 430px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    height: 350px;
  }
`

const ImageSlide = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url(${props => props.$background});
  background-size: cover;
  background-position: center ${props => props.$shift || 'center'};
  opacity: ${props => (props.$active ? 1 : 0)};
  transition: opacity 1s ease-in-out;
  z-index: ${props => (props.$active ? 1 : 0)};

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 1;
  }
`


const Content = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.875rem;
  color: white;
  text-align: center;

  @media (max-width: 768px) {
    gap: 1rem;
    padding: 0 1rem;
  }
`

const CompanyName = styled.h2`
  font-size: 1.5rem;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`

const CompanyPhrase = styled.h1`
  font-size: 2rem;
  width: 800px;

  @media (max-width: 768px) {
    font-size: 1.2rem;
    width: 100%;
    line-height: 1.4;
  }
`

const ButtonService = styled(Button)`
  &.MuiButton-root {
    text-transform: none;
    font-size: 1rem;
    background-color: #FFFFFF;
    color: #000000;
    font-weight: bold;

    @media (max-width: 768px) {
      font-size: 0.85rem;
      padding: 0.5rem 1rem;
    }
  }
`

const BackgroundHome = () => {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % images.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <BackgroundWrapper>
      {images.map((img, index) => (
        <ImageSlide
          key={index}
          $background={img}
          $active={index === currentImage}
          $shift={
            index === 1 ? '30%' :
            index === 2 ? '20%' :    
            'center'                 
          }
        />
      ))}
      <Content>
        <CompanyName>A & C Soluciones</CompanyName>
        <CompanyPhrase>
          Expertos en reparaciones hidroeléctricas: pequeña empresa, gran ingeniería.
        </CompanyPhrase>
        <ButtonService variant="contained" LinkComponent={Link} to="/iniciar-sesion">Ver nuestros servicios</ButtonService>
      </Content>
    </BackgroundWrapper>
  )
}

export default BackgroundHome
