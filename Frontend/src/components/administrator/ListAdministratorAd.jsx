import styled from "styled-components";
import administratorTehc from "../../assets/technical/serviceTehc.png";
import Logo from "../common/Logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faEdit } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { Pagination } from "@mui/material";


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


const ListAdministratorAd = ({administrators}) => {


  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(administrators.length / ITEMS_PER_PAGE);

  const paginatedAdmins = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return administrators.slice(start, start + ITEMS_PER_PAGE);
  }, [administrators, currentPage]);

  return (
    <ContainerNoti>
      {paginatedAdmins.map((administrator, index) => (
        <Notification key={index}>
          <NotificationDescription>
            <Logo src={administratorTehc}/>
            <NotificationInfo>
              <TitleNoti>
                {administrator.numero_cedula || 'Sin numero de cedula'}
              </TitleNoti>
              <Description>
                {administrator.nombre} {administrator.apellido}
              </Description>
              <TitleNoti>
                {administrator.correo_electronico}
              </TitleNoti>
            </NotificationInfo>
          </NotificationDescription>
          <ContainerOption>
            <Link to={`/admin/editar-administratore/${administrator.id}`} style={{ textDecoration: 'none', alignSelf: "center" }}>
              <SeeMore style={{ cursor: 'pointer', color: '#343875' }}>
                <FontAwesomeIcon icon={faEdit} />
                <span>Editar</span>
              </SeeMore>
            </Link>
            <Link to={`/admin/perfil-administratore/${administrator.id}`} style={{ textDecoration: 'none', alignSelf: "center" }}>
              <SeeMore style={{ cursor: 'pointer', color: '#343875' }}>
                <FontAwesomeIcon icon={faArrowRight} />
                <span>Ver</span>
              </SeeMore>
            </Link>
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


export default ListAdministratorAd