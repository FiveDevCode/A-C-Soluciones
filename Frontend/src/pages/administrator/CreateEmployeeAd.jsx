import styled from "styled-components"
import FormCreateEmployeeAd from "../../components/administrator/FormCreateEmployeeAd"
import Logo from "../../components/common/Logo"
import registerEmployeeAd from "../../assets/administrator/registerEmployeeAd.png"

const ContainerRegister = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`


const DescriptionRegister = styled.h1`
  font-size: 1.25rem;
  font-weight: bold;
  width: 50%;
`

const HelperRegister = styled.h1`
  font-size: 1rem;
  font-weight: normal;
`
const ContainerForm = styled.div`
  display: flex;
  gap: 5rem;

  & > :nth-child(2){
    align-self: flex-start;
    
  }
`

const CreateEmployeeAd = () => {
  return (
    <ContainerRegister>
      <DescriptionRegister>Registra aquí a los nuevos empleados ingresando sus datos y rol. 
      Esto les dará acceso al sistema con los permisos correspondientes.</DescriptionRegister>
      <HelperRegister>Por favor, completa todos los campos requeridos para continuar con el registro del empleado.</HelperRegister>

      <ContainerForm>
        <FormCreateEmployeeAd />
        <Logo src={registerEmployeeAd}/>
      </ContainerForm>
    </ContainerRegister>
  )
}

export default CreateEmployeeAd