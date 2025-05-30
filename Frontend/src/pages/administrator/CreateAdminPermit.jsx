import { Button, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";
import ScreenSuccess from "../../components/common/ScreenSuccess";
import logoPermit from "../../assets/administrator/adminPermit.png"


const TitleService = styled.h1`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  width: 60%;
`
const TextHelp = styled.h2`
  font-size: 1rem;
  margin-bottom: 2rem;
  width: 55%;
  font-weight: 400;
  color: #505050;
`

const SelectionGroup = styled.div`


`

const ContainerSelection = styled.div`
  display: flex;
  gap: 2rem;
`

const Selection = styled.div`
  width: 60%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const ImgSelection = styled.img`
  width: 360px;
  height: 360px;
`

const TitleSelection = styled.h4`
  margin-bottom: 0.425rem;
`

const GroupSelect = styled.div`
  display: flex;


  & > :first-child{
    width: 50%;
  }

  & > :nth-child(2){
    width: 50%;
  }

`

const ContainerButton = styled.div`
  display: flex;
  gap: 3rem;
  margin-top: 2rem;

  & > *:first-child {
    width: 45%;

  }
  & > *:nth-child(2)  {
    width: 35%;
    background-color:#17A2B8;
  }


`


const CreateAdminPermit = () => {


  const [permissions, setPermissions] = useState({
    verUsuarios: false,
    editarUsuarios: false,
    eliminarUsuarios: false,
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [showSuccess, setShowSuccess] = useState(false);
  


  const handleChange = (event) => {
    setPermissions({
      ...permissions,
      [event.target.name]: event.target.checked,
    });
  };



  const handleSubmit = async(e) => {
    e.preventDefault();

    try {
      await handleCreateSubmitClient(
        nameService,
        description
      );

      navigate("/iniciar-sesion");
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

  return (
    <div>
      <TitleService>
        Aquí puedes asignar los permisos del administrador, definiendo exactamente a 
        qué funciones del sistema tendrá acceso y cuáles no.
      </TitleService>
      <TextHelp>
        Marca las casillas correspondientes para otorgar los permisos que este administrador tendrá dentro del sistema.
      </TextHelp>

      <SelectionGroup>
        <ContainerSelection>
          <Selection>
            <div>
              <TitleSelection>Gestionar Usuarios</TitleSelection>
              <GroupSelect>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions.verUsuarios}
                      onChange={handleChange}
                      name="verUsuarios"
                    />
                  }
                  label="Ver información de usuarios"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions.editarUsuarios}
                      onChange={handleChange}
                      name="editarUsuarios"
                    />
                  }
                  label="Editar información de usuarios"
                />
              </GroupSelect>
              <GroupSelect>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions.eliminarUsuarios}
                      onChange={handleChange}
                      name="eliminarUsuarios"
                    />
                  }
                  label="Eliminar usuarios"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions.eliminarUsuarios}
                      onChange={handleChange}
                      name="eliminarUsuarios"
                    />
                  }
                  label="Eliminar usuarios"
                />
              </GroupSelect>
            </div>
            <div>
              <TitleSelection>Gestionar Usuarios</TitleSelection>
              <GroupSelect>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions.verUsuarios}
                      onChange={handleChange}
                      name="verUsuarios"
                    />
                  }
                  label="Ver información de usuarios"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions.editarUsuarios}
                      onChange={handleChange}
                      name="editarUsuarios"
                    />
                  }
                  label="Editar información de usuarios"
                />
              </GroupSelect>
              <GroupSelect>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions.eliminarUsuarios}
                      onChange={handleChange}
                      name="eliminarUsuarios"
                    />
                  }
                  label="Eliminar usuarios"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions.eliminarUsuarios}
                      onChange={handleChange}
                      name="eliminarUsuarios"
                    />
                  }
                  label="Eliminar usuarios"
                />
              </GroupSelect>
            </div>
            <div>
              <TitleSelection>Gestionar Usuarios</TitleSelection>
              <GroupSelect>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions.verUsuarios}
                      onChange={handleChange}
                      name="verUsuarios"
                    />
                  }
                  label="Ver información de usuarios"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions.editarUsuarios}
                      onChange={handleChange}
                      name="editarUsuarios"
                    />
                  }
                  label="Editar información de usuarios"
                />
              </GroupSelect>
              <GroupSelect>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions.eliminarUsuarios}
                      onChange={handleChange}
                      name="eliminarUsuarios"
                    />
                  }
                  label="Eliminar usuarios"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions.eliminarUsuarios}
                      onChange={handleChange}
                      name="eliminarUsuarios"
                    />
                  }
                  label="Eliminar usuarios"
                />
              </GroupSelect>
            </div>
            <div>
              <TitleSelection>Gestionar Usuarios</TitleSelection>
              <GroupSelect>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions.verUsuarios}
                      onChange={handleChange}
                      name="verUsuarios"
                    />
                  }
                  label="Ver información de usuarios"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions.editarUsuarios}
                      onChange={handleChange}
                      name="editarUsuarios"
                    />
                  }
                  label="Editar información de usuarios"
                />
              </GroupSelect>
              <GroupSelect>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions.eliminarUsuarios}
                      onChange={handleChange}
                      name="eliminarUsuarios"
                    />
                  }
                  label="Eliminar usuarios"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={permissions.eliminarUsuarios}
                      onChange={handleChange}
                      name="eliminarUsuarios"
                    />
                  }
                  label="Eliminar usuarios"
                />
              </GroupSelect>
            </div>
            <ContainerButton>
                <Button type="submit" variant="contained">Crear</Button>
                <Button type="button" variant="contained">Reiniciar Seleccion</Button>
            </ContainerButton>
          </Selection>
          <ImgSelection src={logoPermit} alt="logo administrador permisos"></ImgSelection>
          
        </ContainerSelection>

        {showSuccess && (
          <ScreenSuccess onClose={() => setShowSuccess(false)}>
            El empleado fue registrado con éxito!
          </ScreenSuccess>
        )}
      </SelectionGroup>


    </div>
  )
}

export default CreateAdminPermit;