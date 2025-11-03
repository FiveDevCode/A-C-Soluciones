import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { handleGetListInventoryAd } from "../../controllers/administrator/getListInventoryAd.controller";
import ListInventoryAd from "../../components/administrator/ListInventoyAd";
import FormCreateInventory from "../../components/administrator/FormCreateInventoryAd";
import BaseHeaderSection from "../../components/common/BaseHeaderSection";
import { handleDeleteInventory } from "../../controllers/administrator/deleteInventoryAd.controller";
import FilterInventoryAd from "../../components/administrator/FilterInventoryAd";


const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa; 
  min-height: 100vh; 
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;

`;
const Card = styled.div`
  background-color: white;
  margin: 0 auto 0 auto;
  align-self: center;
  padding: 0 20px;
  padding-bottom: 20px;
  width: 85%;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 0 rgba(0,0,0,0.1);

  @media (max-width: 1280px) {
    margin: 0 10px 0 10px;
    padding: 0 15px 15px 15px;
    width: 95%;
  }
`;

const ViewInventoryListPageAd = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // <-- Nuevo estado para el modal
  const [selectedIds, setSelectedIds] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const data = await handleGetListInventoryAd();
      setInventory(data);
    } catch (err) {
      console.error("Error cargando inventario:", err);
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) {
      alert("Selecciona al menos un registro para eliminar.");
      return;
    }

    const confirmDelete = window.confirm(
      `¿Deseas eliminar ${selectedIds.length} elementos seleccionados?`
    );

    if (!confirmDelete) return;

    try {
      for (const id of selectedIds) {
        await handleDeleteInventory(id);
      }
      alert("Registros eliminados correctamente.");
      setSelectedIds([]);
      loadInventory();
    } catch (error) {
      console.error("Error eliminando registros:", error);
      alert("Error al eliminar algunos registros.");
    }
  };

  return (
    <Container>
      <BaseHeaderSection
        headerTitle="GESTIÓN DE INVENTARIO"
        sectionTitle="Inventario de herramientas"
        addLabel="Agregar herramienta"
        onAdd={() => setShowModal(true)}
        onDeleteSelected={handleDeleteSelected}
        selectedCount={selectedIds.length}
        filterComponent={
          <FilterInventoryAd
            inventory={inventory}
            onFilteredChange={setFilteredInventory}
          />
        }
      />


      <Card>
        {loading ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Cargando inventario...
          </p>
        ) : (
          <ListInventoryAd
            inventory={filteredInventory}
            reloadData={loadInventory}
            onSelectRows={(rows) => setSelectedIds(rows.map((r) => r.id))}
          />
        )}
      </Card>

      {showModal && (
        <FormCreateInventory
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            loadInventory();
          }}
        />
      )}
    </Container>
  );
};

export default ViewInventoryListPageAd;
