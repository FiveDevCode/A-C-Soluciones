function BotonEliminar({ onClick }) {
    const estiloBoton = {
      backgroundColor: "red",
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
        Eliminar
      </button>
    );
  }
  
  export default BotonEliminar;
  