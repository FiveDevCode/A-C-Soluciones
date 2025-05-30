import styled from "styled-components"
import logoAltamira from "../../assets/client/logoAltamira.png"
import logoBft from "../../assets/client/logoBft.png"
import logoJohn from "../../assets/client/logoJohn.png"
import logoPanda from "../../assets/client/logoPanda.png"
import logoPentair from "../../assets/client/logoPentair.png"
import logoWeg from "../../assets/client/logoWeg.png"


const ContainerWork = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 8rem;
  gap: 1.5rem;
`
const TitleWork = styled.h1`
  font-size: 1.75rem;
  color: #5B5BDE;
`

const ContainerLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`


const WorkProductCl = () => {
  return (
    <ContainerWork>
      <TitleWork>TRABAJAMOS CON PRODUCTOS DE CALIDAD</TitleWork>
      <ContainerLogo>
        <img src={logoPentair} alt="logo de pentair"/>
        <img src={logoPanda} alt="logo de panda"/>
        <img src={logoAltamira} alt="logo de altamira"/>
        <img src={logoWeg} alt="logo de weg"/>
        <img src={logoJohn} alt="logo de John"/>
        <img src={logoBft} alt="logo de bft"/>
      </ContainerLogo>

    </ContainerWork>
  )
}

export default WorkProductCl;