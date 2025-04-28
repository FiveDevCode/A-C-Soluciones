function BotonGenerarReporte({ onClick }) {
    const estiloBoton = {
      backgroundColor: "#3399ff",
      color: "white",
      padding: "8px 80px",
      fontSize: "16px",
      fontWeight: "bold",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer"
    };
  
    return (
      <button style={estiloBoton} onClick={onClick}>
        Generar Reporte
      </button>
    );
  }
  
  export default BotonGenerarReporte;
  