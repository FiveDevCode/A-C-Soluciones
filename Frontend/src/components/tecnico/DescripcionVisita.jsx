import { useState } from "react";

function DescripcionVisitas() {
  const [descripcion, setDescripcion] = useState("Descripción inicial");

  const handleChange = (e) => {
    setDescripcion(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        value={descripcion}
        onChange={handleChange}
        style={{
          padding: "8px 100px 8px 5px",
          fontSize: "16px",
          border:"none", 
        }}
      />
    </div>
  );
}

export default DescripcionVisitas;
