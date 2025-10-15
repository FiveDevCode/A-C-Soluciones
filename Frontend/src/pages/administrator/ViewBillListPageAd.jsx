import { useEffect, useState } from "react";
import ListBillAd from "../../components/administrator/ListBillAd";
import styled from "styled-components";
import FilterServicesAd from "../../components/administrator/FilterServicesAd";
import { handleGetListBillAd } from "../../controllers/administrator/getListBillAd.controller";

const ContainerBills = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ViewBillListPageAd = () => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    handleGetListBillAd()
      .then((res) => {
        console.log("respuesta:", res);
        setBills(res.data);
      })
      .catch((err) => {
        console.error("Error fetching bill list:", err);
      });
  }, []);

  return (
    <ContainerBills>
      <FilterServicesAd count={bills.length} />
      {bills.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          No hay ninguna factura registrada por el momento.
        </p>
      ) : (
        <ListBillAd bills={bills} />
      )}
    </ContainerBills>
  );
};

export default ViewBillListPageAd;
