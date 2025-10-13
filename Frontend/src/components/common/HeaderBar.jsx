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
  

  useEffect(() => {
    const role = localStorage.getItem("userRole");

    switch (role) {
      case "tecnico":
        setProfilePath("/tecnico/perfil");
        break;
      case "administrador":
        setProfilePath("/admin/perfil/");
        break;
    }
    
  }, []);



  const titles = {
    "/tecnico/inicio": "Inicio técnico",
    "/tecnico/servicios": "Servicios",
    "/tecnico/perfil": "Perfil técnico",
    "/tecnico/visitas": "Visitas",
    "/tecnico/reportes": "Reportes",
    "/tecnico/visitas-iniciadas": "Visitas iniciadas",
    "/tecnico/visitas-completadas": "Visitas completadas",
    "/tecnico/visitas-programadas": "Visitas programadas",
    "/tecnico/visitas-canceladas": "Visitas canceladas",
    "/tecnico/visitas-en-camino": "Visitas en camino",
    "/tecnico/editar-perfil":"Editar perfil",

    "/admin/inicio": "Inicio administrador",
    "/admin/registrar-empleado": "Crear empleado",
    "/admin/perfil/": "Perfil",
    "/admin/registrar-servicio": "Crear servicio",
    "/admin/registrar-administrador": "Crear administrador",
    "/admin/permisos": "Permisos administrador",
    "/admin/asignar-visita": "Asignar visita",
    "/admin/editar-cliente": "Editar cliente", 
    "/admin/visitas": "Visitas",
    "/admin/solicitudes": "Solicitudes",
    "/admin/tecnicos": "Tecnicos",
    "/admin/clientes":"Clientes",
    "/admin/administradores":"Administradores",
    "/admin/servicios":"Servicios",
    "/admin/reportes":"Reportes",
    "/admin/editar-perfil":"Editar perfil",
    "/admin/registrar-contador":"Crear empleado contador",
    "/admin/contadores":"Contadores",
    "/admin/facturas":"Facturas",
    
    
    
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
    if (path.startsWith("/admin/perfil-contador/")) {
      return "Perfil contador";
    }
    if (path.startsWith("/admin/perfil/")) {
      return "Perfil";
    }
    if (path.startsWith("/admin/perfil-administrador/")) {
      return "Perfil administrador";
    }
    if (path.startsWith("/admin/editar-administrador/")) {
      return "Editar administrador";
    }
    if (path.startsWith("/admin/reporte/")) {
      return "Reporte";
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
    if (path.startsWith("/tecnico/reporte/")) {
      return "Reporte técnico";
    }
    if (path.startsWith("/tecnico/visita/")) {
      return "Ver visita";
    }
    if (path.startsWith("/tecnico/servicio/")) {
      return "Ver servicio";
    }


    return titles[path] || "Ruta desconocida";
  }

  const title = getRouteName(pathname);

  return (
    <ContainerBar>
      <TitleCategory>{title}</TitleCategory>

      <ContainerOption style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link to={profilePath} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', gap: "0.725rem", color: "blue" }}>
          <span style={{ fontSize: '16px' }}>Perfil</span>
          <FontAwesomeIcon 
            icon={faCircleUser}
            style={{ fontSize: '28px' }}
          />
        </Link>
      </ContainerOption>

    </ContainerBar>
  )
}

export default HeaderBar;
