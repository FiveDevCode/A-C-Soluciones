import { use, useEffect, useState } from "react";
import { handleGetVisit } from "../../controllers/administrator/getVisitAd.controller";
import BaseEditModal from "../common/BaseEditModalAd";
import { handleGetListTechnical } from "../../controllers/administrator/getTechnicalListAd.controller";
import { handleGetListRequest } from "../../controllers/administrator/getListRequestAd.controller";
import { handleGetListServiceAd } from "../../controllers/administrator/getListServiceAd.controller";
import { handleUpdateVisitAd } from "../../controllers/administrator/updateVisitAd.controller";

const EditVisitAd = ({ selected, onClose, onSuccess }) => {
  const [visitData, setVisitData] = useState(null);
  const [technicalList, setTechnicalList] = useState([]);
  const [requestList, setRequestList] = useState([]);
  const [serviceList, setServiceList] = useState([]);


  const formatDateTimeLocal = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16); // YYYY-MM-DDTHH:mm
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

        // Luego cargar la visita
        if (selected?.id) {
          const visitRes = await handleGetVisit(selected.id);
          setVisitData(visitRes.data.data);
        }
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };

    cargarDatos();
  }, [selected]);
  
  if (!visitData) return null; // No mostrar nada mientras carga

  const fields = [
    { name: "notas_previas", label: "Notas previas", type: "textarea" },
    { name: "notas_posteriores", label: "Notas posteriores", type: "textarea" },
    { name: "duracion_estimada", label: "Duración estimada", type: "number" },
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
    { name: "fecha_programada", label: "Fecha programada", type: "datetime-local" },
  ];

  const initialData = {
    notas_previas: visitData.notas_previas || "",
    notas_posteriores: visitData.notas_posteriores || "",
    duracion_estimada: visitData.duracion_estimada || "",
    solicitud_id_fk: visitData.solicitud?.id || "",
    tecnico_id_fk: visitData.tecnico?.id || "",
    servicio_id_fk: visitData.servicio_id_fk && serviceList.some(s => s.id === visitData.servicio_id_fk) 
      ? visitData.servicio_id_fk 
      : "",
    fecha_programada: formatDateTimeLocal(visitData.fecha_programada),
  };

  const handleSubmit = async (data) => {
    await handleUpdateVisitAd(selected.id, data);
  };

  return (
    <BaseEditModal
      title={`Editar visita: ${visitData.tecnico?.nombre || ""} - ${visitData.servicio?.nombre || ""}`}
      fields={fields}
      initialData={initialData}
      onSubmit={handleSubmit}
      onClose={onClose}
      onSuccess={onSuccess}
      successMessage="¡Visita actualizada exitosamente!"
    />
  );
};

export default EditVisitAd;
