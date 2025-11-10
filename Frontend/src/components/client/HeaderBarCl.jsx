import { faBars, faBell, faCircleUser, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { InputAdornment, TextField } from "@mui/material";
import styled from "styled-components";
import Logo from "../common/Logo";
import logo from "../../assets/common/logoA&C.png"
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FloatingMenuHomeCl from "./FloatingMenuHomeCl";
import MenuSideCl from "./MenuSideCl";


const ContainerHeader = styled.div`
  display: flex;
  flex-direction: column;
  
`


const MenuBar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 3rem;
  align-items: center;
  height: 50px;
  background-color: #F2F5F7;
  padding: 0 8rem;
  @media screen and (max-width: 1520px) {
    padding: 0 4rem;
    
  }
  @media screen and (max-width: 1350px) {
    padding: 0 2rem;
    
  }
  
`

const InputSearch = styled(TextField)`
  width: 15%;
  max-width: 250px;
  background-color: #f9f9f9;
  border-radius: 50px;

  & .MuiOutlinedInput-root {
    border-radius: 50px;
    padding-right: 10px;

  }
`

const Menu = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 95px;
  justify-content: space-between;
  padding: 0 8rem;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.1);

  @media screen and (max-width: 1520px) {
    padding: 0 4rem;
    
  }
  @media screen and (max-width: 1350px) {
    padding: 0 2rem;
    
  }

`

const MenuHamburger = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

`

const IconButtonMenu = styled.button`
  border: unset;
  background-color: #FFFFFF;
  cursor: pointer;
`

const MenuOption = styled.div`
  display: flex;
  flex-direction: row;
  gap: 3rem;
`

const LinkOption = styled(Link)`

`

const ButtonProfile = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
`

const HeaderBarCl = () => {

  const [showMenu, setShowMenu] = useState(false)
  const [show, setShow] = useState(false)
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();
  const profileButtonRef = useRef(null);
  const menuRef = useRef(null);

  // Cierra el menú si se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(event.target)
      ) {
        setShow(false);
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        navigate(`/resultado?data=${busqueda}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  const handleShowMenu = () => {
    setShow(!show)
  }

  const handleShowMenuSide = () => {
    setShowMenu(!showMenu)
  }


  return (
    <ContainerHeader>
      <MenuBar>
        <ButtonProfile ref={profileButtonRef} onClick={handleShowMenu}>
          <FontAwesomeIcon icon={faCircleUser} style={{ fontSize: "24px" }} />
        </ButtonProfile>
        {show && <FloatingMenuHomeCl ref={menuRef} handleLogout={handleLogout}/>}

      </MenuBar>
      <Menu>
        <MenuHamburger>
          <IconButtonMenu onClick={handleShowMenuSide}><FontAwesomeIcon icon={faBars} style={{fontSize:"24px"}} /></IconButtonMenu>
          {showMenu && <MenuSideCl onClose={() => setShowMenu(false)}/>}
          <Link to="/cliente/inicio"><Logo src={logo} size="45%"/></Link>
        </MenuHamburger>
        <MenuOption>
          <LinkOption to="/acerca-de-nosotros">Acerca de nosotros</LinkOption>
          <LinkOption to="/cliente/servicios">Servicios</LinkOption>
        </MenuOption>


      </Menu>

    </ContainerHeader>
  )
}


export default HeaderBarCl;