import styled from "styled-components"
import ScreenSuccess from "../../components/common/ScreenSuccess"
import { Autocomplete, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import assignTask from "../../assets/administrator/assignTask.png"
import { handleGetListTechnical } from "../../controllers/administrator/getTechnicalListAd.controller"


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


const AssignTaskPageAd = () => {

  const [titleTask, setTitleTask] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("");
  const [state, setState] = useState("");
  const [technical, setTechnical] = useState("");

  const [technicalList, setTechnicalList] = useState([]);

  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
      await handleCreateSubmitClient(
        nameService,
        description
      );

      navigate("/login");
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

  return (
    <section>
      <TitleAssignTask>
        Asigna tareas operativas al personal técnico, especificando el trabajo a realizar, 
        ubicación y prioridad correspondiente
      </TitleAssignTask>
      <TextHelp>
        Por favor, completa todos los campos obligatorios para continuar con la asignación de la tarea al empleado.
      </TextHelp>

      <ContainerRegister>
        <Form onSubmit={handleSubmit}>
          <TextField
            label="Titulo de la tarea" 
            fullWidth size="medium" 
            value={titleTask} 
            onChange={(e) => setTitleTask(e.target.value)}
            sx={{ backgroundColor: 'white' }}
            error={Boolean(fieldErrors.nombre)}
            helperText={fieldErrors.nombre}
            FormHelperTextProps={{
              sx: {
                backgroundColor: '#F2F5F7',
                margin: 0,
              },
            }}
          />
          <TextField 
            label="Descripción" 
            fullWidth size="medium" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            sx={{ backgroundColor: 'white' }}
            error={Boolean(fieldErrors.descripcion)}
            helperText={fieldErrors.descripcion}
            FormHelperTextProps={{
              sx: {
                backgroundColor: '#F2F5F7',
                margin: 0,
                
              },
            }}
          />
          <TextField 
            label="Fecha limite" 
            fullWidth size="medium" 
            value={deadline} 
            onChange={(e) => setDeadline(e.target.value)}
            sx={{ backgroundColor: 'white' }}
            error={Boolean(fieldErrors.fecha_limite)}
            helperText={fieldErrors.fecha_limite}
            FormHelperTextProps={{
              sx: {
                backgroundColor: '#F2F5F7',
                margin: 0,
                
              },
            }}
          />

          <FormControl fullWidth>
            <InputLabel id="prioridad-label">Prioridad</InputLabel>
            <Select
              labelId="prioridad-label"
              value={priority}
              label="Prioridad"
              onChange={(e) => setPriority(e.target.value)}
            >
              <MenuItem value="baja">Baja</MenuItem>
              <MenuItem value="media">Media</MenuItem>
              <MenuItem value="alta">Alta</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="estado-label">Estado</InputLabel>
            <Select
              labelId="estado-label"
              value={state}
              label="Estado"
              onChange={(e) => setState(e.target.value)}
            >
              <MenuItem value="pendiente">Pendiente</MenuItem>
              <MenuItem value="en_progreso">En progreso</MenuItem>
              <MenuItem value="completado">Completado</MenuItem>
            </Select>
          </FormControl>

          
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
              El empleado fue registrado con éxito!
            </ScreenSuccess>
          )}
        </Form>
        <ImgRegister src={assignTask}></ImgRegister>
      </ContainerRegister>
      
    </section>
  )
}


export default AssignTaskPageAd;
