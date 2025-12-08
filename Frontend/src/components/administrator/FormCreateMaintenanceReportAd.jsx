import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Button, TextField, MenuItem, Alert, Checkbox, FormControlLabel } from "@mui/material";
import BaseFormModal, { FormGrid, FullWidth, EquipmentCard } from "../common/BaseFormModal";

import { handleGetListClient } from "../../controllers/common/getListClient.controller";
import { handleGetListTechnical } from "../../controllers/administrator/getTechnicalListAd.controller";
import { handleCreateMaintenanceReportAd } from "../../controllers/administrator/createMaintenanceReportAd.controller";

const FormCreateMaintenanceReportAd = ({ onClose, onSuccess }) => {
  const [clients, setClients] = useState([]);
  const [technicals, setTechnicals] = useState([]);
  const [parametrosOperacion, setParametrosOperacion] = useState([]);
  const [verificaciones, setVerificaciones] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const clientsResponse = await handleGetListClient();
      setClients(clientsResponse || []);

      const technicalResponse = await handleGetListTechnical();
      setTechnicals(technicalResponse.data || []);
    };

    fetchData();
  }, []);

  const ciudadesColombia = [
    "Bogotá, Cundinamarca",
    "Medellín, Antioquia",
    "Cali, Valle del Cauca",
    "Barranquilla, Atlántico",
    "Cartagena, Bolívar",
    "Soacha, Cundinamarca",
    "Cúcuta, Norte de Santander",
    "Soledad, Atlántico",
    "Bucaramanga, Santander",
    "Bello, Antioquia",
    "Valledupar, Cesar",
    "Villavicencio, Meta",
    "Santa Marta, Magdalena",
    "Ibagué, Tolima",
    "Montería, Córdoba",
    "Pereira, Risaralda",
    "Manizales, Caldas",
    "Pasto, Nariño",
    "Neiva, Huila",
    "Palmira, Valle del Cauca",
    "Popayán, Cauca",
    "Buenaventura, Valle del Cauca",
    "Armenia, Quindío",
    "Floridablanca, Santander",
    "Sincelejo, Sucre",
    "Itagüí, Antioquia",
    "Tumaco, Nariño",
    "Envigado, Antioquia",
    "Dosquebradas, Risaralda",
    "Tuluá, Valle del Cauca",
    "Barrancabermeja, Santander",
    "Riohacha, La Guajira",
    "Uribia, La Guajira",
    "Maicao, La Guajira",
    "Piedecuesta, Santander",
    "Tunja, Boyacá",
    "Yopal, Casanare",
    "Florencia, Caquetá",
    "Girón, Santander",
    "Facatativá, Cundinamarca",
    "Jamundí, Valle del Cauca",
    "Fusagasugá, Cundinamarca",
    "Mosquera, Cundinamarca",
    "Chía, Cundinamarca",
    "Zipaquirá, Cundinamarca",
    "Rionegro, Antioquia",
    "Malambo, Atlántico",
    "Magangué, Bolívar",
    "Madrid, Cundinamarca",
    "Cartago, Valle del Cauca",
    "Turbo, Antioquia",
    "Quibdó, Chocó",
    "Apartadó, Antioquia",
    "Sogamoso, Boyacá",
    "Ocaña, Norte de Santander",
    "Pitalito, Huila",
    "Buga, Valle del Cauca",
    "Duitama, Boyacá",
    "Ciénaga, Magdalena",
    "Aguachica, Cesar",
    "Girardot, Cundinamarca",
    "Lorica, Córdoba",
    "Turbaco, Bolívar",
    "Ipiales, Nariño",
    "Funza, Cundinamarca",
    "Santander de Quilichao, Cauca",
    "Villa del Rosario, Norte de Santander",
    "Sahagún, Córdoba",
    "Yumbo, Valle del Cauca",
    "Cereté, Córdoba",
    "Sabanalarga, Atlántico",
    "Cajicá, Cundinamarca",
    "Arauca, Arauca",
    "Caucasia, Antioquia",
    "Los Patios, Norte de Santander",
    "Manaure, La Guajira",
    "Tierralta, Córdoba",
    "Candelaria, Valle del Cauca",
    "Acacías, Meta",
    "Sabaneta, Antioquia",
    "Montelíbano, Córdoba",
    "Caldas, Antioquia",
    "Copacabana, Antioquia",
    "Cumaribo, Vichada",
    "Santa Rosa de Cabal, Risaralda",
    "La Estrella, Antioquia",
    "Calarcá, Quindío",
    "Zona Bananera, Magdalena",
    "Arjona, Bolívar",
    "La Dorada, Caldas",
    "Garzón, Huila",
    "El Carmen de Bolívar, Bolívar",
    "Corozal, Sucre",
    "Fundación, Magdalena",
    "Granada, Meta",
    "El Banco, Magdalena",
    "La Ceja, Antioquia",
    "Espinal, Tolima",
    "Marinilla, Antioquia",
    "Puerto Asís, Putumayo",
    "Baranoa, Atlántico",
    "Galapa, Atlántico",
    "Villamaría, Caldas",
    "Agustín Codazzi, Cesar",
    "Plato, Magdalena",
    "Planeta Rica, Córdoba",
    "Saravena, Arauca",
    "El Carmen de Viboral, Antioquia",
    "La Plata, Huila",
    "Chigorodó, Antioquia",
    "San Marcos, Sucre",
    "Ciénaga de Oro, Córdoba",
    "Mocoa, Putumayo",
    "San Gil, Santander",
    "Guarne, Antioquia",
    "Tibú, Norte de Santander",
    "San José del Guaviare, Guaviare",
    "San Andrés, San Andrés y Providencia",
    "Florida, Valle del Cauca",
    "Chiquinquirá, Boyacá",
    "Arauquita, Arauca",
    "El Cerrito, Valle del Cauca",
    "Girardota, Antioquia",
    "Barbosa, Antioquia",
    "Barbacoas, Nariño",
    "El Bagre, Antioquia",
    "Tuchín, Córdoba",
    "Puerto Colombia, Atlántico",
    "Pamplona, Norte de Santander",
    "El Tambo, Cauca",
    "San Vicente del Caguán, Caquetá",
    "San Pelayo, Córdoba",
    "Chinchiná, Caldas",
    "Carepa, Antioquia",
    "La Jagua de Ibirico, Cesar",
    "Riosucio, Caldas",
    "Leticia, Amazonas",
    "San Onofre, Sucre",
    "San Juan del Cesar, La Guajira",
    "Ubaté, Cundinamarca",
    "Tame, Arauca",
    "Chaparral, Tolima",
    "Sampués, Sucre",
    "Tocancipá, Cundinamarca",
    "María La Baja, Bolívar"
  ].map(ciudad => ({ value: ciudad, label: ciudad }));

  const steps = [
    {
      title: "Información General",
      fields: [
        { name: "fecha", label: "Fecha", type: "date", required: true },
        {
          name: "id_cliente",
          label: "Cliente",
          type: "select",
          options: clients.map(c => ({
            value: c.id,
            label: `${c.numero_de_cedula} - ${c.nombre} ${c.apellido}`,
          })),
          required: true
        },
        {
          name: "id_tecnico",
          label: "Técnico",
          type: "select",
          options: technicals.map(t => ({
            value: t.id,
            label: `${t.numero_de_cedula} - ${t.nombre} ${t.apellido}`,
          })),
          required: true
        },
        { name: "ciudad", label: "Ciudad", type: "select", options: ciudadesColombia, required: true },
        { name: "direccion", label: "Dirección", type: "text", fullWidth: true, required: true },
        { name: "telefono", label: "Teléfono", type: "text", required: true },
        { name: "encargado", label: "Encargado", type: "text", required: true },
      ]
    },
    {
      title: "Información del Generador",
      fields: [
        { name: "marca_generador", label: "Marca del Generador", type: "text", required: true },
        { name: "modelo_generador", label: "Modelo del Generador", type: "text", required: true },
        { name: "kva", label: "KVA", type: "number", required: true },
        { name: "serie_generador", label: "Serie del Generador", type: "text", required: true },
      ]
    },
    {
      title: "Parámetros de Operación",
      fields: []
    },
    {
      title: "Verificaciones",
      fields: []
    },
    {
      title: "Observaciones Finales",
      fields: [
        { name: "observaciones_finales", label: "Observaciones Finales", type: "textarea", fullWidth: true, required: true },
      ]
    }
  ];

  const addParametro = () => {
    setParametrosOperacion(prev => [
      ...prev,
      {
        presion_aceite: "",
        temperatura_aceite: "",
        temperatura_refrigerante: "",
        fugas_aceite: false,
        fugas_combustible: false,
        frecuencia_rpm: "",
        voltaje_salida: ""
      }
    ]);
  };

  const updateParametro = (index, field, value) => {
    const copy = [...parametrosOperacion];
    copy[index][field] = value;
    setParametrosOperacion(copy);
  };

  const removeParametro = (index) => {
    setParametrosOperacion(prev => prev.filter((_, i) => i !== index));
  };

  const addVerificacion = () => {
    setVerificaciones(prev => [
      ...prev,
      {
        item: "",
        visto: false,
        observacion: ""
      }
    ]);
  };

  const updateVerificacion = (index, field, value) => {
    const copy = [...verificaciones];
    copy[index][field] = value;
    setVerificaciones(copy);
  };

  const removeVerificacion = (index) => {
    setVerificaciones(prev => prev.filter((_, i) => i !== index));
  };

  const renderStepContent = (step) => {
    if (step === 2) {
      return (
        <>
          <Button 
            variant="contained" 
            onClick={addParametro}
            sx={{ mb: 2 }}
          >
            Agregar Parámetro
          </Button>

          {parametrosOperacion.map((param, index) => (
            <EquipmentCard key={index}>
              <h4 style={{ marginTop: 0 }}>Parámetro #{index + 1}</h4>
              <FormGrid>
                <TextField
                  label="Presión de Aceite"
                  value={param.presion_aceite}
                  onChange={(e) => updateParametro(index, "presion_aceite", e.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Temperatura de Aceite"
                  value={param.temperatura_aceite}
                  onChange={(e) => updateParametro(index, "temperatura_aceite", e.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Temperatura de Refrigerante"
                  value={param.temperatura_refrigerante}
                  onChange={(e) => updateParametro(index, "temperatura_refrigerante", e.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Frecuencia/RPM"
                  value={param.frecuencia_rpm}
                  onChange={(e) => updateParametro(index, "frecuencia_rpm", e.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Voltaje de Salida"
                  value={param.voltaje_salida}
                  onChange={(e) => updateParametro(index, "voltaje_salida", e.target.value)}
                  fullWidth
                  size="small"
                />
                <FullWidth>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={param.fugas_aceite}
                        onChange={(e) => updateParametro(index, "fugas_aceite", e.target.checked)}
                      />
                    }
                    label="Fugas de Aceite"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={param.fugas_combustible}
                        onChange={(e) => updateParametro(index, "fugas_combustible", e.target.checked)}
                      />
                    }
                    label="Fugas de Combustible"
                  />
                </FullWidth>
              </FormGrid>
              <Button
                variant="outlined"
                color="error"
                onClick={() => removeParametro(index)}
                fullWidth
                sx={{ mt: 1 }}
              >
                Eliminar Parámetro
              </Button>
            </EquipmentCard>
          ))}

          {parametrosOperacion.length === 0 && (
            <Alert severity="info">No hay parámetros agregados. Haz clic en "Agregar Parámetro" para comenzar.</Alert>
          )}
        </>
      );
    }

    if (step === 3) {
      return (
        <>
          <Button 
            variant="contained" 
            onClick={addVerificacion}
            sx={{ mb: 2 }}
          >
            Agregar Verificación
          </Button>

          {verificaciones.map((verif, index) => (
            <EquipmentCard key={index}>
              <h4 style={{ marginTop: 0 }}>Verificación #{index + 1}</h4>
              <FormGrid>
                <FullWidth>
                  <TextField
                    label="Item"
                    value={verif.item}
                    onChange={(e) => updateVerificacion(index, "item", e.target.value)}
                    fullWidth
                    size="small"
                  />
                </FullWidth>
                <FullWidth>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={verif.visto}
                        onChange={(e) => updateVerificacion(index, "visto", e.target.checked)}
                      />
                    }
                    label="Verificado"
                  />
                </FullWidth>
                <FullWidth>
                  <TextField
                    label="Observación"
                    value={verif.observacion}
                    onChange={(e) => updateVerificacion(index, "observacion", e.target.value)}
                    fullWidth
                    multiline
                    rows={2}
                    size="small"
                  />
                </FullWidth>
              </FormGrid>
              <Button
                variant="outlined"
                color="error"
                onClick={() => removeVerificacion(index)}
                fullWidth
                sx={{ mt: 1 }}
              >
                Eliminar Verificación
              </Button>
            </EquipmentCard>
          ))}

          {verificaciones.length === 0 && (
            <Alert severity="info">No hay verificaciones agregadas. Haz clic en "Agregar Verificación" para comenzar.</Alert>
          )}
        </>
      );
    }

    return null;
  };

  const handleSubmit = async (data) => {
    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);

    await handleCreateMaintenanceReportAd({
      fecha: data.fecha,
      id_cliente: parseInt(data.id_cliente),
      id_tecnico: parseInt(data.id_tecnico),
      id_administrador: parseInt(decoded.id),
      direccion: data.direccion,
      ciudad: data.ciudad,
      telefono: data.telefono,
      encargado: data.encargado,
      marca_generador: data.marca_generador,
      modelo_generador: data.modelo_generador,
      kva: parseInt(data.kva) || null,
      serie_generador: data.serie_generador,
      observaciones_finales: data.observaciones_finales,
      parametros_operacion: parametrosOperacion,
      verificaciones
    });
  };

  return (
    <BaseFormModal
      title="Crear Reporte de Mantenimiento"
      steps={steps}
      onSubmit={handleSubmit}
      onClose={onClose}
      onSuccess={onSuccess}
      successMessage="¡Reporte de mantenimiento creado exitosamente!"
      renderStepContent={renderStepContent}
    />
  );
};

export default FormCreateMaintenanceReportAd;

