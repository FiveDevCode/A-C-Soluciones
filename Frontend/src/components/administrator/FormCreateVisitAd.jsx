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
  const [selectedServicio, setSelectedServicio] = useState(null);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [preservedFormData, setPreservedFormData] = useState({});
  const [fechaMinima, setFechaMinima] = useState(null);
  const [fechaMaxima, setFechaMaxima] = useState(null);

  useEffect(() => {
    handleGetListTechnical().then(res => setTechnicalList(res.data)).catch(console.error);
    handleGetListRequest().then(res => setRequestList(res.data)).catch(console.error);
    handleGetListServiceAd().then(res => setServiceList(res)).catch(console.error);
  }, []);

  const fields = [
    { name: "notas", label: "Notas", type: "textarea" },
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
      options: requestList.map(r => ({ 
        value: r.id, 
        label: `${r.id} - ${r.descripcion.slice(0,50)}`,
        servicioId: r.servicio_id_fk // Guardar el ID del servicio asociado
      })),
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
      required: true,
      disabled: !!selectedServicio // Deshabilitar si ya se seleccionó automáticamente
    },
    { 
      name: "fecha_programada", 
      label: "Fecha programada", 
      type: "datetime-local", 
      required: true,
      disabled: !selectedTecnico || !selectedSolicitud,
      inputProps: {
        min: fechaMinima,
        max: fechaMaxima
      },
      helperText: fechaMinima && fechaMaxima 
        ? `Rango: ${new Date(fechaMinima).toLocaleDateString()} - ${new Date(fechaMaxima).toLocaleDateString()}`
        : 'Primero selecciona una solicitud',
      // ✅ AGREGAR RESTRICCIÓN DE HORARIO
      timeRange: {
        minHour: 8,  // 8:00 AM
        maxHour: 18  // 6:00 PM (última hora válida es 17:59)
      }
    },
  ];

  const handleSubmit = async (data) => {
    await handleCreateVisit(
      data.duracion_estimada,
      data.notas,
      data.fecha_programada,
      data.solicitud,
      data.tecnico,
      data.servicio
    );
  };

  // Preparar customFormData con todos los valores preservados
  const customData = {
    ...preservedFormData,
    ...(selectedServicio ? { servicio: selectedServicio } : {}),
    ...(selectedSolicitud ? { solicitud: selectedSolicitud } : {})
  };

  return (
    <BaseFormModal
      key={formKey}
      title="Asignar visita"
      fields={fields}
      onSubmit={handleSubmit}
      onClose={onClose}
      onSuccess={onSuccess}
      successMessage="¡Visita asignada exitosamente!"
      customFormData={customData}
      onFieldChange={(name, value) => {
        // Preservar todos los valores del formulario
        setPreservedFormData(prev => ({ ...prev, [name]: value }));
        
        if (name === 'tecnico') setSelectedTecnico(value);
        if (name === 'fecha_programada') setSelectedFecha(value);
        if (name === 'duracion_estimada') setSelectedDuracion(value);
        
        // Cuando se selecciona una solicitud, auto-seleccionar el servicio
        if (name === 'solicitud') {
          setSelectedSolicitud(value);
          const selectedRequest = requestList.find(r => r.id === value);
          console.log('Solicitud seleccionada:', selectedRequest);
          
          if (selectedRequest) {
            // Auto-seleccionar servicio
            if (selectedRequest.servicio_id_fk) {
              console.log('Servicio ID encontrado:', selectedRequest.servicio_id_fk);
              setSelectedServicio(selectedRequest.servicio_id_fk);
            }
            
            // Calcular rango de fechas (fecha_solicitud + 7 días)
            if (selectedRequest.fecha_solicitud) {
              const fechaSolicitud = new Date(selectedRequest.fecha_solicitud);
              
              // Fecha mínima: la fecha que solicitó el cliente
              const minDate = new Date(fechaSolicitud);
              minDate.setHours(8, 0, 0, 0); // 8:00 AM
              
              // Fecha máxima: 7 días después de la fecha solicitada
              const maxDate = new Date(fechaSolicitud);
              maxDate.setDate(maxDate.getDate() + 7);
              maxDate.setHours(18, 0, 0, 0); // 6:00 PM
              
              setFechaMinima(minDate.toISOString().slice(0, 16)); // formato datetime-local
              setFechaMaxima(maxDate.toISOString().slice(0, 16));
              
              console.log('Rango de fechas:', {
                min: minDate.toLocaleDateString(),
                max: maxDate.toLocaleDateString()
              });
            }
            
            setFormKey(prev => prev + 1); // Forzar re-render del formulario
          }
        }
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