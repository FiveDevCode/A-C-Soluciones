import { useMemo } from "react";
import BaseFilters from "../common/BaseFilters";

const FilterVisitsAd = ({ visits = [], onFilteredChange }) => {
  
  const mappedVisits = useMemo(() => {
    return visits.map(v => ({
      ...v,
      tecnicoNombreCompleto: `${v.tecnico.nombre} ${v.tecnico.apellido}`.toLowerCase(),
    }));
  }, [visits]);

  const filterOptions = [
    {
      key: "estado",
      label: "Estado",
      options: ["programada", "iniciada", "completada", "cancelada"],
    },
  ];

  return (
    <BaseFilters
      data={mappedVisits}
      placeholder="Buscar por técnico, descripción o notas..."
      filterOptions={filterOptions}
      searchKeys={[
        "tecnico.nombre",
        "tecnico.apellido",
        "tecnicoNombreCompleto",
        "solicitud.descripcion",
        "notas_previas",
        "notas_posteriores",
      ]}
      onFilteredChange={onFilteredChange}
    />
  );
};

export default FilterVisitsAd;
