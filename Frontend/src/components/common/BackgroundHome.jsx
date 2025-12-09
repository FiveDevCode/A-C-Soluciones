import { Button } from '@mui/material'
import styled from 'styled-components'
import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'

// Import all images from the new background folder
import home1 from '../../assets/common/background/home1.jpg'
import home2 from '../../assets/common/background/home2.jpg'
import home3 from '../../assets/common/background/home3.jpg'
import home4 from '../../assets/common/background/home4.jpg'
import home5 from '../../assets/common/background/home5.jpg'
import home6 from '../../assets/common/background/home6.jpg'
import home7 from '../../assets/common/background/home7.jpg'
import home8 from '../../assets/common/background/home8.jpg'
import home9 from '../../assets/common/background/home9.jpg'
import home10 from '../../assets/common/background/home10.jpg'
import home11 from '../../assets/common/background/home11.jpg'

const images = [
  home1, home2, home3, home4, home5, home6, home7, home8, home9, home10, home11
]

// Posiciones específicas para cada imagen
const imagePositions = [
  'top',    // home1 - parte de arriba
  'center', // home2
  'center', // home3
  'center', // home4
  '15%',    // home5 - un poco más abajo que top
  'bottom', // home6 - parte de abajo
  'center', // home7
  'center', // home8
  'center', // home9
  'center', // home10
  'center'  // home11
]

const BackgroundWrapper = styled.div`
  position: relative;
  height: 500px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-width: 769px) and (max-width: 1350px) {
    height: 380px;
  }

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

  @media (min-width: 769px) and (max-width: 1350px) {
    gap: 1.5rem;
    padding: 0 2rem;
  }

  @media (max-width: 768px) {
    gap: 1rem;
    padding: 0 1rem;
  }
`

const CompanyName = styled.h2`
  font-size: 1.5rem;

  @media (min-width: 769px) and (max-width: 1350px) {
    font-size: 1.3rem;
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`

const CompanyPhrase = styled.h1`
  font-size: 2rem;
  width: 800px;

  @media (min-width: 769px) and (max-width: 1350px) {
    font-size: 1.6rem;
    width: 600px;
    line-height: 1.5;
  }

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

    @media (min-width: 769px) and (max-width: 1350px) {
      font-size: 0.9rem;
      padding: 0.5rem 1.2rem;
    }

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
          $shift={imagePositions[index]}
        />
      ))}
      <Content>
        <CompanyName>A & C Soluciones</CompanyName>
        <CompanyPhrase>
          Expertos en reparaciones hidroeléctricas: pequeña empresa, gran ingeniería.
        </CompanyPhrase>
        <ButtonService 
          variant="contained" 
          LinkComponent={Link} 
          to="/iniciar-sesion"
          state={{ message: "Para ver nuestros servicios debes iniciar sesión o crear una cuenta" }}
        >
          Ver nuestros servicios
        </ButtonService>
      </Content>
    </BackgroundWrapper>
  )
}

export default BackgroundHome