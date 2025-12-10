import Logo from "../../components/common/Logo";
import logo from '../../assets/common/logoA&C.png';
import styled from "styled-components";
import FormRecoverChange from "../../components/common/FormRecoverChange";
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

const RecoverChangePage = () => {
  return (
    <SectionPage>
      <Logo src={logo}/>
      <Title>Recupera tu cuenta</Title>
      <Subtitle>Ingrese su nueva contraseña</Subtitle>
      <FormRecoverChange />
    </SectionPage>
  )
}


export default RecoverChangePage;
