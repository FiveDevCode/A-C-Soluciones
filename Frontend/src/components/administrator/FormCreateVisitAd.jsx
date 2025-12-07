import BaseFormModal from "../common/BaseFormModal";
import { handleCreateVisit } from "../../controllers/administrator/createVisitAd.controller";
import { useEffect, useState } from "react";
import { handleGetListTechnical } from "../../controllers/administrator/getTechnicalListAd.controller";
import { handleGetListRequest } from "../../controllers/administrator/getListRequestAd.controller";
import { handleGetListServiceAd } from "../../controllers/administrator/getListServiceAd.controller";
import DisponibilidadTecnico from "./DisponibilidadTecnico";

const FormAssignVisitAd = ({ onClose, onSuccess }) => {
  const [technicalList, setTechnicalList] = useState([]);
  const [requestList, setRequestList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [selectedTecnico, setSelectedTecnico] = useState(null);
  const [selectedFecha, setSelectedFecha] = useState(null);
  const [selectedDuracion, setSelectedDuracion] = useState(null);

  useEffect(() => {
    handleGetListTechnical().then(res => setTechnicalList(res.data)).catch(console.error);
    handleGetListRequest().then(res => setRequestList(res.data)).catch(console.error);
    handleGetListServiceAd().then(res => setServiceList(res)).catch(console.error);
  }, []);

  const fields = [
    { name: "notas_previas", label: "Notas previas", type: "textarea" },
    { name: "notas_posteriores", label: "Notas posteriores", type: "textarea" },
    { 
      name: "duracion_estimada", 
      label: "Duración estimada (minutos)", 
      type: "number",
      required: true,
      inputProps: { min: 1, step: 1 }
    },
    { 
      name: "solicitud", 
      label: "Solicitudes", 
      type: "autocomplete", 
      options: requestList.map(r => ({ value: r.id, label: `${r.id} - ${r.descripcion.slice(0,50)}` })),
      required: true
    },
    { 
      name: "tecnico", 
      label: "Técnico", 
      type: "autocomplete", 
      options: technicalList.map(t => ({ value: t.id, label: `${t.numero_de_cedula} - ${t.nombre} ${t.apellido}` })),
      required: true
    },
    { 
      name: "servicio", 
      label: "Servicio", 
      type: "autocomplete", 
      options: serviceList.map(s => ({ value: s.id, label: `${s.nombre} - ${s.descripcion.slice(0,50)}` })),
      required: true
    },
    { 
      name: "fecha_programada", 
      label: "Fecha programada", 
      type: "datetime-local", 
      required: true,
      disabled: !selectedTecnico 
    },
  ];

  const handleSubmit = async (data) => {
    await handleCreateVisit(
      data.duracion_estimada,
      data.notas_previas,
      data.notas_posteriores,
      data.fecha_programada,
      data.solicitud,
      data.tecnico,
      data.servicio
    );
  };

  return (
    <BaseFormModal
      title="Asignar visita"
      fields={fields}
      onSubmit={handleSubmit}
      onClose={onClose}
      onSuccess={onSuccess}
      successMessage="¡Visita asignada exitosamente!"
      onFieldChange={(name, value) => {
        if (name === 'tecnico') setSelectedTecnico(value);
        if (name === 'fecha_programada') setSelectedFecha(value);
        if (name === 'duracion_estimada') setSelectedDuracion(value);
      }}
      additionalContent={
        <DisponibilidadTecnico 
          tecnicoId={selectedTecnico} 
          fecha={selectedFecha}
          duracionEstimada={selectedDuracion}
          defaultExpanded={true}
        />
      }
    />
  );
};

export default FormAssignVisitAd;
