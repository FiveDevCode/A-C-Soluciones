import axios from "axios";


const createClient = (IdCard, name, lastName, email, phone, password, address) => {
  return axios.post("http://localhost:8000/api/cliente", {
    numero_de_cedula: IdCard,
    nombre: name,
    apellido: lastName,
    correo_electronico: email,
    telefono: phone,
    contrasenia: password,
    direccion: address
  }, {
    headers: {
      "Content-Type": "application/json"
    }
  });
};


export const clientService = {
  createClient,

}