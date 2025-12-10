import React, { use, useEffect, useState, useRef } from "react";
import { handleGetVisit } from "../../controllers/administrator/getVisitAd.controller";
import BaseEditModal from "../common/BaseEditModalAd";
import { handleGetListTechnical } from "../../controllers/administrator/getTechnicalListAd.controller";
import { handleGetListRequest } from "../../controllers/administrator/getListRequestAd.controller";
import { handleGetListServiceAd } from "../../controllers/administrator/getListServiceAd.controller";
import { handleUpdateVisitAd } from "../../controllers/administrator/updateVisitAd.controller";
import DisponibilidadTecnico from "./DisponibilidadTecnico";
import ConfirmModal from "../common/ConfirmModal";

const EditVisitAd = ({ selected, onClose, onSuccess }) => {
  const selectedIdRef = useRef(selected?.id);
  const [visitData, setVisitData] = useState(null);
  const [technicalList, setTechnicalList] = useState([]);
  const [requestList, setRequestList] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [selectedTecnico, setSelectedTecnico] = useState(null);
  const [selectedFecha, setSelectedFecha] = useState(null);
  const [selectedDuracion, setSelectedDuracion] = useState(null);
  const [estadoBloqueado, setEstadoBloqueado] = useState(false);
  const [showConfirmEstado, setShowConfirmEstado] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState(null);
  const [estadoActual, setEstadoActual] = useState(null);
  const [estadoAnterior, setEstadoAnterior] = useState(null);


  const formatDateTimeLocal = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    // Usar UTC para evitar conversión de zona horaria
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Cargar todas las listas primero
        const [technicalRes, requestRes, serviceRes] = await Promise.all([
          handleGetListTechnical(),
          handleGetListRequest(),
          handleGetListServiceAd()
        ]);

        setTechnicalList(technicalRes.data);
        setRequestList(requestRes.data);
        setServiceList(serviceRes);

        // Luego cargar la visita usando el ID guardado en el ref
        if (selectedIdRef.current) {
          const visitRes = await handleGetVisit(selectedIdRef.current);
          const vData = visitRes.data.data;
          setVisitData(vData);
          // Inicializar los valores seleccionados
          setSelectedTecnico(vData.tecnico_id_fk);
          setSelectedFecha(vData.fecha_programada);
          setSelectedDuracion(vData.duracion_estimada);
          setEstadoActual(vData.estado);
          setEstadoAnterior(vData.estado);
          
          // Bloquear automáticamente si ya está en estado completada o cancelada
          const estadosCriticos = ['completada', 'cancelada'];
          if (estadosCriticos.includes(vData.estado)) {
            setEstadoBloqueado(true);
          }
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };

    cargarDatos();
  }, []);

  const estadosVisita = React.useMemo(() => [
    { value: "programada", label: "Programada" },
    { value: "en_camino", label: "En camino" },
    { value: "iniciada", label: "Iniciada" },
    { value: "completada", label: "Completada" },
    { value: "cancelada", label: "Cancelada" }
  ], []);

  // Crear fields dinámicamente para que refleje el estado actual de estadoBloqueado
  const fields = React.useMemo(() => [
    { name: "notas", label: "Notas", type: "textarea" },
    { 
      name: "duracion_estimada", 
      label: "Duración estimada (minutos)", 
      type: "number",
      inputProps: { min: 1, step: 1 }
    },
    {
      name: "solicitud_id_fk",
      label: "Solicitudes",
      type: "autocomplete",
      options: requestList.map(r => ({ value: r.id, label: `${r.id} - ${r.descripcion.slice(0,50)}` }))
    },
    {
      name: "tecnico_id_fk",
      label: "Técnico",
      type: "autocomplete",
      options: technicalList.map(t => ({ value: t.id, label: `${t.numero_de_cedula} - ${t.nombre} ${t.apellido}` }))
    },
    {
      name: "servicio_id_fk",
      label: "Servicio",
      type: "autocomplete",
      options: serviceList.map(s => ({ value: s.id, label: `${s.nombre}` }))
    },
    { 
      name: "fecha_programada", 
      label: "Fecha programada", 
      type: "datetime-local",
      disabled: !selectedTecnico 
    },
    {
      name: "estado",
      label: "Estado",
      type: "select",
      options: estadosVisita,
      disabled: estadoBloqueado,
      requiresConfirmation: true
    }
  ], [requestList, technicalList, serviceList, selectedTecnico, estadoBloqueado, estadosVisita]);

  // Memorizar initialData para que solo se cree una vez con visitData
  const initialData = React.useMemo(() => {
    if (!visitData) return {};
    return {
      notas: visitData.notas || "",
      duracion_estimada: visitData.duracion_estimada || "",
      solicitud_id_fk: visitData.solicitud_id_fk || "",
      tecnico_id_fk: visitData.tecnico_id_fk || "",
      servicio_id_fk: visitData.servicio_id_fk || "",
      fecha_programada: formatDateTimeLocal(visitData.fecha_programada),
      estado: visitData.estado || "programada",
    };
  }, [visitData]);
  
  if (!visitData) return null; // No mostrar nada mientras carga

  const handleConfirmEstado = () => {
    // Confirmar el cambio de estado - no actualizar estadoActual aquí
    // porque eso recrearía el initialData y resetearía el formulario
    setEstadoBloqueado(true);
    setShowConfirmEstado(false);
  };

  const handleCancelEstado = () => {
    // Cerrar el modal sin hacer cambios
    setShowConfirmEstado(false);
    setNuevoEstado(null);
  };

  const handleFieldChange = (name, value) => {
    // Actualizar estados internos
    if (name === 'tecnico_id_fk') setSelectedTecnico(value);
    if (name === 'fecha_programada') setSelectedFecha(value);
    if (name === 'duracion_estimada') setSelectedDuracion(value);
    
    // Interceptar cambios de estado para completada y cancelada
    if (name === 'estado' && !estadoBloqueado) {
      const estadosQueRequierenConfirmacion = ['completada', 'cancelada'];
      if (estadosQueRequierenConfirmacion.includes(value) && value !== visitData.estado) {
        setNuevoEstado(value);
        setShowConfirmEstado(true);
      }
    }
  };

  const handleSubmit = async (data) => {
    // Si hay un estado pendiente de confirmación, no permitir submit
    if (showConfirmEstado) {
      return false;
    }
    
    // Continuar con el submit normal
    await handleUpdateVisitAd(selectedIdRef.current, data);
  };

  const getEstadoLabel = (estado) => {
    const estadoObj = estadosVisita.find(e => e.value === estado);
    return estadoObj ? estadoObj.label : estado;
  };

  return (
    <>
      <BaseEditModal
        title={`Editar visita: ${visitData.tecnico?.nombre || ""} - ${visitData.servicio?.nombre || ""}`}
        fields={fields}
        initialData={initialData}
        onSubmit={handleSubmit}
        onClose={onClose}
        onSuccess={onSuccess}
        successMessage="¡Visita actualizada exitosamente!"
        enableScroll={true}
        onFieldChange={handleFieldChange}
        additionalContent={
          <DisponibilidadTecnico 
            tecnicoId={selectedTecnico} 
            fecha={selectedFecha}
            duracionEstimada={selectedDuracion}
          />
        }
      />
      
      {showConfirmEstado && (
        <ConfirmModal
          message={`¿Está seguro de cambiar el estado a "${getEstadoLabel(nuevoEstado)}"? Esta acción no se puede deshacer y el campo quedará bloqueado.`}
          onConfirm={handleConfirmEstado}
          onCancel={handleCancelEstado}
        />
      )}
    </>
  );
};

export default React.memo(EditVisitAd);
