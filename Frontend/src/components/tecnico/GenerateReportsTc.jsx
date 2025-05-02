import React, { useState } from "react";
import styled from "styled-components";
import { TextField, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload, faTimes } from "@fortawesome/free-solid-svg-icons";

const FormContainer = styled.div`
  padding: 2rem;
  max-width: 600px;
  margin: auto;
  background : white;
`;

const FileList = styled.div`
  margin-bottom: 1rem;
`;

const FileItem = styled.div`
  background-color: #90caf9;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;

`;

const UploadButton = styled.label`
  background-color:rgb(156, 156, 156);
  padding: 8px 16px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 1rem;
  cursor: pointer;
  color: black;
`;

const Divider = styled.hr`
  margin: 2rem 0;
`;

const GenerateReportsTc = () => {
  const [archivos, setArchivos] = useState([]);
  const [formData, setFormData] = useState({
    cliente: "",
    servicio: "",
    observaciones: "",
    duracion: "",
    fecha: "",
  });

  const handleArchivoChange = (e) => {
    const nuevos = Array.from(e.target.files);
    setArchivos((prev) => [...prev, ...nuevos]);
  };

  const eliminarArchivo = (index) => {
    const actualizados = [...archivos];
    actualizados.splice(index, 1);
    setArchivos(actualizados);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerar = () => {
    console.log("Formulario enviado:", formData, archivos);
    // Aquí iría la lógica para generar el reporte
  };

  return (
    <FormContainer>
      <FileList>
        {archivos.map((archivo, index) => (
          <FileItem key={index}>
            {archivo.name}
            <FontAwesomeIcon
              icon={faTimes}
              style={{ cursor: "pointer" }}
              onClick={() => eliminarArchivo(index)}
            />
          </FileItem>
        ))}
      </FileList>

      <UploadButton>
        SUBIR IMAGEN{" "}
        <FontAwesomeIcon icon={faUpload} style={{ marginLeft: "8px" }} />
        <input type="file" hidden multiple onChange={handleArchivoChange} />
      </UploadButton>

      <Divider />

      <TextField
        fullWidth
        label="Nombre del cliente"
        name="cliente"
        variant="outlined"
        margin="normal"
        value={formData.cliente}
        onChange={handleInputChange}
      />
      <TextField
        fullWidth
        label="Tipo de servicio"
        name="servicio"
        variant="outlined"
        margin="normal"
        value={formData.servicio}
        onChange={handleInputChange}
      />
      <TextField
        fullWidth
        label="Observaciones"
        name="observaciones"
        variant="outlined"
        multiline
        rows={3}
        margin="normal"
        value={formData.observaciones}
        onChange={handleInputChange}
      />
      <TextField
        label="Duración"
        name="duracion"
        variant="outlined"
        margin="normal"
        value={formData.duracion}
        onChange={handleInputChange}
        style={{width:"400px"}}
      />
      <TextField
        type="date"
        name="fecha"
        variant="outlined"
        margin="normal"
        InputLabel={{ shrink: true }}
        value={formData.fecha}
        onChange={handleInputChange}
        style={{width:"400px"}}
      />

      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: "1rem", width:"250px"}}
        onClick={handleGenerar}
      >
        GENERAR REPORTE
      </Button>
    </FormContainer>
  );
};

export default GenerateReportsTc;
