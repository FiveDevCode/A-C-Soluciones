import styled from "styled-components";
import FormCreateAccounting from "../../components/administrator/FormCreateAccounting";
import registerEmployedAccounting from "../../assets/administrator/registerEmployedAccounting.png";

const ContainerRegisterAll = styled.section`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const ContainerRegister = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  width: min-content;
`;

const DescriptionRegister = styled.h1`
  font-size: 1.25rem;
  font-weight: bold;
  width: 80%;
`;

const HelperRegister = styled.h1`
  font-size: 1rem;
  font-weight: normal;
`;

const ContainerForm = styled.div`
  display: flex;
  gap: 5rem;

  & > :nth-child(2) {
    align-self: flex-start;
  }
`;

const ImgCreate = styled.img`
  width: 260px;
  height: 260px;
  user-select: none;
  pointer-events: none;
`;

const CreateAccountingAd = () => {
  return (
    <ContainerRegisterAll>
      <ContainerRegister>
        <DescriptionRegister>
          Registra aquí a los nuevos contadores ingresando sus datos personales. 
          Esto les permitirá acceder al sistema con su respectiva cuenta.
        </DescriptionRegister>

        <HelperRegister>
          Por favor, completa todos los campos requeridos para continuar con el registro del contador.
        </HelperRegister>

        <ContainerForm>
          <FormCreateAccounting />
          <ImgCreate src={registerEmployedAccounting} alt="Imagen de creación del contador" />
        </ContainerForm>
      </ContainerRegister>
    </ContainerRegisterAll>
  );
};

export default CreateAccountingAd;
