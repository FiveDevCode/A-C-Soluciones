import styled from "styled-components";
import { Typography } from "@mui/material";
import { handleGetHistoryServiceByCliente } from "../../controllers/client/getHistoryServiceByCliente.controller";
import { useEffect } from "react";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";

const ContainerHistoryServices = styled.section`
  min-height: 70vh;
  display: flex;
  flex-direction: column;
`;

const Layout = styled.div`
  display: flex;
  padding: 0 8rem;
  gap: 2rem;

  @media screen and (max-width: 1520px) {
    padding: 0 4rem;
  }

  @media screen and (max-width: 1280px) {
    padding: 0 2rem;
  }
`;

const MainContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TableServices = styled.table`
  width: 70%;
  margin: 0 auto;
  border-collapse: separate;
  border-spacing: 0;
  background-color: #fff;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

  th,
  td {
    padding: 12px 20px;
    text-align: center;
    border-bottom: 1px solid #e5e7eb;
  }

  th {
    background: linear-gradient(135deg, #91cdffff 0%, #91cdffff 100%);
    color: #000;
    font-weight: 600;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 1px solid #e5e7eb;
  }
  button {
    background-color: #7aff52ff;
    color: #fff;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #7aff52ff;
  }

  th:first-child {
    border-bottom-left-radius: 6px;
    border-top-left-radius: 6px;
  }

  th:last-child {
    border-top-right-radius: 6px;
    border-bottom-right-radius: 6px;
  }

  tbody tr {
    background-color: #fff;
    transition: all 0.2s ease;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr:last-child td:first-child {
    border-bottom-left-radius: 12px;
  }

  tbody tr:last-child td:last-child {
    border-bottom-right-radius: 12px;
  }

  tbody tr:hover {
    background-color: #f9fafb;
    transform: scale(1.01);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }

  td {
    color: #374151;
    font-size: 0.9375rem;
  }
`;

const HistoryServicesPage = () => {
  const [historyServices, setHistoryServices] = useState([]);


useEffect(() => {
  const fetchHistoryServices = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const decoded = jwtDecode(token);
    const clienteId = decoded.id; 

    try {
      const response = await handleGetHistoryServiceByCliente(clienteId);
      setHistoryServices(response.data.data);
    } catch (error) {
      console.error("Error al obtener el historial de servicios:", error);
    }
  };

  fetchHistoryServices();
}, []);

  return (
    <ContainerHistoryServices>
      <Typography
        component="h1"
        sx={{
          fontWeight: 700,
          fontSize: "24px",
          padding: "1rem 8rem 0.5rem",
          color: "#1a237e",
          borderTop: "1px solid rgba(0,0,0,0.1)",
          mb: 0.5,
        }}
      >
        Historial de Servicios
      </Typography>

      <Layout>
        <MainContent>
          <TableServices>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Servicio</th>
                <th>Técnico</th>
                <th>Estado</th>
                <th>Ficha</th>
              </tr>
            </thead>
            <tbody>
              {historyServices.length === 0 ? (
                <tr>
                  <td colSpan="5">No hay servicios en el historial.</td>
                </tr>
              ) : (
                historyServices.map((service, index) => (
                  <tr key={index}>
                    <td>{service.fecha}</td>
                    <td>{service.servicio}</td>
                    <td>{service.tecnico}</td>
                    <td>{service.estado}</td>
                    <td>
                      <button>Ver Ficha</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </TableServices>
        </MainContent>
      </Layout>
    </ContainerHistoryServices>
  );
};

export default HistoryServicesPage;

