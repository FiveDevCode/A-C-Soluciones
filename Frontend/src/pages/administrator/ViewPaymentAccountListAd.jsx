import { useEffect, useState } from "react";
import styled from "styled-components";
import FilterServicesAd from "../../components/administrator/FilterServicesAd";
import ListPaymentAccountAd from "../../components/administrator/ListPaymentAccountAd";
import { handleGetListPaymentAccountAd } from "../../controllers/administrator/getListPaymentAccountAd.controller";
import { handleGetClient } from "../../controllers/administrator/getClientAd.controller";

const ContainerAccounts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ViewPaymentAccountListAd = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    handleGetListPaymentAccountAd()
      .then(async (res) => {
        console.log("Respuesta del backend:", res);
        const accountsData = res.data;

        const enrichedAccounts = await Promise.all(
          accountsData.map(async (account) => {
            if (account.id_cliente) {
              try {
                const clientRes = await handleGetClient(account.id_cliente);
                return {
                  ...account,
                  cliente: clientRes.data, // agrega objeto cliente con nombre y apellido
                };
              } catch (err) {
                console.error(`Error al obtener cliente ${account.id_cliente}:`, err);
                return account; // devuelve la cuenta sin cliente si hay error
              }
            }
            return account;
          })
        );

        setAccounts(enrichedAccounts);
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
