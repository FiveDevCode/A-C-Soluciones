import styled from "styled-components"
import FormCreateEmployeeAd from "../../components/administrator/FormCreateEmployeeAd"
import registerEmployeeAd from "../../assets/administrator/registerEmployeeAd.png"

const ContainerRegisterAll = styled.section`
  display: flex;
  width: 100%;
  justify-content: center;
`

const ContainerRegister = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  width: min-content;
`


const DescriptionRegister = styled.h1`
  font-size: 1.25rem;
  font-weight: bold;
  width: 80%;
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

const ImgCreate = styled.img`
  width: 260px;
  height: 260px;
  user-select: none;
  pointer-events: none;
`

const CreateEmployeeAd = () => {

  return (
    <ContainerRegisterAll>
      <ContainerRegister>
        <DescriptionRegister>Registra aquí a los nuevos empleados ingresando sus datos y rol. 
        Esto les dará acceso al sistema con los permisos correspondientes.</DescriptionRegister>
        <HelperRegister>Por favor, completa todos los campos requeridos para continuar con el registro del empleado.</HelperRegister>

        <ContainerForm>
          <FormCreateEmployeeAd />
          <ImgCreate src={registerEmployeeAd} alt="Imagen de creacion del empleado"/>
        </ContainerForm>
      </ContainerRegister>
    </ContainerRegisterAll>
  )
}

export default CreateEmployeeAd