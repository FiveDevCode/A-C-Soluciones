import styled from "styled-components";
import serviceTehc from "../../assets/technical/serviceTehc.png";
import Logo from "../common/Logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faDownload } from "@fortawesome/free-solid-svg-icons";
import { useMemo, useState } from "react";


const API_KEY = import.meta.env.VITE_API_URL ||
'http://localhost:8000';

const ContainerNoti = styled.div`
  display: flex;
  flex-direction: column;
`;

const Notification = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid rgba(0,0,0,0.25);
  padding-left: 1rem;
  padding-right: 5rem;
  justify-content: space-between;
  
  &:first-child{
    border-radius: 5px 5px 0 0;
  }
`;

const NotificationDescription = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const NotificationInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ContainerOption = styled.div`
  display: flex;
  gap: 4rem;
  width: 50%;
  justify-content: end;
`

const TitleNoti = styled.h2`
  font-size: 1rem;
  font-weight: lighter;
`;

const Description = styled.h2`
  font-size: 1rem;
  font-weight: bold;
`;

const Date = styled.h2`
  font-size: 1rem;
  font-weight: normal;
`;

const SeeMore = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const ITEMS_PER_PAGE = 6;


const ListReportTc = ({visits}) => {


  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(visits.length / ITEMS_PER_PAGE);

  const paginatedVisit = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return visits.slice(start, start + ITEMS_PER_PAGE);
  }, [visits, currentPage]);


  return (
    <ContainerNoti>
      {paginatedVisit.map((visit, index) => (
        <Notification key={index}>
          <NotificationDescription>
            <Logo src={serviceTehc}/>
            <NotificationInfo>
              <TitleNoti>
                {visit.notas_posteriores && visit.notas_posteriores.length > 50
                  ? `${visit.notas_posteriores.slice(0, 50)}...`
                  : visit.notas_posteriores || "Sin notas posteriores"}
              </TitleNoti>
              <Description>
                {visit.notas_previas && visit.notas_previas.length > 50
                  ? `${visit.notas_previas.slice(0, 50)}...`
                  : visit.notas_previas || "Sin notas previas"}
              </Description>
              <Date>{visit.fecha_programada.substring(0, 10)}</Date>
            </NotificationInfo>
          </NotificationDescription>
          <ContainerOption>
            <SeeMore
              style={{ cursor: 'pointer', color: '#1976d2' }} // azul como botón MUI
              onClick={async () => {
                try {
                  const token = localStorage.getItem('authToken');

                  const relativePath = visit.pdf_path.replace(/^uploads[\\/]/, '').replace(/\\/g, '/');
                  const publicUrl = `${API_KEY}/${relativePath}`;

                  const response = await fetch(publicUrl, {
                    method: 'GET',
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                  });

                  if (!response.ok) {
                    throw new Error('No se pudo descargar el PDF');
                  }

                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);

                  const link = document.createElement('a');
                  link.href = url;
                  link.download = `Reporte-visita-${visit.id}.pdf`;
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                } catch (err) {
                  console.error('Error al descargar el PDF:', err);
                }
              }}
            >
              <FontAwesomeIcon icon={faDownload} />
              <span>Descargar PDF</span>
            </SeeMore>
            {visit.pdf_path && (
              <SeeMore
                style={{ cursor: 'pointer', color: '#2e7d32' }}
                onClick={async () => {
                  try {
                    const token = localStorage.getItem('authToken');

                    const relativePath = visit.pdf_path.replace(/^uploads[\\/]/, '').replace(/\\/g, '/');
                    const publicUrl = `${API_KEY}/${relativePath}`;
                    
                    const response = await fetch(publicUrl, {
                      method: 'GET',
                      headers: {
                        'Authorization': `Bearer ${token}`
                      }
                    });

                    if (!response.ok) {
                      throw new Error('No se pudo abrir el PDF');
                    }

                    const blob = await response.blob();
                    const fileURL = URL.createObjectURL(blob);
                    window.open(fileURL, '_blank');
                  } catch (err) {
                    console.error('Error al abrir el PDF:', err);
                  }
                }}
              >
                <FontAwesomeIcon icon={faArrowRight} />
                <span>Ver PDF</span>
              </SeeMore>
            )}

          </ContainerOption>
        </Notification>
      ))}
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(e, page) => setCurrentPage(page)}
        color="primary"
        shape="rounded"
        sx={{ marginTop: "3rem", alignSelf: "center" }}
      />
    </ContainerNoti>
  );
}


export default ListReportTc