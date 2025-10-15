import { useEffect, useState } from "react";
import styled from "styled-components";
import FilterServicesAd from "../../components/administrator/FilterServicesAd";
import { handleGetListInventoryAd } from "../../controllers/administrator/getListInventoryAd.controller";
import ListInventoryAd from "../../components/administrator/ListInventoyAd";

const ContainerInventory = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ViewInventoryListPageAd = () => {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    handleGetListInventoryAd()
      .then((res) => {
        console.log("Respuesta del backend (inventario):", res);
        setInventory(res.data); // Guarda el listado de herramientas
      })
      .catch((err) => {
        console.error("Error al obtener la lista de inventario:", err);
      });
  }, []);

  return (
    <ContainerInventory>
      <FilterServicesAd count={inventory.length} />
      {inventory.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          No hay ningún elemento registrado en el inventario por el momento.
        </p>
      ) : (
        <ListInventoryAd inventory={inventory} />
      )}
    </ContainerInventory>
  );
};

export default ViewInventoryListPageAd;
