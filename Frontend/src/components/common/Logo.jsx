import styled from "styled-components";

const ImagenLogo = styled.img`
    width: ${props => props.size || 'auto'};
    max-width: ${props => props.max || 'auto'};
    min-width: ${props => props.min || 'auto'};

    @media (max-width: 768px) {
      width: 48%;
      max-width: 250px;
    }
`;


const Logo = (props) => {
  
  return (
    <ImagenLogo size={props.size} min={props.min}  max={props.max} src={props.src} alt="logo A&C soluciones"></ImagenLogo>
  )
}

export default Logo