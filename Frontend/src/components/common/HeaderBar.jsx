import { faBell, faCircleUser, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputAdornment, TextField } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
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
  const [profilePath, setProfilePath] = useState("");
  const navigate = useNavigate();

  const { pathname } = useLocation();
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate(`/resultado?data=${busqueda}`);
    }
  };



  useEffect(() => {
    const role = localStorage.getItem("userRole");

    switch (role) {
      case "tecnico":
        setProfilePath("/tecnico/perfil");
        break;
      case "administrador":
        setProfilePath("/admin/perfil");
        break;
    }
    
  }, []);



  const titles = {
    "/tecnico/inicio": "Inicio técnico",
    "/tecnico/servicios": "Servicios técnico",
    "/tecnico/perfil": "Perfil técnico",

    "/admin/inicio": "Inicio administrador",
    "/admin/registrar-empleado": "Crear empleado",
    "/admin/perfil": "Perfil administrador",
    "/admin/registrar-servicio": "Crear servicio",
    "/admin/registrar-administrador": "Crear administrador",
    "/admin/permisos": "Permisos administrador",
    "/admin/asignar-visita": "Asignar visita",
    "/admin/editar-cliente/": "Editar cliente", 
    "/admin/visitas": "Visitas",
    "/admin/solicitudes": "Solicitudes",
    "/admin/tecnicos": "Tecnicos",
    "/admin/clientes":"Clientes",
    "/admin/administradores":"Administradores",
    "/admin/servicios":"Servicios",
    "/admin/reportes":"Reportes"
  };

  function getRouteName(path) {
    if (path.startsWith("/admin/editar-cliente/") && path !== "/admin/editar-cliente/") {
      return "Editar cliente";
    }
    if (path.startsWith("/admin/servicio/")) {
      return "Ver servicio";
    }
    if (path.startsWith("/admin/visita/")) {
      return "Ver visita";
    }
    if (path.startsWith("/admin/perfil-cliente/")) {
      return "Perfil cliente";
    }
    if (path.startsWith("/admin/perfil-tecnico/")) {
      return "Perfil técnico";
    }
    if (path.startsWith("/admin/editar-tecnico/")) {
      return "Editar técnico";
    }
    if (path.startsWith("/admin/editar-servicio/")) {
      return "Editar servicio";
    }
    if (path.startsWith("/admin/solicitud/")) {
      return "Ver solicitud";
    }
    if (path.startsWith("/tecnico/ver-servicio/")) {
      return "Ver servicio";
    }
    if (path.startsWith("/tecnico/reporte/")) {
      return "Reporte técnico";
    }
    if (path.startsWith("/tecnico/ver-visita/")) {
      return "Ver visita";
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
        <Link to={profilePath}>
          <FontAwesomeIcon 
            icon={faCircleUser}
            style={{ fontSize: '24px' }}
          />
        </Link>
      </ContainerOption>


    </ContainerBar>
  )
}

export default HeaderBar;
