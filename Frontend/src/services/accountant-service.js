import api from "../controllers/common/api.controller";


const getListBill = () => {
  const token = localStorage.getItem("authToken");

  return api.get("/facturas", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}


const createInventory = (data) => {
  const token = localStorage.getItem("authToken");

  return api.post("/inventario", data, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
};

const getAccounting = (id) => {
  const token = localStorage.getItem("authToken");

  return api.get(`/contabilidad/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

const updateAccounting = (id, data) => { 
  const token = localStorage.getItem("authToken");

  return api.put(`/contabilidad/${id}`,
    data,
    {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );
};


export const accountantService = {
  getListBill,
  createInventory,
  getAccounting,
  updateAccounting
}