import { useState } from "react";
import styled from "styled-components";
import ListVisitAd from "../../components/administrator/ListVisitAd";
import BaseHeaderSection from "../../components/common/BaseHeaderSection";
import FormCreateVisitAd from "../../components/administrator/FormCreateVisitAd";
import { handleGetListVisitAd } from "../../controllers/administrator/getListVisitAd.controller";
import FilterVisitsAd from "../../components/administrator/FilterVisitsAd";
import useDataCache from "../../hooks/useDataCache";

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

  @media (max-width: 1350px) {
    margin: 0 10px 0 10px;
    padding: 0 15px 15px 15px;
    width: 95%;
  }
`;

const VisitPageAd = () => {
  const { data: visits, isLoading: loading, reload: loadVisits } = useDataCache(
    'visits_cache',
    handleGetListVisitAd
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);

  return (
    <Container>
      <BaseHeaderSection
        headerTitle="GESTIÓN DE VISITAS"
        sectionTitle="Lista de visitas asignadas"
        addLabel="Agregar visita"
        onAdd={() => setShowModal(true)}
        filterComponent={
          <FilterVisitsAd
            visits={visits}
            onFilteredChange={setFilteredVisits}
          />
        }
        selectedCount={selectedIds.length}
      />

      <Card>
        {loading ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Cargando lista de visitas...
          </p>
        ) : (
          <ListVisitAd
            visits={filteredVisits}
            reloadData={loadVisits}
          />
        )}
      </Card>

      {showModal && (
        <FormCreateVisitAd
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            loadVisits();
          }}
        />
      )}
    </Container>
  );
};

export default VisitPageAd;
