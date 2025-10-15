import styled from "styled-components";
import FormCreateInventoryAd from "../../components/administrator/FormCreateInventoryAd";
import registerInventoryAd from "../../assets/administrator/registerInventoryAd.png";

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

const CreateInventoryPageAd = () => {
  return (
    <ContainerRegisterAll>
      <ContainerRegister>
        <DescriptionRegister>
          Registra aquí los nuevos productos o materiales del inventario. 
          Esto permitirá mantener actualizado el stock y mejorar la gestión de recursos.
        </DescriptionRegister>

        <HelperRegister>
          Por favor, completa todos los campos requeridos para registrar un nuevo elemento en el inventario.
        </HelperRegister>

        <ContainerForm>
          <FormCreateInventoryAd />
          <ImgCreate
            src={registerInventoryAd}
            alt="Imagen de creación del inventario"
          />
        </ContainerForm>
      </ContainerRegister>
    </ContainerRegisterAll>
  );
};

export default CreateInventoryPageAd;
