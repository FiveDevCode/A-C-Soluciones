

import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import Logo from "../common/Logo";
import logo from "../../assets/common/logoA&C.png"
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FloatingMenuHomeCl from "./FloatingMenuHomeCl";
import { useMenu } from "./MenuContext";

const ContainerHeader = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  right: 0;
  left: ${(props) => (props.$collapsed ? '80px' : '220px')};
  z-index: 998;
  background-color: #fff;
  transition: left 0.3s ease;

  @media screen and (max-width: 1280px) {
    left: ${(props) => (props.$collapsed ? '60px' : '180px')};
  }
`;

const MenuBar = styled.div`
  display: flex;
  
  
  @media screen and (max-width: 1520px) {
    padding: 0 2rem;
  }
  @media screen and (max-width: 1280px) {
    padding: 0 1rem;
  }
`;

const Menu = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 95px;
  justify-content: space-between;
  padding: 0 4rem;
  border-bottom: 1px solid rgba(0,0,0,0.1);

  @media screen and (max-width: 1520px) {
    padding: 0 2rem;
  }
  @media screen and (max-width: 1280px) {
    padding: 0 1rem;
  }
`;

const MenuHamburger = styled.div`
  visibility: hidden;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MenuOption = styled.div`
  display: flex;
  flex-direction: row;
  gap: 3rem;

  @media screen and (max-width: 1280px) {
    gap: 1.5rem;
  }
`;

const LinkOption = styled(Link)`
  text-decoration: none;
  color: #1e1f23;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: #000;
  }

  @media screen and (max-width: 1280px) {
    font-size: 0.9rem;
  }
`;

const ButtonProfile = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
  }
`;

const HeaderBarCl = () => {
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const profileButtonRef = useRef(null);
  const menuRef = useRef(null);
  const { collapsed } = useMenu();

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

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    window.dispatchEvent(new Event('authChange'));
    navigate("/");
  };

  const handleShowMenu = () => {
    setShow(!show);
  };

  return (
    <ContainerHeader $collapsed={collapsed}>
     
      <Menu>
        <MenuHamburger>
          <Link to="/cliente/inicio"><Logo src={logo} size="120px"/></Link>
        </MenuHamburger>
        <MenuOption>
          <LinkOption to="/acerca-de-nosotros">Acerca de nosotros</LinkOption>
          <LinkOption to="/cliente/servicios">Servicios</LinkOption>
           <MenuBar>
            <ButtonProfile ref={profileButtonRef} onClick={handleShowMenu}>
              <FontAwesomeIcon icon={faCircleUser} style={{ fontSize: "24px" }} />
            </ButtonProfile>
            {show && <FloatingMenuHomeCl ref={menuRef} handleLogout={handleLogout}/>}
          </MenuBar>
        </MenuOption>
      </Menu>
    </ContainerHeader>
  );
};

export default HeaderBarCl;