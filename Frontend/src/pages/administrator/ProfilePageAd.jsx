import styled from 'styled-components';
import { Button, Divider, Skeleton } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { handleGetAdminId } from '../../controllers/administrator/getAdminIdAd.controller';
import adminProfile from "../../assets/administrator/admin.png"
import { Link } from 'react-router-dom';


const Main = styled.main`
  background: white;
  padding: 2rem;
  width: 80%;
`;

const ProfileSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
`;

const TitleHelp = styled.h4`
  margin-top: 1rem;
    
`

const Details = styled.div`
  margin-top: 1.5rem;
  color: #424242;
  font-size: 1rem;

  p {
    margin-bottom: 1rem;
  }

  strong {
    font-weight: 700;
  }

  a {
    color: #1976d2;
    text-decoration: none;
  }
`;

const ButtonProfile = styled(Button)`
  align-self: flex-end;
  &.MuiButton-root {
    text-transform: none;
    font-size: 1rem;
    margin-right: 4rem;
    font-weight: 600;
  }
`

const SkeletonButton = styled(Skeleton)`
  align-self: flex-end;
  &.MuiSkeleton-root {
    margin-right: 4rem;

  }

`

const DetailsSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
  gap: 1rem;

`



const SkeletonLoader = () => (
  <Main>
    <ProfileSection>
      <ProfileInfo>
        <Skeleton variant="circular" width={120} height={120} />
        <Skeleton variant="text" width={400} height={40} />
      </ProfileInfo>
      <SkeletonButton variant="rectangular" width={150} height={36}/>
    </ProfileSection>
    <Divider />
    <Skeleton variant="text" width={200} height={30} style={{ marginTop: '1rem' }} />
    <DetailsSkeleton>
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="50%" />
      <Skeleton variant="text" width="70%" />
    </DetailsSkeleton>
  </Main>
);



const ProfilePageAd = () => {

  const [userAdmin, setUserAdmin] = useState();

  useEffect(() => {

    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);

    handleGetAdminId(decoded.id)
      .then((res) => {
        console.log(res.data)
        setUserAdmin(res.data);
      })
      .catch((err) => {
        console.error("Error fetching admin:", err);
      });
  }, []);
  
  if (!userAdmin) {
    return <SkeletonLoader />;
  }

  return (
    <Main>
      <ProfileSection>
        <ProfileInfo>
          <Avatar
            src={adminProfile}
            alt="Avatar"
          />
          <h2>{`${userAdmin.nombre} ${userAdmin.apellido}`}</h2>
        </ProfileInfo>
        <ButtonProfile variant='contained' LinkComponent={Link} to="/admin/editar-perfil">Editar infomarcion</ButtonProfile>
      
      </ProfileSection>

      <Divider />

      <TitleHelp>Informacion personal</TitleHelp>
      <Details>
        <p><strong>Cédula:</strong><br/>{`${userAdmin.numero_cedula.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`}</p>
        <p><strong>Nombre:</strong><br/>{`${userAdmin.nombre} ${userAdmin.apellido}`}</p>
        <p><strong>Teléfono:</strong> <br/>{userAdmin.telefono}</p>
        <p><strong>Correo electrónico:</strong> <br/><a href={`mailto:${userAdmin.correo_electronico}`}>{userAdmin.correo_electronico}</a></p>
      </Details>
    </Main>
  );
};

export default ProfilePageAd;