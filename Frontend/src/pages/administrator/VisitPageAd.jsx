import { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import ListVisitAd from "../../components/administrator/ListVisitAd";
import BaseHeaderSection from "../../components/common/BaseHeaderSection";
import FormCreateVisitAd from "../../components/administrator/FormCreateVisitAd";
import { handleGetListVisitAd } from "../../controllers/administrator/getListVisitAd.controller";
import FilterVisitsAd from "../../components/administrator/FilterVisitsAd";
import useDataCache from "../../hooks/useDataCache";
import { commonService } from "../../services/common-service";

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
  const [pdfMap, setPdfMap] = useState(new Map());

  // Cargar PDFs una sola vez cuando visits cambie
  useEffect(() => {
    const loadPDFs = async () => {
      if (!visits || visits.length === 0) {
        setPdfMap(new Map());
        return;
      }

      try {
        const response = await commonService.getListToken();
        const allFichas = response.data || [];
        
        const newPdfMap = new Map();
        allFichas.forEach((ficha) => {
          if (ficha.id_visitas && ficha.pdf_path) {
            newPdfMap.set(ficha.id_visitas, ficha.pdf_path);
          }
        });
        
        setPdfMap(newPdfMap);
      } catch (err) {
        console.error("Error al cargar PDFs:", err);
      }
    };

    loadPDFs();
  }, [visits.length]); // Solo cuando cambie la cantidad de visitas

  // Combinar visits con pdf_path usando useMemo
  const visitsWithPDF = useMemo(() => {
    return visits.map((visit) => ({
      ...visit,
      pdf_path: pdfMap.get(visit.id) || null,
    }));
  }, [visits, pdfMap]);

  return (
    <Container>
      <BaseHeaderSection
        headerTitle="VISITAS"
        sectionTitle="Lista de visitas asignadas"
        addLabel="Agregar visita"
        onAdd={() => setShowModal(true)}
        onRefresh={loadVisits}
        filterComponent={
          <FilterVisitsAd
            visits={visitsWithPDF}
            onFilteredChange={setFilteredVisits}
          />
        }
        selectedCount={selectedIds.length}
      />

      <Card>
        <ListVisitAd
          visits={filteredVisits.map(v => ({
            ...v,
            pdf_path: pdfMap.get(v.id) || null
          }))}
          reloadData={loadVisits}
          isLoadingData={loading}
        />
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
