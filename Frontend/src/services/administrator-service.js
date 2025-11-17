import api from "../controllers/common/api.controller";


const createTechnical = (IdCard, name, lastName, email, phone, password, position) => {
  return api.post("/tecnico", {
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

const getClient = (id) => {
  return api.get(`/cliente/${id}`)
};

const getTechnical = (id) => {
  return api.get(`/tecnico/${id}`)
};

const updateClient = (id, data) => {
  return api.put(`/cliente/${id}`, 
    data, 
    {
      headers: {
        "Content-Type": "application/json"
      }
    });
};

const getListTechnical = () => {
  return api.get("/tecnico")
};

const createService = (nameService, descripcion) => {
  const token = localStorage.getItem("authToken");

  return api.post("/servicios", {
    nombre: nameService,
    descripcion: descripcion
  }, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
};

const updateService = (id, nameService, descripcion) => {
  const token = localStorage.getItem("authToken");

  return api.put(`/servicios/${id}`, {
    nombre: nameService,
    descripcion: descripcion
  }, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
};

const getService = (id) => {
  const token = localStorage.getItem("authToken");


  return api.get(`/servicios/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

}


const stateChange = (id, state) => {
  return api.put(`/tecnico/${id}`, {
    estado: state
  }, {
    headers: {
      "Content-Type": "application/json"
    }
  });
}

const UpdateStateClient = (id, state) => {
  return api.put(`/cliente/${id}`, {
    estado: state
  }, {
    headers: {
      "Content-Type": "application/json"
    }
  });
}

const UpdateStateService = (id, state) => {
  return api.put(`/servicios/${id}`, {
    estado: state
  }, {
    headers: {
      "Content-Type": "application/json"
    }
  });
}

const getListRequest = () => {
  const token = localStorage.getItem("authToken");

  return api.get("/solicitudes", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

const assignVisit = (estimatedDuration, previousNotes, postnotes, scheduledDate, requestId, technicalId, serviceId) => {
  const token = localStorage.getItem("authToken");

  return api.post("/visitas", {
    duracion_estimada: estimatedDuration,
    notas_previas: previousNotes,
    fecha_programada: scheduledDate,
    notas_posteriores: postnotes,
    solicitud_id_fk: requestId,
    tecnico_id_fk: technicalId,
    servicio_id_fk: serviceId

  }, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
}

const getServiceList = () => {
  const token = localStorage.getItem("authToken");

  return api.get("/servicios", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

const getAdminId = (id) => {
  return api.get(`/admin/${id}`)
}

const updateAdmin = (id, idCard, nameUser, lastName, email, state) => {
  
  return api.put(`/admin/${id}`, {
    numero_cedula: idCard,
    nombre: nameUser,
    apellido: lastName,
    correo_electronico: email,
    estado: state
  }, {
    headers: {
      "Content-Type": "application/json",
    }
  });
}

const updateTechnical = (id, data) => {
  return api.put(`/tecnico/${id}`, data, {
    headers: {
      "Content-Type": "application/json",
    }
  });
}

const getListVisit = () => {
  const token = localStorage.getItem("authToken");

  return api.get(`/visitas`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

const getVisit =  (id_visit) => {
  const token = localStorage.getItem("authToken");

  return api.get(`/visitas/${id_visit}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

}

const createAdmin = (idCard, name, lastName, email, password) => {
  const token = localStorage.getItem("authToken");

  return api.post("/admin", {
    numero_cedula: idCard,
    nombre: name,
    apellido: lastName, 
    correo_electronico: email,
    contrasenia: password

  }, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}


const getListAdministrator = () => {
  return api.get("/admin")

}

const updateStateRequest = (id, state) => {
  return api.patch(`/solicitudes/${id}/estado`, 
    { estado: state }, // Aquí va el body
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
};

const updateStateAdministrator = (id, state) => {
  return api.put(`/admin/${id}`, {
    estado:state
  }, {
    headers: {
      "Content-Type": "application/json",
    }
  });
}

const createAccounting = (
  numero_de_cedula,
  nombre,
  apellido,
  correo_electronico,
  telefono,
  contrasenia
) => {
  const token = localStorage.getItem("authToken");

  return api.post("/contabilidad", {
    numero_de_cedula,
    nombre,
    apellido,
    correo_electronico,
    telefono,
    contrasenia
  }, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });
};

const getListAccounting = () => {
  return api.get("/contabilidad")
};

const getAccounting = (id) => {
  const token = localStorage.getItem("authToken");


  return api.get(`/contabilidad/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

}

const updateStateAccounting = (id, state) => {
  return api.put(`/contabilidad/${id}`, {
    estado:state
  }, {
    headers: {
      "Content-Type": "application/json",
    }
  });
}

const deleteBill = (id) => {
  const token = localStorage.getItem("authToken");


  return api.delete(`/eliminar-factura/${id}`,{
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

const deleteAccount = (id) => {
  const token = localStorage.getItem("authToken");

  return api.delete(`/eliminar-cuenta/${id}`, {
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
        "Authorization": `Bearer ${token}`
      }
    }
  );
};

const createBill = (billData) => {
  const token = localStorage.getItem("authToken");

  return api.post("/registrar-factura", billData, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
};

const getListBill = () => {
  const token = localStorage.getItem("authToken");


  return api.get("/facturas", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

const getBill = (id) => {
  const token = localStorage.getItem("authToken");


  return api.get(`/factura/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

const updateStateBill = (id, state) => {
  const token = localStorage.getItem("authToken");

  return api.put(`/factura/${id}`, 
    {
      estado_factura:state
    },
      {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
};

const updateBill = (id, formData) => {
  const token = localStorage.getItem("authToken");

  return api.put(`/factura/${id}`, 
    formData,
    {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
  );
};

const createPaymentAccount = (paymentAccountData) => {
  const token = localStorage.getItem("authToken");

  return api.post("/registrar-cuenta", paymentAccountData, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

const getListPaymentAccount = () => {
  const token = localStorage.getItem("authToken");


  return api.get("/cuentas", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
};

const updatePaymentAccount = (id, paymentAccountData) => {
  const token = localStorage.getItem("authToken");

  return api.put(`/cuenta/${id}`, 
    paymentAccountData,
    {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
  );
};

const updateInventory = (id, inventoryData) => {
  const token = localStorage.getItem("authToken");

  return api.put(`/inventario/${id}`, 
    inventoryData,
    {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }
  );
};

const getPaymentAccount = (id) => {
  const token = localStorage.getItem("authToken");


  return api.get(`/cuenta-id/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

}

const getInventory = (id) => {
  const token = localStorage.getItem("authToken");


  return api.get(`/inventario/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

}


export const getListInventory = () => {
  const token = localStorage.getItem("authToken");

  return api.get("/inventario", {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
};


const deleteInventory = (id) => {
  const token = localStorage.getItem("authToken");
  return api.delete(`/inventario/${id}`,{
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

const deleteAccounting = (id) => {
  const token = localStorage.getItem("authToken");  
  return api.delete(`/contabilidad/${id}`,{
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

const deleteService = (serviceId) => {
  const token = localStorage.getItem("authToken");
  return api.patch(`/servicios/${serviceId}/deshabilitar`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

const deleteAdministrator = (administratorId) => {
  const token = localStorage.getItem("authToken");
  return api.delete(`/admin/${administratorId}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

const deleteClient = (clientId) => {
  const token = localStorage.getItem("authToken");
  return api.delete(`/cliente/${clientId}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

const deleteTechnical = (technicalId) => {
  const token = localStorage.getItem("authToken");
  return api.delete(`/tecnico/${technicalId}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

const updateVisit = (id, visitData) => {
  const token = localStorage.getItem("authToken");
  return api.put(`/visitas/${id}`, visitData, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
}

const deleteRequest = (id) => {
  const token = localStorage.getItem("authToken");
  return api.delete(`/solicitud/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

const getListMaintenanceReport = () => {
  const token = localStorage.getItem("authToken");  
  return api.get("/reportes-mantenimiento", {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}

const createMaintenanceReport = (reportData) => {
  const token = localStorage.getItem("authToken"); 
  return api.post("/reportes-mantenimiento", reportData, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
}

export const administratorService = {
  createTechnical,
  getListTechnical,
  getClient,
  getTechnical,
  getService,
  updateClient,
  createService,
  stateChange,
  getListRequest,
  assignVisit,
  updateService,
  getServiceList,
  getAdminId,
  updateAdmin,
  updateTechnical,
  getListVisit,
  getVisit,
  createAdmin,
  getListAdministrator,
  UpdateStateClient,
  UpdateStateService,
  updateStateRequest,
  updateStateAdministrator,
  createAccounting,
  getListAccounting,
  getAccounting,
  updateStateAccounting,
  updateAccounting,
  createBill,
  getListBill,
  getBill,
  updateStateBill,
  updateBill,
  createPaymentAccount,
  getListPaymentAccount,
  getPaymentAccount,
  updatePaymentAccount,
  deleteBill,
  deleteAccount,
  getListInventory,
  getInventory,
  updateInventory,
  deleteInventory,
  deleteAccounting,
  deleteService,
  deleteAdministrator,
  deleteClient,
  deleteTechnical,
  updateVisit,
  deleteRequest,
  getListMaintenanceReport,
  createMaintenanceReport
}