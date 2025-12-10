import Logo from "../../components/common/Logo";
import logo from '../../assets/common/logoA&C.png';
import styled from "styled-components";
import FormRecoverCode from "../../components/common/FormRecoverCode";
import fondoLogin from '../../assets/common/fondoLogin.jpg';


const SectionPage = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: url(${fondoLogin});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 100vh;
  padding: 2rem 1rem;
`
const Title = styled.h1`
  font-size: 2rem;
  margin: 0;
  margin-bottom: 0.75rem;

`

const Subtitle = styled.h4`
  width: 26%;
  align-self: center;
  max-width: 500px;
  font-size: 1.25rem;
  font-weight: normal;
  margin-bottom: 2rem;

`

const RecoverCodePage = () => {
  return (
    <SectionPage>
      <Logo src={logo}/>
      <Title>Recupera tu cuenta</Title>
      <Subtitle>Ingrese el código enviado a tu correo electrónico</Subtitle>
      <FormRecoverCode />
    </SectionPage>
  )
}


export default RecoverCodePage;
