import styled from "styled-components"
import createReport from "../../assets/common/ficha_mantenimiento.png"
import ReportFormTc from "../../components/technical/ReportFormTc"

const ContainerRegisterAll = styled.section`
  display: flex;
  width: 100%;
  justify-content: center;
  `

const ContainerRegister = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  width: 60%;
`


const DescriptionReport = styled.h1`
  font-size: 1.25rem;
  font-weight: bold;
  width: 80%;
`

const HelperReport = styled.h1`
  font-size: 1rem;
  font-weight: normal;
`
const ContainerForm = styled.div`
  display: flex;
  gap: 2rem;

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

const CreateReportPageTc = () => {

  return (
    <ContainerRegisterAll>
      <ContainerRegister>
        <DescriptionReport>
          Crea aquí un nuevo reporte ingresando la información solicitada. 
          Este reporte servirá para documentar las tareas realizadas y su respectivo estado.
        </DescriptionReport>
        <HelperReport>
          Por favor, completa todos los campos requeridos para generar correctamente el reporte.
        </HelperReport>

        <ContainerForm>
          <ReportFormTc />
          <ImgCreate src={createReport} alt="Imagen de creacion del reporte"/>
        </ContainerForm>
      </ContainerRegister>
    </ContainerRegisterAll>
  )
}

export default CreateReportPageTc