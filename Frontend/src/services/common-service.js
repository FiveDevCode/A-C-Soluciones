
import axios from "axios";


const login = (email, password) => {
  return axios.post("http://localhost:7000/api/login", {
    correo_electronico: email,
    contrasenia: password,
  }, {
    headers: {
      "Content-Type": "application/json"
    }
  });
};


export const commonService = {
  login,

}