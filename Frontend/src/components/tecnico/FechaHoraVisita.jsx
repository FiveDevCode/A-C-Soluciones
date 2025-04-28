import React, { useState } from "react";

function FechaHoraVisita() {
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  return (
    <div>
      <div>
        <label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            style={{ margin: "10px", border: "none" }}
          />
        </label>
        <label>
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            style={{ margin: "10px", border: "none" }}
          />
        </label>
      </div>
    </div>
  );
}

export default FechaHoraVisita;
