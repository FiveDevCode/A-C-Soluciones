import { useMemo } from "react";
import BaseFilters from "../common/BaseFilters";

const FilterVisitsAd = ({ visits = [], onFilteredChange }) => {
  
  const mappedVisits = useMemo(() => {
    return visits.map(v => ({
      ...v,
      tecnicoNombreCompleto: v.tecnico_asociado 
        ? `${v.tecnico_asociado.nombre} ${v.tecnico_asociado.apellido}`.toLowerCase()
        : '',
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
      placeholder="Buscar por técnico, descripción o notas..."
      filterOptions={filterOptions}
      searchKeys={[
        "tecnico_asociado.nombre",
        "tecnico_asociado.apellido",
        "tecnicoNombreCompleto",
        "solicitud_asociada.descripcion",
        "notas_previas",
        "notas_posteriores",
      ]}
      onFilteredChange={onFilteredChange}
    />
  );
};

export default FilterVisitsAd;
