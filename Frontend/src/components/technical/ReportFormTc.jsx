import styled from 'styled-components';
import { TextField, Button, Collapse, Alert, IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faTimes } from '@fortawesome/free-solid-svg-icons';
import { handleCreateMaintenanceSheet } from '../../controllers/common/createMaintenanceSheet.controller';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';


const FormContainer = styled.form`
  max-width: 700px;
  margin: auto;
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
  background-color: #e0e0e0;
  padding: 8px 16px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 1rem;
  cursor: pointer;
`;

const ReportFormTc = () => {
  const [imagenes, setImagenes] = useState({
    foto_estado_antes: null,
    foto_estado_final: null,
    foto_descripcion_trabajo: null,
  });

  const [formData, setFormData] = useState({
    cliente: '',
    tecnico: '',
    introduccion: '',
    detalles_servicio: '',
    observaciones: '',
    estado_antes: '',
    descripcion_trabajo: '',
    materiales_utilizados: '',
    estado_final: '',
    tiempo_de_trabajo: '',
    recomendaciones: '',
    fecha_de_mantenimiento: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const {id} = useParams();

  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    setImagenes((prev) => ({ ...prev, [field]: file }));
  };
  

  const handleSubmit = async(event) => {
    event.preventDefault(); 
    setIsSubmitting(true);

    try {
      await handleCreateMaintenanceSheet({
        id_cliente: parseInt(formData.cliente),
        id_tecnico: parseInt(formData.tecnico),
        introduccion: formData.introduccion,
        detalles_servicio: formData.detalles_servicio,
        observaciones: formData.observaciones,
        estado_antes: formData.estado_antes,
        descripcion_trabajo: formData.descripcion_trabajo,
        materiales_utilizados: formData.materiales_utilizados,
        estado_final: formData.estado_final,
        tiempo_de_trabajo: formData.tiempo_de_trabajo,
        recomendaciones: formData.recomendaciones,
        fecha_de_mantenimiento: formData.fecha_de_mantenimiento,
        foto_estado_antes: imagenes.foto_estado_antes,
        foto_estado_final: imagenes.foto_estado_final,
        foto_descripcion_trabajo: imagenes.foto_descripcion_trabajo,
      });

      setFieldErrors("");
      setErrorMsg("");
      setShowSuccess(true);

      setTimeout(() => {
        navigate(`/tecnico/ver-servicio/${id}`)      
      }, 3000);
    } catch (err) {
      console.log(err)
      setErrorMsg("");
      if (err.response?.data?.errors) {
        const formattedErrors = {};
        err.response.data.errors.forEach(error => {
          if (!formattedErrors[error.path]) {
            formattedErrors[error.path] = error.message;
          }
        });
        setFieldErrors(formattedErrors);
      } else {
        setErrorMsg(err.response.data.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (

    <FormContainer onSubmit={handleSubmit}>
      <TextField 
        label="Cliente" 
        name="cliente" 
        fullWidth 
        margin="normal" 
        value={formData.cliente} 
        onChange={handleInputChange}
        error={Boolean(fieldErrors.cliente)}
        helperText={fieldErrors.cliente}
      />
      <TextField 
        label="Técnico Responsable" 
        name="tecnico" 
        fullWidth 
        margin="normal" 
        value={formData.tecnico} 
        onChange={handleInputChange} 
        error={Boolean(fieldErrors.tecnico)}
        helperText={fieldErrors.tecnico}
      />
      <TextField
        label="Fecha del mantenimiento"
        name="fecha_de_mantenimiento"
        type='date'
        fullWidth
        margin="normal"
        value={formData.fecha_de_mantenimiento}
        onChange={handleInputChange}
        error={Boolean(fieldErrors.fecha_de_mantenimiento)}
        helperText={fieldErrors.fecha_de_mantenimiento}

        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField 
        label="Introducción" 
        name="introduccion" 
        fullWidth 
        multiline 
        rows={3} 
        margin="normal" 
        value={formData.introduccion} 
        onChange={handleInputChange}
        error={Boolean(fieldErrors.introduccion)}
        helperText={fieldErrors.introduccion} 
      />
      <TextField 
        label="Detalles del servicio" 
        name="detalles_servicio" 
        fullWidth 
        multiline 
        rows={3} 
        margin="normal" 
        value={formData.detalles_servicio} 
        onChange={handleInputChange} 
        error={Boolean(fieldErrors.detalles_servicio)}
        helperText={fieldErrors.detalles_servicio}
      />
      <TextField 
        label="Observaciones" 
        name="observaciones" 
        fullWidth 
        multiline 
        rows={2} 
        margin="normal" 
        value={formData.observaciones} 
        onChange={handleInputChange} 
        error={Boolean(fieldErrors.observaciones)}
        helperText={fieldErrors.observaciones}
      />
      <TextField 
        label="Estado antes" 
        name="estado_antes" 
        fullWidth 
        multiline 
        rows={2} 
        margin="normal" 
        value={formData.estado_antes} 
        onChange={handleInputChange} 
        error={Boolean(fieldErrors.estado_antes)}
        helperText={fieldErrors.estado_antes}
      />

      <UploadButton>
        Subir imagen "Estado antes" <FontAwesomeIcon icon={faUpload} style={{ marginLeft: '8px' }} />
        <input 
          type="file" 
          hidden 
          onChange={(e) => handleFileChange(e, 'foto_estado_antes')} 
        />
      </UploadButton>
      {imagenes.foto_estado_antes && (
        <FileList>
          <FileItem>
            {imagenes.foto_estado_antes.name}
            <FontAwesomeIcon 
              icon={faTimes} 
              style={{ cursor: 'pointer' }} 
              onClick={() => setImagenes(prev => ({ ...prev, foto_estado_antes: null }))} 
            />
          </FileItem>
        </FileList>
      )}

      <TextField 
        label="Descripción del trabajo" 
        name="descripcion_trabajo" 
        fullWidth 
        multiline 
        rows={3} 
        margin="normal" 
        value={formData.descripcion_trabajo} 
        onChange={handleInputChange} 
        error={Boolean(fieldErrors.descripcion_trabajo)}
        helperText={fieldErrors.descripcion_trabajo}
      />

      <UploadButton>
        Subir imagen "Descripción del trabajo" <FontAwesomeIcon icon={faUpload} style={{ marginLeft: '8px' }} />
        <input 
          type="file" 
          hidden 
          onChange={(e) => handleFileChange(e, 'foto_descripcion_trabajo')} 
        />
      </UploadButton>
      {imagenes.foto_descripcion_trabajo && (
        <FileList>
          <FileItem>
            {imagenes.foto_descripcion_trabajo.name}
            <FontAwesomeIcon 
              icon={faTimes} 
              style={{ cursor: 'pointer' }} 
              onClick={() => setImagenes(prev => ({ ...prev, foto_descripcion_trabajo: null }))} 
            />
          </FileItem>
        </FileList>
      )}


      <TextField 
        label="Materiales utilizados" 
        name="materiales_utilizados" 
        fullWidth 
        margin="normal" 
        value={formData.materiales_utilizados} 
        onChange={handleInputChange} 
        error={Boolean(fieldErrors.materiales_utilizados)}
        helperText={fieldErrors.materiales_utilizados}
      />
      <TextField 
        label="Estado final" 
        name="estado_final" 
        fullWidth 
        margin="normal" 
        value={formData.estado_final} 
        onChange={handleInputChange} 
        error={Boolean(fieldErrors.estado_final)}
        helperText={fieldErrors.estado_final}
      />

      <UploadButton>
        Subir imagen "Estado final" <FontAwesomeIcon icon={faUpload} style={{ marginLeft: '8px' }} />
        <input 
          type="file" 
          hidden 
          onChange={(e) => handleFileChange(e, 'foto_estado_final')} 
        />
      </UploadButton>
      {imagenes.foto_estado_final && (
        <FileList>
          <FileItem>
            {imagenes.foto_estado_final.name}
            <FontAwesomeIcon 
              icon={faTimes} 
              style={{ cursor: 'pointer' }} 
              onClick={() => setImagenes(prev => ({ ...prev, foto_estado_final: null }))} 
            />
          </FileItem>
        </FileList>
      )}

      <TextField 
        label="Tiempo de trabajo" 
        name="tiempo_de_trabajo" 
        fullWidth 
        margin="normal" 
        value={formData.tiempo_de_trabajo} 
        onChange={handleInputChange} 
        error={Boolean(fieldErrors.tiempo_de_trabajo)}
        helperText={fieldErrors.tiempo_de_trabajo}
      />
      <TextField 
        label="Recomendaciones" 
        name="recomendaciones" 
        fullWidth 
        multiline 
        rows={2} 
        margin="normal" 
        value={formData.recomendaciones} 
        onChange={handleInputChange} 
        error={Boolean(fieldErrors.recomendaciones)}
        helperText={fieldErrors.recomendaciones}
      />

      <Collapse in={!!errorMsg}>
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setErrorMsg('')}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {errorMsg}
        </Alert>
      </Collapse>

      <Collapse in={showSuccess}>
        <Alert
          severity="success"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => setShowSuccess(false)}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          ¡El reporte fue creado con exito!
        </Alert>
      </Collapse>

      {pdfUrl ? (
        <Button
          variant="contained"
          fullWidth
          color="secondary"
          style={{ marginTop: '1rem' }}
          onClick={() => window.open(`${import.meta.env.VITE_BACKEND_URL}${pdfUrl}`, '_blank')}
        >
          Ver PDF
        </Button>
      ) : (
        <Button
          type="submit"
          variant="contained"
          fullWidth
          color="primary"
          style={{ marginTop: '1rem' }}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Generando reporte..." : "Generar reporte"}
        </Button>
      )}

    </FormContainer>
  );
};

export default ReportFormTc;
