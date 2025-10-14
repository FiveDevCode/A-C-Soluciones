import { useEffect, useState } from "react";
import styled from "styled-components";
import FilterServicesAd from "../../components/administrator/FilterServicesAd";
import ListPaymentAccountAd from "../../components/administrator/ListPaymentAccountAd";
import { handleGetListPaymentAccountAd } from "../../controllers/administrator/getListPaymentAccountAd.controller";

const ContainerAccounts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ViewPaymentAccountListAd = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    handleGetListPaymentAccountAd()
      .then((res) => {
        console.log("Respuesta del backend:", res);
        setAccounts(res.data);
      })
      .catch((err) => {
        console.error("Error al obtener la lista de cuentas:", err);
      });
  }, []);

  return (
    <ContainerAccounts>
      <FilterServicesAd count={accounts.length} />
      {accounts.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          No hay ninguna cuenta de pago registrada por el momento.
        </p>
      ) : (
        <ListPaymentAccountAd accounts={accounts} />
      )}
    </ContainerAccounts>
  );
};

export default ViewPaymentAccountListAd;
