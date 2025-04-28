import styled from "styled-components";

const ImagenLogo = styled.img`
    width: ${props => props.size};
`;


const Logo = (props) => {
  
  return (
    <ImagenLogo size={props.size} src={props.src} ></ImagenLogo>
  )
}

export default Logo