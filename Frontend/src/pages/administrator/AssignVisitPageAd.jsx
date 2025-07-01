import styled from "styled-components"
import { Alert, Autocomplete, Button, Collapse, IconButton, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import assignTask from "../../assets/administrator/assignTask.png"
import { handleGetListTechnical } from "../../controllers/administrator/getTechnicalListAd.controller"
import { handleGetListRequest } from "../../controllers/administrator/getListRequestAd.controller"
import { handleCreateVisit } from "../../controllers/administrator/createVisitAd.controller"
import CloseIcon from '@mui/icons-material/Close';
import { handleGetListServiceAd } from "../../controllers/administrator/getListServiceAd.controller"

const ContainerPageAll = styled.section`
  display: flex;
  width: 100%;
  justify-content: center;

`

const ContainerPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`


const TitleAssignTask = styled.h1`
  font-size: 1.25rem;
  margin-bottom: 1rem;
`
const TextHelp = styled.h2`
  font-size: 1rem;
  margin-bottom: 2rem;
  width: 80%;
  font-weight: 400;
  color: #505050;
`


const ContainerRegister = styled.div`
  display: flex;
  gap: 3rem;
`
const ImgRegister = styled.img`
  width: 260px;
  height: 260px;
  user-select: none;
  pointer-events: none;
`
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 600px;

`
const ContainerButton = styled.div`
  display: flex;
  gap: 3rem;

  & > *:first-child {
    width: 45%;

  }
  & > *:nth-child(2)  {
    width: 35%;
    background-color:#17A2B8;
  }


`


const AssignVisitPageAd = () => {

  const [previousNotes, setPreviousNotes] = useState("");
  const [postnotes, setPostnotes] = useState("");
  const [estimatedDuration, setEstimatedDuration] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [technical, setTechnical] = useState("");
  const [request, setRequest] = useState("");
  const [service, setService] = useState("");
  const [selectedTechnical, setSelectedTechnical] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedService, setSelectedService] = useState(null);


  const [technicalList, setTechnicalList] = useState([]);
  const [requestList, setRequestList] = useState([]);
  const [serviceList, setServiceList] = useState([]);

  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await handleCreateVisit(
        estimatedDuration,
        previousNotes,
        postnotes,
        scheduledDate,
        request,
        technical,
        service,
      );

      setShowSuccess(true);
      setErrorMsg("");
      setFieldErrors({});
      handleLimpiar();
    } catch (err) {
      setErrorMsg("");
      setFieldErrors({});
      console.log(err)

      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } 
      
      if (err.response?.data?.message) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg("Hubo un error al registrar al administrador.");
      }
      
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleLimpiar = () =>{
    setEstimatedDuration("");
    setPostnotes("");
    setPreviousNotes("");
    setTechnical("");
    setRequest("");
    setScheduledDate("");
    setSelectedTechnical(null);
    setSelectedRequest(null);
    setSelectedService(null);
    setFieldErrors({});
    setErrorMsg("");
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await handleGetListTechnical();
        setTechnicalList(response.data);
      } catch (error) {
        console.error("Error al obtener la lista de técnicos:", error);
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await handleGetListRequest();
        setRequestList(response.data);
      } catch (error) {
        console.error("Error al obtener la lista de solicitudes:", error);
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await handleGetListServiceAd();
        console.log(response.data)
        setServiceList(response.data.data);
      } catch (error) {
        console.error("Error al obtener la lista de servicios:", error);
      }
    };
  
    fetchData();
  }, []);

  return (
    <ContainerPageAll>
      <ContainerPage>
        <TitleAssignTask>
          Asigna una visita al personal técnico, especificando el trabajo a realizar y 
          ubicación
        </TitleAssignTask>
        <TextHelp>
          Por favor, completa todos los campos obligatorios para continuar con la asignación de la visita al empleado.
        </TextHelp>

        <ContainerRegister>
          <Form onSubmit={handleSubmit}>
            <TextField
              label="Notas previas" 
              fullWidth size="medium" 
              value={previousNotes} 
              multiline
              rows={4}
              onChange={(e) => setPreviousNotes(e.target.value)}
              sx={{ backgroundColor: 'white' }}
              error={Boolean(fieldErrors.notas_previas)}
              helperText={fieldErrors.notas_previas}
            />
            <TextField 
              label="Notas posteriores" 
              fullWidth size="medium" 
              value={postnotes} 
              multiline
              rows={4}
              onChange={(e) => setPostnotes(e.target.value)}
              sx={{ backgroundColor: 'white' }}
              error={Boolean(fieldErrors.notas_posteriores)}
              helperText={fieldErrors.notas_posteriores}
            />
            <TextField 
              label="Duracion estimada" 
              fullWidth size="medium" 
              type="number"
              value={estimatedDuration} 
              onChange={(e) => setEstimatedDuration(e.target.value)}
              sx={{ backgroundColor: 'white' }}
              error={Boolean(fieldErrors.duracion_estimada)}
              helperText={fieldErrors.duracion_estimada}
            />
            <Autocomplete
              fullWidth
              options={requestList}
              getOptionLabel={(request) =>
                `${request.id} - ${request.descripcion.slice(0, 50)}`
              }
              value={selectedRequest}
              onChange={(event, newValue) => {
                setSelectedRequest(newValue);
                setRequest(newValue ? newValue.id : "");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Solicitudes"
                  placeholder="Buscar por id o palabra clave"
                  sx={{ backgroundColor: 'white' }}
                />
              )}
            />

            <Autocomplete
              fullWidth
              options={technicalList}
              getOptionLabel={(tecnico) =>
                `${tecnico.numero_de_cedula} - ${tecnico.nombre} ${tecnico.apellido}`
              }
              value={selectedTechnical}
              onChange={(event, newValue) => {
                setSelectedTechnical(newValue);
                setTechnical(newValue ? newValue.id : "");
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Técnico"
                  placeholder="Buscar por nombre o cédula"
                  sx={{ backgroundColor: 'white' }}
                />
              )}
            />

          <Autocomplete
              fullWidth
              options={serviceList}
              getOptionLabel={(service) =>
                `${service.nombre} - ${service.descripcion.slice(0, 50)}`
              }
              value={selectedService}
              onChange={(event, newValue) => {
                setSelectedService(newValue);
                setService(newValue ? newValue.id : "");
              }}
              renderOption={(props, option) => (
                <li {...props} key={option.id}>
                  {`${option.nombre} - ${option.descripcion.slice(0, 50)}`}
                </li>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Servicio"
                  placeholder="Buscar por id o palabra clave"
                  sx={{ backgroundColor: 'white' }}
                />
              )}
            />

            <TextField 
              label="Fecha programada" 
              size="medium" 
              type="datetime-local"
              value={scheduledDate} 
              onChange={(e) => setScheduledDate(e.target.value)}
              sx={{ backgroundColor: 'white', width: "60%" }}
              error={Boolean(fieldErrors.fecha_programada)}
              helperText={fieldErrors.fecha_programada}

              InputLabelProps={{
                shrink: true,
              }}
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
                ¡La visita fue asignada con exito!
              </Alert>
            </Collapse>

            <ContainerButton>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? "Asignando..." : "Asignar Tarea"}
              </Button>
              <Button type="button" variant="contained" onClick={handleLimpiar}>Limpiar Campos</Button>
            </ContainerButton>

          </Form>
          <ImgRegister src={assignTask} alt="logo asignar tarea"></ImgRegister>
        </ContainerRegister>
        
      </ContainerPage>
    </ContainerPageAll>
  )
}


export default AssignVisitPageAd;
