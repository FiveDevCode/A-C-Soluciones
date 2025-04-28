import { useState } from "react";

function SelectorEstadoVisitas() {
  const [opcion, setOpcion] = useState("Pendiente");

  const selectorEstadoVisita = (e) => {
    setOpcion(e.target.value);
  };

  return (
    <div>
      <select style={{padding: "8px 45px"}}>
        <option value="Pendiente">Pendiente</option>
        <option value="Asignada">Asignada</option>
      </select>
    </div>
  );
}

export default SelectorEstadoVisitas;
