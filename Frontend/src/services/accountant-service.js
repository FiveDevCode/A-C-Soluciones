import api from "../controllers/common/api.controller";


const getListBill = () => {
  const token = localStorage.getItem("authToken");


  return api.get("/facturas", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}



export const accountantService = {
  getListBill,
}