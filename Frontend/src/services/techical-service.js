import axios from "axios";


const createTechnical = (IdCard, name, lastName, email, phone, password, position) => {
  return axios.post("http://localhost:5050/api/tecnico", {
    IdCard,
    name,
    lastName,
    email,
    phone,
    password,
    position
  }, {
    headers: {
      "Content-Type": "application/json"
    }
  });
};


export const technicalService = {
  createTechnical,

}