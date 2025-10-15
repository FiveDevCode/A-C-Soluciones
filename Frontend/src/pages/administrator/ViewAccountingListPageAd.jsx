import { useEffect, useState } from "react";
import styled from "styled-components";
import FilterServicesAd from "../../components/administrator/FilterServicesAd";
import ListAccountingAd from "../../components/administrator/ListAccountingAd";
import { handleGetListAccounting } from "../../controllers/administrator/getListAccountingAd.controller";

const ContainerAccounting = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ViewAccountingListPageAd = () => {
  const [accountings, setAccountings] = useState([]);

  useEffect(() => {
    handleGetListAccounting()
      .then((res) => {
        setAccountings(res.data.contabilidad);
      })
      .catch((err) => {
        console.error("Error fetching accounting list:", err);
      });
  }, []);

  return (
    <ContainerAccounting>
      <FilterServicesAd count={accountings?.length} />
      {accountings.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          No hay ningún empleado contable registrado por el momento.
        </p>
      ) : (
        <ListAccountingAd accountings={accountings} />
      )}
    </ContainerAccounting>
  );
};

export default ViewAccountingListPageAd;
