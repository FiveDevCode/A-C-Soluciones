import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ActivityListAc } from "../../components/accountant/ActivityListAc";
import { handleGetListBillAc } from "../../controllers/accountant/getListBillAc.controller";
import { handleGetListPaymentAccountAd } from "../../controllers/administrator/getListPaymentAccountAd.controller";
import { handleGetListInventoryAd } from "../../controllers/administrator/getListInventoryAd.controller";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faFileInvoiceDollar, 
  faBoxes,
  faCreditCard,
  faExclamationTriangle,
  faCheckCircle
} from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  height: 100vh;
  overflow: hidden;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  gap: 1.5rem;
  padding: 1.5rem;

  @media (max-width: 1350px) {
    padding: 1rem;
    gap: 1rem;
  }
`;

const Header = styled.div`
  background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: white;
  flex-shrink: 0;

  h1 {
    font-size: 1.7rem;
    margin: 0;
    font-weight: 600;
  }

  p {
    margin: 0;
    font-size: 1rem;
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    
    h1 {
      font-size: 1.3rem;
    }
    
    p {
      font-size: 0.9rem;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  flex-shrink: 0;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const StatCard = styled.div`
  background: white;
  padding: 1.2rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 0.9rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
  }
`;

const StatIcon = styled.div`
  width: 55px;
  height: 55px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  background: ${props => props.bgColor || '#e3f2fd'};
  color: ${props => props.color || '#1976d2'};
  flex-shrink: 0;
`;

const StatInfo = styled.div`
  flex: 1;
  min-width: 0;

  h3 {
    margin: 0 0 0.25rem 0;
    font-size: 0.85rem;
    color: #666;
    font-weight: 500;
  }

  p {
    margin: 0;
    font-size: 1.6rem;
    font-weight: 700;
    color: #333;
  }
`;

const Card = styled.div`
  background-color: white;
  padding: 1.2rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const ScrollableContent = styled.div`
  overflow-y: auto;
  flex: 1;
  
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  margin: 0 0 1rem 0;
  color: #333;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;

  &::before {
    content: '';
    width: 4px;
    height: 22px;
    background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
    border-radius: 2px;
  }
`;

const HomeAc = () => {
  const [bills, setBills] = useState([]);
  const [stats, setStats] = useState({
    totalBills: 0,
    pendingBills: 0,
    paidBills: 0,
    totalInventory: 0,
    totalAccounts: 0
  });

  useEffect(() => {
    // Cargar facturas
    handleGetListBillAc()
      .then((res) => {
        const billsData = res.data || [];
        setBills(billsData);
        
        if (Array.isArray(billsData)) {
          const total = billsData.length;
          const pending = billsData.filter(b => b.estado_factura === 'pendiente' || b.estado_factura === 'sin pagar').length;
          const paid = billsData.filter(b => b.estado_factura === 'pagado' || b.estado_factura === 'pagada').length;
          
          setStats(prev => ({ 
            ...prev, 
            totalBills: total,
            pendingBills: pending,
            paidBills: paid
          }));
        }
      })
      .catch((err) => {
        console.log("Error obteniendo las facturas", err);
        setBills([]);
      });

    // Cargar inventario total
    handleGetListInventoryAd()
      .then((inventory) => {
        if (Array.isArray(inventory)) {
          setStats(prev => ({ ...prev, totalInventory: inventory.length }));
        }
      })
      .catch((err) => {
        console.log("Error al cargar inventario:", err);
      });

    // Cargar cuentas de pago registradas
    handleGetListPaymentAccountAd()
      .then((payments) => {
        if (Array.isArray(payments)) {
          setStats(prev => ({ ...prev, totalAccounts: payments.length }));
        }
      })
      .catch((err) => {
        console.log("Error al cargar cuentas:", err);
      });
  }, []);

  return (
    <Container>
      <Header>
        <h1>Panel de Contabilidad</h1>
        <p>Gestiona facturas, pagos y registros contables</p>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatIcon bgColor="#fff3e0" color="#f57c00">
            <FontAwesomeIcon icon={faFileInvoiceDollar} />
          </StatIcon>
          <StatInfo>
            <h3>Total Facturas</h3>
            <p>{stats.totalBills}</p>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon bgColor="#ffebee" color="#d32f2f">
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </StatIcon>
          <StatInfo>
            <h3>Facturas Pendientes</h3>
            <p>{stats.pendingBills}</p>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon bgColor="#e8f5e9" color="#388e3c">
            <FontAwesomeIcon icon={faCheckCircle} />
          </StatIcon>
          <StatInfo>
            <h3>Facturas Pagadas</h3>
            <p>{stats.paidBills}</p>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon bgColor="#e3f2fd" color="#1976d2">
            <FontAwesomeIcon icon={faBoxes} />
          </StatIcon>
          <StatInfo>
            <h3>Total Inventario</h3>
            <p>{stats.totalInventory}</p>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon bgColor="#f3e5f5" color="#7b1fa2">
            <FontAwesomeIcon icon={faCreditCard} />
          </StatIcon>
          <StatInfo>
            <h3>Cuentas Registradas</h3>
            <p>{stats.totalAccounts}</p>
          </StatInfo>
        </StatCard>
      </StatsGrid>

      <Card>
        <SectionTitle>Facturas Recientes</SectionTitle>
        <ScrollableContent>
          {!Array.isArray(bills) || bills.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666", padding: "2rem 0" }}>
              No tienes ninguna factura asignada por el momento.
            </p>
          ) : (
            <ActivityListAc bills={bills} />
          )}
        </ScrollableContent>
      </Card>
    </Container>
  );
};

export default HomeAc;