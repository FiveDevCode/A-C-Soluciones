import styled from "styled-components";
import { FormCreatePaymentAccountAd } from "../../components/administrator/FormCreatePaymentAccountAd";
import registerPaymentAccount from "../../assets/administrator/registerPaymentAccount.png";

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

export const CreatePaymentAccountAd = () => {
  return (
    <ContainerRegisterAll>
      <ContainerRegister>
        <DescriptionRegister>
          Registra aquí las nuevas cuentas de pago asociadas a los clientes, 
          administradores o áreas contables según corresponda.
        </DescriptionRegister>

        <HelperRegister>
          Por favor, completa todos los campos requeridos para registrar la cuenta de pago correctamente.
        </HelperRegister>

        <ContainerForm>
          <FormCreatePaymentAccountAd />
          <ImgCreate
            src={registerPaymentAccount}
            alt="Imagen de creación de cuenta de pago"
          />
        </ContainerForm>
      </ContainerRegister>
    </ContainerRegisterAll>
  );
};
