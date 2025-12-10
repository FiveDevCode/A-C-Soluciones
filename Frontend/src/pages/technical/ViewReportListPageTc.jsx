import { useEffect, useState } from "react";
import styled from "styled-components";
import FilterReportAd from "../../components/administrator/FilterReportAd";
import { handleGetListToken } from "../../controllers/common/getListToken.controller";
import { jwtDecode } from "jwt-decode";
import { technicalService } from "../../services/techical-service";
import ListReportTc from "../../components/technical/ListReportTc";
import BaseHeaderSection from "../../components/common/BaseHeaderSection";
import { useMenu } from "../../components/technical/MenuContext";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  min-height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  transition: margin-left 0.3s ease;

`;

const Card = styled.div`
  background-color: white;
  margin: 0 auto 0 auto;
  align-self: center;
  padding: 0 20px;
  padding-bottom: 20px;
  width: 85%;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.1);

  @media (max-width: 1350px) {
    margin: 0 10px 0 10px;
    padding: 0 15px 15px 15px;
    width: 95%;
  }
`;

const ContainerServices = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ViewReportListPageTc = () => {
  const { collapsed } = useMenu();
  const [visits, setVisits] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [idTechnical, setIdTechnical] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decoded = jwtDecode(token);
      setIdTechnical(decoded.id); 
    }
  }, []);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener todas las fichas del técnico (el backend ahora filtra por técnico)
        const reportRes = await handleGetListToken();
        const fichasDelTecnico = reportRes.data || [];
        
        console.log('Fichas obtenidas:', fichasDelTecnico);
        console.log('ID Técnico:', idTechnical);

        // Obtener las visitas del técnico para completar información
        // Usar getListVisits que obtiene todas las visitas del técnico autenticado
        const visitRes = await technicalService.getListVisits();
        const allVisits = visitRes.data.data || [];

        // Crear un mapa de visitas: { id => visita }
        const visitMap = {};
        for (const visit of allVisits) {
          visitMap[visit.id] = visit;
        }

        // Formatear las fichas para mostrar en el listado
        const formattedReports = fichasDelTecnico.map(ficha => {
          // Si tiene visita asociada, usar datos de la visita
          if (ficha.id_visitas && visitMap[ficha.id_visitas]) {
            const visita = visitMap[ficha.id_visitas];
            return {
              id: `ficha-${ficha.id}`, // Usar ID de ficha que siempre es único
              fichaId: ficha.id, // Guardar ID de ficha para referencia
              visitaId: visita.id, // Guardar ID de visita para referencia
              notas: visita.notas || ficha.detalles_servicio || ficha.observaciones || 'Sin notas',
              fecha_programada: visita.fecha_programada || ficha.fecha_de_mantenimiento,
              pdf_path: ficha.pdf_path,
              estado: visita.estado || 'completada'
            };
          } else {
            // Ficha de cliente fijo (sin visita), usar datos de la ficha
            return {
              id: `ficha-${ficha.id}`, // ID único usando el ID de la ficha
              fichaId: ficha.id, // Guardar ID de ficha para referencia
              notas: ficha.detalles_servicio || ficha.estado_antes || ficha.observaciones || ficha.recomendaciones || 'Sin notas',
              fecha_programada: ficha.fecha_de_mantenimiento,
              pdf_path: ficha.pdf_path,
              estado: 'completada',
              isClienteFijo: true // Marcar como cliente fijo
            };
          }
        });

        console.log('Reportes formateados:', formattedReports);

        // Ordenar por fecha descendente
        formattedReports.sort((a, b) => {
          const dateA = new Date(a.fecha_programada);
          const dateB = new Date(b.fecha_programada);
          return dateB - dateA;
        });

        setVisits(formattedReports);
        setFilteredVisits(formattedReports);

      } catch (err) {
        console.error("Error al obtener fichas del técnico:", err);
      }
    };

    if (idTechnical) {
      fetchData();
    }
  }, [idTechnical]);

  const handleRefresh = () => {
    const fetchData = async () => {
      try {
        // Obtener todas las fichas del técnico (el backend ahora filtra por técnico)
        const reportRes = await handleGetListToken();
        const fichasDelTecnico = reportRes.data || [];

        // Obtener las visitas del técnico para completar información
        // Usar getListVisits que obtiene todas las visitas del técnico autenticado
        const visitRes = await technicalService.getListVisits();
        const allVisits = visitRes.data.data || [];

        // Crear un mapa de visitas: { id => visita }
        const visitMap = {};
        for (const visit of allVisits) {
          visitMap[visit.id] = visit;
        }

        // Formatear las fichas para mostrar en el listado
        const formattedReports = fichasDelTecnico.map(ficha => {
          // Si tiene visita asociada, usar datos de la visita
          if (ficha.id_visitas && visitMap[ficha.id_visitas]) {
            const visita = visitMap[ficha.id_visitas];
            return {
              id: `ficha-${ficha.id}`, // Usar ID de ficha que siempre es único
              fichaId: ficha.id, // Guardar ID de ficha para referencia
              visitaId: visita.id, // Guardar ID de visita para referencia
              notas: visita.notas || ficha.detalles_servicio || ficha.observaciones || 'Sin notas',
              fecha_programada: visita.fecha_programada || ficha.fecha_de_mantenimiento,
              pdf_path: ficha.pdf_path,
              estado: visita.estado || 'completada'
            };
          } else {
            // Ficha de cliente fijo (sin visita), usar datos de la ficha
            return {
              id: `ficha-${ficha.id}`, // ID único usando el ID de la ficha
              fichaId: ficha.id, // Guardar ID de ficha para referencia
              notas: ficha.detalles_servicio || ficha.estado_antes || ficha.observaciones || ficha.recomendaciones || 'Sin notas',
              fecha_programada: ficha.fecha_de_mantenimiento,
              pdf_path: ficha.pdf_path,
              estado: 'completada',
              isClienteFijo: true // Marcar como cliente fijo
            };
          }
        });

        // Ordenar por fecha descendente
        formattedReports.sort((a, b) => {
          const dateA = new Date(a.fecha_programada);
          const dateB = new Date(b.fecha_programada);
          return dateB - dateA;
        });

        setVisits(formattedReports);
        setFilteredVisits(formattedReports);

      } catch (err) {
        console.error("Error al obtener fichas del técnico:", err);
      }
    };

    if (idTechnical) {
      fetchData();
    }
  };

  return (
    <Container $collapsed={collapsed}>
      <BaseHeaderSection
        headerTitle="REPORTES"
        sectionTitle="Listado de reportes generados"
        onRefresh={handleRefresh}
        filterComponent={
          <FilterReportAd 
            visits={visits}
            onFilteredChange={setFilteredVisits}
          />
        }
      />

      <Card>
        <ContainerServices>
          {filteredVisits.length === 0 ? (
            <p style={{textAlign: "center", marginTop: "20px"}}>No hay ninguna reporte generado por el momento.</p>
          ) : (
            <ListReportTc visits={filteredVisits} />
          )}
        </ContainerServices>
      </Card>
    </Container>
  );
};



export default ViewReportListPageTc