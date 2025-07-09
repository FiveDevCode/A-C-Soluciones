import styled from "styled-components";
import { useEffect, useState } from "react";
import { handleGetVisitAssign } from "../../controllers/technical/getVisitAssignTc.controller";
import FilterServicesAd from "../../components/administrator/FilterServicesAd";
import { jwtDecode } from "jwt-decode";
import ListVisitTc from "../../components/technical/ListVisitTc";

const ContainerService = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

`


const ViewViewVisitListCompletePageTc = () => {
  const [visits, setVisits] = useState([]);
  const [idTechnical, setIdTechnical] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decoded = jwtDecode(token);
      setIdTechnical(decoded.id); 
    }
  }, []);

  useEffect(() => {
    handleGetVisitAssign(idTechnical)
      .then((res) => {
        const datosVisitas = Array.isArray(res.data.data) ? res.data.data : [];
        const visitasCompletadas = datosVisitas.filter(visita => visita.estado === "completada");

        setVisits(visitasCompletadas);
      })
      .catch((err) => {
        console.error("Error fetching service list:", err);
      });
  }, [idTechnical]);


  return (
    <ContainerService>

      <FilterServicesAd count={visits.length} />
      {visits.length === 0 ? (
        <p style={{textAlign: "center"}}>No tienes ninguna visita en estado "Completada" por el momento.</p>
      ) : (
        <ListVisitTc visits={visits} />
      )}

    </ContainerService>
  )
}

export default ViewViewVisitListCompletePageTc;