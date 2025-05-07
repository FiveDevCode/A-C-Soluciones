import { faBell, faCircleUser, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";


const ContainerBar = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 4.75rem;
  align-items: center;
  gap: 5rem;
`

const TitleCategory = styled.div`
  font-size: 1.25rem;
  color: #007BFF;
  font-weight: bold;
  width: 12.5%;
;

`


const ContainerOption = styled.div`
  display: flex;
  gap: 4rem;
`

const InputSearch = styled(TextField)`
  width: 100%;
  max-width: 800px;
  background-color: #f9f9f9;
  border-radius: 50px;

  & .MuiOutlinedInput-root {
    border-radius: 50px;
    padding-right: 10px;
  }

  &:focus-within {
    background-color: #ffffff;
  }
`

const HeaderBar = () => {
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  const { pathname } = useLocation();
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        navigate(`/resultado?data=${busqueda}`);
    }
  };


  const titles = {
    "/services": "Servicios",
    "/register-employee": "Crear empleado",
    "/register": "Crear cuenta",
    "/account": "Perfil de usuario",
    "/home": "Inicio",
    "/profile": "Perfil",
    "/view-service": "Ver servicio",
    "/profile-client": "Perfil cliente",
    "/edit-client": "Editar cliente", // clave base
    "/register-service": "Crear servicio",
    "/administrator-permit": "Crear administrador permisos",
    "/assing-task": "Asignar visita",
    "/homeTc": "Home",
    "/homeAd": "Home",
  };

  function getRouteName(path) {
    if (path.startsWith("/edit-client/")) {
      return "Editar cliente";
    }

    return titles[path] || "Ruta desconocida";
  }

  const title = getRouteName(pathname);

  return (
    <ContainerBar>
      <TitleCategory>{title}</TitleCategory>
      <InputSearch
        value={busqueda}
        onKeyDown={handleKeyDown}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar"
        size="small"
        variant="outlined"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <FontAwesomeIcon icon={faSearch} style={{ color: '#9e9e9e' }} />
            </InputAdornment>
          ),
        }}
      />

      <ContainerOption>
        <Link >
          <FontAwesomeIcon 
            icon={faBell}
            style={{fontSize: '24px'}}
          />
        </Link>
        <Link to="/profile" >
          <FontAwesomeIcon 
            icon={faCircleUser}
            style={{fontSize: '24px'}}
          />
        </Link>
      </ContainerOption>


    </ContainerBar>
  )
}

export default HeaderBar;
