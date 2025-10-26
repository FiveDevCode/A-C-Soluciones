import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaSearch, FaFilter, FaPlus } from "react-icons/fa";
import { handleGetListInventoryAd } from "../../controllers/administrator/getListInventoryAd.controller";
import ListInventoryAd from "../../components/administrator/ListInventoyAd";
import FormCreateInventory from "../../components/administrator/FormCreateInventoryAd";

// --- Estilos ---
const Container = styled.div`
  background-color: #f5f7fa;
  min-height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const Header = styled.header`
  background-color: #1976d2;
  color: white;
  padding: 2rem;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
`;

const Card = styled.div`
  background-color: white;
  margin: 40px auto 0 auto;
  padding: 20px;
  width: 85%;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 16px;
  color: #1565c0;
  margin-bottom: 10px;
`;

const Menu = styled.div`
  display: flex;
  align-items: center;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  background: #f1f3f4;
  padding: 6px 10px;
  border-radius: 6px;
  flex: 1;
  width: 280px;

  input {
    border: none;
    outline: none;
    background: transparent;
    width: 100%;
    font-size: 14px;
    margin-left: 6px;
  }
`;

const FilterButton = styled.button`
  background: transparent;
  border: none;
  font-size: 18px;
  color: #555;
  cursor: pointer;
`;

const AddButton = styled.button`
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;

  &:hover {
    background-color: #1565c0;
  }
`;

// --- Componente principal ---
const ViewInventoryListPageAd = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // <-- Nuevo estado para el modal

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = () => {
    setLoading(true);
    handleGetListInventoryAd()
      .then((res) => {
        console.log("Respuesta del backend (inventario):", res);
        setInventory(res.data || []);
      })
      .catch((err) => {
        console.error("Error al obtener la lista de inventario:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Container>
      <Header>GESTIÓN DE INVENTARIO</Header>

      <Card>
        <Menu>
          <Title>Inventario de herramientas</Title>
          <AddButton onClick={() => setShowModal(true)}>
            <FaPlus /> Agregar herramienta
          </AddButton>
        </Menu>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <SearchContainer>
            <SearchBox>
              <FaSearch color="#555" />
              <input
                type="text"
                placeholder="Buscar por nombre o categoría..."
              />
            </SearchBox>
            <FilterButton>
              <FaFilter />
            </FilterButton>
          </SearchContainer>
        </div>

        {loading ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Cargando inventario...
          </p>
        ) : (
          <ListInventoryAd inventory={inventory} />
        )}
      </Card>

      {/* --- Modal flotante --- */}
      {showModal && (
        <FormCreateInventory
          onClose={() => setShowModal(false)} // solo cierra
          onSuccess={() => {
            setShowModal(false);
            loadInventory(); // recarga solo si se guardó correctamente
          }}
        />
      )}
    </Container>
  );
};

export default ViewInventoryListPageAd;
