import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import BaseFormModal from "../common/BaseFormModal";

import { handleCreateMaintenanceReportAd } from "../../controllers/administrator/createMaintenanceReportAd.controller";
import { handleGetListClient } from "../../controllers/common/getListClient.controller";
import { handleGetListTechnical } from "../../controllers/administrator/getTechnicalListAd.controller";

const FormCreateMaintenanceReportAd = ({ onClose, onSuccess }) => {
  const [clients, setClients] = useState([]);
  const [technicals, setTechnicals] = useState([]);
  const [verificaciones, setVerificaciones] = useState([]);

  const addVerificacion = () => {
    setVerificaciones([
      ...verificaciones,
      { item: "", visto: false, observacion: "" }
    ]);
  };

  const updateVerificacion = (index, field, value) => {
    const copy = [...verificaciones];
    copy[index][field] = value;
    setVerificaciones(copy);
  };

  const removeVerificacion = (index) => {
    setVerificaciones(verificaciones.filter((_, i) => i !== index));
  };

  // Cargar selects
  useEffect(() => {
    const fetchData = async () => {
      const clientsResponse = await handleGetListClient();
      setClients(clientsResponse || []);

      const technicalResponse = await handleGetListTechnical();
      setTechnicals(technicalResponse.data || []);
    };

    fetchData();
  }, []);

  const fields = [
    { name: "fecha", label: "Fecha", type: "date" },
    {
      name: "id_cliente",
      label: "Cliente",
      type: "select",
      options: clients.map(c => ({
        value: c.id,
        label: `${c.numero_de_cedula} - ${c.nombre} ${c.apellido}`,
      })),
    },
    {
      name: "id_tecnico",
      label: "Técnico",
      type: "select",
      options: technicals.map(t => ({
        value: t.id,
        label: `${t.numero_de_cedula} - ${t.nombre} ${t.apellido}`,
      })),
    },
    { name: "direccion", label: "Dirección", type: "text" },
    { name: "ciudad", label: "Ciudad", type: "text" },
    { name: "telefono", label: "Teléfono", type: "text" },
    { name: "encargado", label: "Encargado", type: "text" },
    { name: "marca_generador", label: "Marca generador", type: "text" },
    { name: "modelo_generador", label: "Modelo generador", type: "text" },
    { name: "kva", label: "KVA", type: "number" },
    { name: "serie_generador", label: "Serie generador", type: "text" },
    {
      name: "observaciones_finales",
      label: "Observaciones finales",
      type: "textarea",
    },
  ];

  const handleSubmit = async (data) => {
    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);

    const reporte = await handleCreateMaintenanceReportAd({
      ...data,
      id_administrador: parseInt(decoded.id),
      verificaciones
    });
  };

  return (
    <BaseFormModal
      title="Crear reporte de mantenimiento"
      fields={fields}
      onSubmit={handleSubmit}
      onClose={onClose}
      onSuccess={onSuccess}
      successMessage="¡Reporte registrado exitosamente!"
      extraContent={
        <div
          style={{
            marginTop: "70px",
            alignItems: "start",
            alignSelf: "flex-start",
          }}
        >
          {/* Columna izquierda: vacío para ocupar el espacio del formulario */}
          <div></div>

          {/* Columna derecha: las verificaciones */}
          <div
            style={{
              background: "#f9f9f9",
              padding: "15px",
              borderRadius: "10px",
              border: "1px solid #ddd",
            }}
          >
            <h3 style={{ marginBottom: "8px", fontWeight: "600" }}>Verificaciones</h3>

            {verificaciones.map((v, i) => (
              <div
                key={i}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  borderRadius: "6px",
                  marginBottom: "10px",
                  background: "white",
                }}
              >
                <input
                  type="text"
                  placeholder="Item"
                  value={v.item}
                  style={{ width: "100%", marginBottom: "6px" }}
                  onChange={(e) => updateVerificacion(i, "item", e.target.value)}
                />

                <textarea
                  placeholder="Observación"
                  value={v.observacion}
                  style={{ width: "100%" }}
                  onChange={(e) =>
                    updateVerificacion(i, "observacion", e.target.value)
                  }
                />

                <label
                  style={{ display: "flex", alignItems: "center", marginTop: "6px" }}
                >
                  <input
                    type="checkbox"
                    checked={v.visto}
                    onChange={(e) =>
                      updateVerificacion(i, "visto", e.target.checked)
                    }
                  />
                  <span style={{ marginLeft: "6px" }}>Visto</span>
                </label>

                <button
                  style={{
                    marginTop: "8px",
                    background: "#e63946",
                    color: "white",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => removeVerificacion(i)}
                >
                  Eliminar
                </button>
              </div>
            ))}

            <button
              onClick={addVerificacion}
              style={{
                background: "#007bff",
                color: "white",
                border: "none",
                padding: "8px 12px",
                borderRadius: "4px",
                cursor: "pointer",
                width: "100%",
                marginTop: "10px",
              }}
            >
              Agregar verificación
            </button>
          </div>
        </div>
      }
    />
  );
};

export default FormCreateMaintenanceReportAd;

