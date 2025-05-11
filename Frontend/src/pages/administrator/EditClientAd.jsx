import { Alert, Button, Collapse, IconButton, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useNavigate, useParams } from "react-router-dom";
import { handleGetClient } from "../../controllers/administrator/getClientAd.controller";
import { handleUpdateClient } from "../../controllers/administrator/updateClient.controller";
import editClient from "../../assets/administrator/editClient.png"
import CloseIcon from '@mui/icons-material/Close';


const ContainerEditAll = styled.section`
  display: flex;
  justify-content: center;
`

const TitleEdit = styled.h1`
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
const ContainerForm = styled.div`
  display: flex;
  gap: 3rem;
`
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 60%;
  max-width: 600px;
`
const ImgEdit = styled.img`
  width: 260px;
  height: 260px;
  user-select: none;
  pointer-events: none;
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


const EditClientAd = () => {

  const navigate = useNavigate();


  const [idCard, setIdCard] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const { id } = useParams();

  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await handleUpdateClient(
        id,
        idCard,
        name,
        lastName,
        email,
        phone,
        address
      );

      setFieldErrors("");
      setErrorMsg("");
      setShowSuccess(true);

      navigate(`/edit-client/${id}`)
    } catch (err) {
      console.log(err)
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else {
        setErrorMsg(err.response.data.message);
      }
    } finally {
      setIsSubmitting(false);
    }

  }

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const client = await handleGetClient(id);

        setIdCard(client.data.numero_de_cedula || "");
        setName(client.data.nombre || "");
        setLastName(client.data.apellido || "");
        setPhone(client.data.telefono || "");
        setEmail(client.data.correo_electronico || "");
        setAddress(client.data.direccion || "");
      } catch (err) {
        console.error("Error al obtener cliente:", err);
      }
  };
    fetchClient();
  }, [id]);
  

  return (
    <ContainerEditAll>

      <div>
        <TitleEdit>Informacion personal</TitleEdit>
        <TextHelp>Por favor, asegúrate de completar todos los campos antes de guardar los cambios. No se permiten campos vacíos.</TextHelp>
        <ContainerForm>
          <Form onSubmit={handleSubmit}>
            <TextField 
              label="Cédula" 
              fullWidth size="medium" 
              value={idCard} 
              onChange={(e) => setIdCard(e.target.value)}
              sx={{ backgroundColor: 'white' }}
              error={Boolean(fieldErrors.numero_de_cedula)}
              helperText={fieldErrors.numero_de_cedula}
              FormHelperTextProps={{
                sx: {
                  backgroundColor: '#F2F5F7',
                  margin: 0,
      
                },
              }}
            />
            <TextField 
              label="Nombre" 
              fullWidth size="medium" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
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
              label="Apellidos" 
              fullWidth size="medium" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)}
              sx={{ backgroundColor: 'white' }}
              error={Boolean(fieldErrors.apellido)}
              helperText={fieldErrors.apellido}
              FormHelperTextProps={{
                sx: {
                  backgroundColor: '#F2F5F7',
                  margin: 0,
      
                },
              }}
            />
            <TextField 
              label="Celular" 
              fullWidth size="medium" 
              type='number'
              value={phone} 
              onChange={(e) => setPhone(e.target.value)}
              sx={{ backgroundColor: 'white' }}
              error={Boolean(fieldErrors.telefono)}
              helperText={fieldErrors.telefono}
              FormHelperTextProps={{
                sx: {
                  backgroundColor: '#F2F5F7',
                  margin: 0,
      
                },
              }}
            />
            <TextField 
              label="Dirrecion" 
              fullWidth size="medium" 
              value={address} 
              onChange={(e) => setAddress(e.target.value)}
              sx={{ backgroundColor: 'white' }}
              error={Boolean(fieldErrors.direccion)}
              helperText={fieldErrors.direccion}
              FormHelperTextProps={{
                sx: {
                  backgroundColor: '#F2F5F7',
                  margin: 0,
                },
              }}
            />
            <TextField 
              label="Correo electrónico" 
              fullWidth size="medium" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              sx={{ backgroundColor: 'white' }}
              error={Boolean(fieldErrors.correo_electronico)}
              helperText={fieldErrors.correo_electronico}
              FormHelperTextProps={{
                sx: {
                  backgroundColor: '#F2F5F7',
                  margin: 0,
      
                },
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
                ¡El cliente fue editado con exito!
              </Alert>
            </Collapse>

            <ContainerButton>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? "Editando..." : "Editar cliente"}
              </Button>
              <Button type="button" variant="contained" LinkComponent={Link} to="/profile-client">Cancelar</Button>
            </ContainerButton>

          </Form>
          <ImgEdit src={editClient}></ImgEdit>
        </ContainerForm>

      </div>
    </ContainerEditAll>

  )
}


export default EditClientAd;