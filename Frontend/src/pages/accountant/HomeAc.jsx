import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Divider } from "@mui/material";
import ActivityFilterAd from "../../components/administrator/ActivityFilterAd";
import { CategoryRecomendAc } from "../../components/accountant/CategoryRecomendAc";
import { ActivityListAc } from "../../components/accountant/ActivityListAc";
import { handleGetListBillAc } from "../../controllers/accountant/getListBillAc.controller";

const ContainerHome = styled.section`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const HomeAc = () => {
  const [bills, setBills] = useState({});

  useEffect(() => {
    handleGetListBillAc()
      .then((res) => {
        setBills(res.data);
      })
      .catch((err) => console.log("Error obteniendo las facturas", err));
  }, []);


  return (
    <ContainerHome>
      <CategoryRecomendAc />
      <Divider />
      <ActivityFilterAd />
      {bills.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          No tienes ninguna factura asignada por el momento.
        </p>
      ) : (
        <ActivityListAc bills={bills} />
      )}
    </ContainerHome>
  );
};


export default HomeAc;