import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";


const ContainerScreen = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.35);
  display: flex;
  justify-content: center;
  align-items: center;
`

const ContainerMessage = styled.div`
  display: flex;
  border: 1px solid rgba(0,0,0,0.35);
  border-radius: 5px;
  background-color: #FFFFFF;
  padding: 1rem;
  gap: 1rem;

`

const MessageSuccess = styled.h1`
  font-size: 1rem;
  font-weight: normal;
`
const CloseContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-end;

`

const ButtonClose = styled.button`
  border: unset;
  background-color: #FFFFFF;
  font-size: 0.825rem;
  color: #6200EE;
  font-weight: 700;
  cursor: pointer;
`

const ButtonCloseIcon = styled.button`
  border: unset;
  background-color: #FFFFFF;
  cursor: pointer;

`

const ScreenSuccess = ({children, onClose}) => {
  
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };


  return (
    <ContainerScreen onClick={handleBackgroundClick}>
      <ContainerMessage>
        <MessageSuccess>{children}</MessageSuccess>
        <CloseContent>
          <ButtonCloseIcon onClick={onClose}><FontAwesomeIcon icon={faX} style={{fontSize:"18px"}}/></ButtonCloseIcon>
          <ButtonClose onClick={onClose}>CERRAR</ButtonClose>
        </CloseContent>
         

      </ContainerMessage>
    </ContainerScreen>
  )
}


export default ScreenSuccess;