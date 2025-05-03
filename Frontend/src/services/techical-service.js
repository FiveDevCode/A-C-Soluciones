import axios from "axios";


const createTechnical = (IdCard, name, lastName, email, phone, password, position) => {
  return axios.post("http://localhost:8000/api/tecnico", {
    numero_de_cedula: IdCard,
    nombre: name,
    apellido: lastName,
    correo_electronico: email,
    telefono: phone,
    contrasenia: password,
    especialidad: position
  }, {
    headers: {
      "Content-Type": "application/json"
    }
  });
};


export const technicalService = {
  createTechnical,

}