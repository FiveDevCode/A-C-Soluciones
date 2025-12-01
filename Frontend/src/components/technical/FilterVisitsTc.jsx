import { useMemo } from "react";
import BaseFilters from "../common/BaseFilters";

const FilterVisitsTc = ({ visits = [], onFilteredChange }) => {
  
  const mappedVisits = useMemo(() => {
    return visits.map(v => ({
      ...v,
      servicioNombre: v.servicio?.nombre || '',
      servicioDescripcion: v.servicio?.descripcion || '',
    }));
  }, [visits]);

  const statusLabels = {
    programada: "Programada",
    iniciada: "Iniciada",
    en_camino: "En Camino",
    completada: "Completada",
    cancelada: "Cancelada",
  };

  const statusOptions = [...new Set(visits.map((v) => v.estado).filter(Boolean))].map(
    (st) => ({
      value: st,
      label: statusLabels[st] || st,
    })
  );

  const filterOptions = [
    {
      key: "estado",
      label: "Estado de la visita",
      options: statusOptions,
    },
  ];

  return (
    <BaseFilters
      data={mappedVisits}
      placeholder="Buscar por servicio, descripción o notas..."
      filterOptions={filterOptions}
      searchKeys={[
        "servicio.nombre",
        "servicioNombre",
        "servicio.descripcion",
        "servicioDescripcion",
        "notas_previas",
        "notas_posteriores",
      ]}
      onFilteredChange={onFilteredChange}
    />
  );
};

export default FilterVisitsTc;

