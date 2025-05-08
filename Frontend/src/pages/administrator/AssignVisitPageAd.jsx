import styled from "styled-components"
import ScreenSuccess from "../../components/common/ScreenSuccess"
import { Autocomplete, Button, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import assignTask from "../../assets/administrator/assignTask.png"
import { handleGetListTechnical } from "../../controllers/administrator/getTechnicalListAd.controller"
import { handleGetListRequest } from "../../controllers/administrator/getListRequestAd.controller"
import { handleCreateVisit } from "../../controllers/administrator/createVisitAd.controller"


const TitleAssignTask = styled.h1`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  width: 55%;
`
const TextHelp = styled.h2`
  font-size: 1rem;
  margin-bottom: 2rem;
  width: 70%;
  font-weight: 400;
  color: #505050;
`


const ContainerRegister = styled.div`
  display: flex;
  gap: 5rem;
`
const ImgRegister = styled.img`
  width: 360px;
  height: 360px;
`
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 60%;
  max-width: 600px;
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

  const [technicalList, setTechnicalList] = useState([]);
  const [requestList, setRequestList] = useState([]);

  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
      await handleCreateVisit(
        estimatedDuration,
        previousNotes,
        postnotes,
        scheduledDate,
        request,
        technical,
      );

      setShowSuccess(true);
      setErrorMsg("");
    } catch (err) {
      console.log(err)
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else {
        setErrorMsg("Hubo un error al registrar el técnico.");
      }
    }
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
        console.log(response.data)
        setRequestList(response.data);
      } catch (error) {
        console.error("Error al obtener la lista de solicitudes:", error);
      }
    };
  
    fetchData();
  }, []);

  return (
    <section>
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
            FormHelperTextProps={{
              sx: {
                backgroundColor: '#F2F5F7',
                margin: 0,
              },
            }}
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
            FormHelperTextProps={{
              sx: {
                backgroundColor: '#F2F5F7',
                margin: 0,
                
              },
            }}
          />


          <TextField 
            label="Duracion estimada" 
            fullWidth size="medium" 
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
            onChange={(event, newValue) => {
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
            onChange={(event, newValue) => {
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

          <TextField 
            label="Fecha programada" 
            size="medium" 
            type="date"
            value={scheduledDate} 
            onChange={(e) => setScheduledDate(e.target.value)}
            sx={{ backgroundColor: 'white' }}
            error={Boolean(fieldErrors.notas_posteriores)}
            helperText={fieldErrors.notas_posteriores}
            InputLabelProps={{
              shrink: true,
            }}
          />
            
          {errorMsg && (
            <Typography color="error" sx={{ backgroundColor: '#F2F5F7', padding: '0.5rem', borderRadius: '4px' }}>
              {errorMsg}
            </Typography>
          )}

          <ContainerButton>
            <Button type="submit" variant="contained">Asignar Tarea</Button>
            <Button type="button" variant="contained">Limpiar Campos</Button>
          </ContainerButton>

          {showSuccess && (
            <ScreenSuccess onClose={() => setShowSuccess(false)}>
              Visita asignada exitosamente!
            </ScreenSuccess>
          )}
        </Form>
        <ImgRegister src={assignTask}></ImgRegister>
      </ContainerRegister>
      
    </section>
  )
}


export default AssignVisitPageAd;
