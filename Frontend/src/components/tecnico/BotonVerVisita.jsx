import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";



function BotonVerVisitas() {
  const estiloBoton = {
    padding: "10px 15px",
    fontSize: "16px",
    fontWeight: "bold",
    backgroundColor: "white",
    color: "#000",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  };

  return (
    <button style={estiloBoton}>
      <FontAwesomeIcon icon={faArrowRight} />
      <span> ver</span>
    </button>
  );
}

export default BotonVerVisitas;
