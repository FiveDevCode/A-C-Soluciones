import Logo from "../../components/common/Logo";
import logo from '../../assets/common/logoA&C.png';
import styled from "styled-components";
import FormCreateCl from "../../components/client/FormCreateCl";


const SectionPage = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #F2F5F7;
  height: 100vh;

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

const CreateAccountPageCl = () => {
  return (
    <SectionPage>
      <Logo src={logo}/>
      <Title>Crear una cuenta</Title>
      <Subtitle>Por favor completa todos lo campos para crear tu cuenta</Subtitle>
      <FormCreateCl />
    </SectionPage>
  )
}


export default CreateAccountPageCl;