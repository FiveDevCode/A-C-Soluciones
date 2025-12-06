import { useState } from "react";
import styled from "styled-components";
import BaseHeaderSection from "../../components/common/BaseHeaderSection";
import { handleGetListPaymentAccountAd } from "../../controllers/administrator/getListPaymentAccountAd.controller";
import { handleDeletePaymentAccount } from "../../controllers/administrator/deletePaymentAccountAd.controller";
import { handleGetClient } from "../../controllers/administrator/getClientAd.controller";
import ListPaymentAccountAd from "../../components/administrator/ListPaymentAccountAd";
import ConfirmModal from "../../components/common/ConfirmModal";
import FormCreatePaymentAccountAd from "../../components/administrator/FormCreatePaymentAccountAd";
import FilterPaymentAccountAd from "../../components/administrator/FilterPaymentAccountAd";
import useDataCache from "../../hooks/useDataCache";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
  min-height: 100vh;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const Card = styled.div`
  background-color: white;
  margin: 0 auto 0 auto;
  align-self: center;
  padding: 0 20px;
  padding-bottom: 20px;
  width: 85%;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.1);

  @media (max-width: 1350px) {
    margin: 0 10px 0 10px;
    padding: 0 15px 15px 15px;
    width: 95%;
  }
`;

const PaymentAccountPage = () => {
  const { data: accounts, isLoading: loading, reload: loadAccounts } = useDataCache(
    'payment_accounts_cache',
    async () => {
      const accountsData = await handleGetListPaymentAccountAd();

      const enrichedAccounts = await Promise.all(
        accountsData.map(async (account) => {
          if (account.id_cliente) {
            try {
              const clientRes = await handleGetClient(account.id_cliente);
              return {
                ...account,
                cliente: clientRes.data,
              };
            } catch (err) {
              console.error(`Error obteniendo cliente ${account.id_cliente}:`, err);
              return account;
            }
          }
          return account;
        })
      );

      return enrichedAccounts;
    }
  );
  const [filteredAccounts, setFilteredAccounts] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);


  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) {
      alert("Selecciona al menos un registro para eliminar.");
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      for (const id of selectedIds) {
        await handleDeletePaymentAccount(id);
      }
      alert("Cuentas eliminadas correctamente.");
      setSelectedIds([]);
      loadAccounts();
    } catch (error) {
      console.error("Error al eliminar registros:", error);
      alert("Error al eliminar algunas cuentas.");
    } finally {
      setShowConfirmModal(false);
    }
  };

  return (
    <Container>
      <BaseHeaderSection
        headerTitle="CUENTAS DE PAGO"
        sectionTitle="Cuentas registradas"
        addLabel="Agregar cuenta"
        onAdd={() => setShowModal(true)}
        onDeleteSelected={handleDeleteSelected}
        onRefresh={loadAccounts}
        selectedCount={selectedIds.length}
        filterComponent={
          <FilterPaymentAccountAd
            accounts={accounts}
            onFilteredChange={setFilteredAccounts}
          />
        }
      />

      <Card>
        {loading ? (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            Cargando cuentas...
          </p>
        ) : (
          <ListPaymentAccountAd
            accounts={filteredAccounts}
            reloadData={loadAccounts}
            onSelectRows={(rows) => setSelectedIds(rows.map((r) => r.id))}
          />
        )}
      </Card>

      {showModal && (
        <FormCreatePaymentAccountAd
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            loadAccounts();
          }}
        />
      )}

      {showConfirmModal && (
        <ConfirmModal
          message={`¿Está seguro de que desea eliminar ${selectedIds.length} cuenta(s)? Esta acción no se puede deshacer.`}
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </Container>
  );
};

export default PaymentAccountPage;
