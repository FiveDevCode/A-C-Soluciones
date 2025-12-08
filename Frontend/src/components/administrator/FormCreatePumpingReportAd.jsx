import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Button, TextField, MenuItem, Alert } from "@mui/material";
import BaseFormModal, { FormGrid, FullWidth, EquipmentCard } from "../common/BaseFormModal";

import { handleGetListClient } from "../../controllers/common/getListClient.controller";
import { handleGetListTechnical } from "../../controllers/administrator/getTechnicalListAd.controller";
import { handleCreatePumpingReportAd } from "../../controllers/administrator/createPumpingReportAd.controller";

const FormCreatePumpingReportAd = ({ onClose, onSuccess }) => {
  const [clients, setClients] = useState([]);
  const [technicals, setTechnicals] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [parametrosLinea, setParametrosLinea] = useState({
    voltaje_linea: "",
    corriente_linea: "",
    presion_succion: "",
    presion_descarga: "",
    observaciones: ""
  });

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
          name: "cliente_id",
          label: "Cliente",
          type: "autocomplete",
          options: clients.map(c => ({
            value: c.id,
            label: `${c.numero_de_cedula} - ${c.nombre} ${c.apellido}`,
          })),
          required: true
        },
        {
          name: "tecnico_id",
          label: "Técnico",
          type: "autocomplete",
          options: technicals.map(t => ({
            value: t.id,
            label: `${t.numero_de_cedula} - ${t.nombre} ${t.apellido}`,
          })),
          required: true
        },
        {
          name: "ciudad",
          label: "Ciudad",
          type: "autocomplete",
          options: ciudadesColombia,
          required: true
        },
        { name: "direccion", label: "Dirección", type: "text", fullWidth: true, required: true },
        { name: "telefono", label: "Teléfono", type: "text", required: true },
        { name: "encargado", label: "Encargado", type: "text", required: true },
        { name: "observaciones_finales", label: "Observaciones Finales", type: "textarea", fullWidth: true, required: true },
      ]
    },
    {
      title: "Equipos de Bombeo",
      fields: []
    },
    {
      title: "Parámetros de Línea",
      fields: []
    }
  ];

  const addEquipo = () => {
    setEquipos(prev => [
      ...prev,
      {
        equipo: "",
        marca: "",
        amperaje: "",
        presion: "",
        temperatura: "",
        estado: "",
        observacion: ""
      }
    ]);
  };

  const updateEquipo = (index, field, value) => {
    const copy = [...equipos];
    copy[index][field] = value;
    setEquipos(copy);
  };

  const removeEquipo = (index) => {
    setEquipos(prev => prev.filter((_, i) => i !== index));
  };

  const updateParametros = (field, value) => {
    setParametrosLinea(prev => ({ ...prev, [field]: value }));
  };

  const renderStepContent = (step) => {
    if (step === 1) {
      return (
        <>
          <Button 
            variant="contained" 
            onClick={addEquipo}
            sx={{ mb: 2 }}
          >
            Agregar Equipo
          </Button>

          {equipos.map((equipo, index) => (
            <EquipmentCard key={index}>
              <h4 style={{ marginTop: 0 }}>Equipo #{index + 1}</h4>
              <FormGrid>
                <TextField
                  label="Equipo"
                  value={equipo.equipo}
                  onChange={(e) => updateEquipo(index, "equipo", e.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Marca"
                  value={equipo.marca}
                  onChange={(e) => updateEquipo(index, "marca", e.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Amperaje"
                  value={equipo.amperaje}
                  onChange={(e) => updateEquipo(index, "amperaje", e.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Presión"
                  value={equipo.presion}
                  onChange={(e) => updateEquipo(index, "presion", e.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Temperatura"
                  value={equipo.temperatura}
                  onChange={(e) => updateEquipo(index, "temperatura", e.target.value)}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Estado"
                  value={equipo.estado}
                  onChange={(e) => updateEquipo(index, "estado", e.target.value)}
                  fullWidth
                  size="small"
                />
                <FullWidth>
                  <TextField
                    label="Observación"
                    value={equipo.observacion}
                    onChange={(e) => updateEquipo(index, "observacion", e.target.value)}
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
                onClick={() => removeEquipo(index)}
                fullWidth
                sx={{ mt: 1 }}
              >
                Eliminar Equipo
              </Button>
            </EquipmentCard>
          ))}

          {equipos.length === 0 && (
            <Alert severity="info">No hay equipos agregados. Haz clic en "Agregar Equipo" para comenzar.</Alert>
          )}
        </>
      );
    }

    if (step === 2) {
      return (
        <FormGrid>
          <TextField
            label="Voltaje Línea"
            value={parametrosLinea.voltaje_linea}
            onChange={(e) => updateParametros("voltaje_linea", e.target.value)}
            fullWidth
          />
          <TextField
            label="Corriente Línea"
            value={parametrosLinea.corriente_linea}
            onChange={(e) => updateParametros("corriente_linea", e.target.value)}
            fullWidth
          />
          <TextField
            label="Presión Succión"
            value={parametrosLinea.presion_succion}
            onChange={(e) => updateParametros("presion_succion", e.target.value)}
            fullWidth
          />
          <TextField
            label="Presión Descarga"
            value={parametrosLinea.presion_descarga}
            onChange={(e) => updateParametros("presion_descarga", e.target.value)}
            fullWidth
          />
          <FullWidth>
            <TextField
              label="Observaciones"
              value={parametrosLinea.observaciones}
              onChange={(e) => updateParametros("observaciones", e.target.value)}
              fullWidth
              multiline
              rows={3}
            />
          </FullWidth>
        </FormGrid>
      );
    }

    return null;
  };

  const handleSubmit = async (data) => {
    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);

    await handleCreatePumpingReportAd({
      fecha: data.fecha,
      cliente_id: parseInt(data.cliente_id),
      tecnico_id: parseInt(data.tecnico_id),
      administrador_id: parseInt(decoded.id),
      direccion: data.direccion,
      ciudad: data.ciudad,
      telefono: data.telefono,
      encargado: data.encargado,
      observaciones_finales: data.observaciones_finales,
      equipos,
      parametrosLinea
    });
  };

  return (
    <BaseFormModal
      title="Crear Reporte de Bombeo"
      steps={steps}
      onSubmit={handleSubmit}
      onClose={onClose}
      onSuccess={onSuccess}
      successMessage="¡Reporte de bombeo creado exitosamente!"
      renderStepContent={renderStepContent}
    />
  );
};

export default FormCreatePumpingReportAd;
