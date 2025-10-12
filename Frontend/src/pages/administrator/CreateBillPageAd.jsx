import styled from "styled-components";
import createBill from "../../assets/administrator/createBill.png";
import BillFormAd from "../../components/administrator/BillFormAd";

const ContainerRegisterAll = styled.section`
  display: flex;
  width: 100%;
  justify-content: center;
`;

const ContainerRegister = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  width: 60%;
`;

const DescriptionReport = styled.h1`
  font-size: 1.25rem;
  font-weight: bold;
  width: 80%;
`;

const HelperReport = styled.h1`
  font-size: 1rem;
  font-weight: normal;
`;

const ContainerForm = styled.div`
  display: flex;
  gap: 2rem;

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

const CreateBillPageAd = () => {
  return (
    <ContainerRegisterAll>
      <ContainerRegister>
        <DescriptionReport>
          Crea aquí un nuevo registro de factura ingresando la información solicitada.
          Este registro servirá para llevar el control contable y financiero de las operaciones.
        </DescriptionReport>
        <HelperReport>
          Por favor, completa todos los campos requeridos para registrar correctamente la factura.
        </HelperReport>

        <ContainerForm>
          <BillFormAd />
          <ImgCreate src={createBill} alt="Imagen de creación de factura" />
        </ContainerForm>
      </ContainerRegister>
    </ContainerRegisterAll>
  );
};

export default CreateBillPageAd;
