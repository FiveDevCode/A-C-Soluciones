export const MAINTENANCE_CHECKLIST_ITEMS = [
  "TERMINALES DE BATERIA",
  "NIVEL DE AGUA DE BATERIA",
  "CARGA DE BATERIA / CARGADOR DE BATERIA AC/DC",
  "CARGADOR DE ALTERNADOR",
  "NIVEL DE ACEITE",
  "NIVEL DE REFRIGERANTE",
  "REV. FISICA RADIADOR",
  "REV. FILTRO DE AIRE",
  "REV. PRECALENTADOR",
  "REV. TENSION CORREAS",
  "NIVEL TANQUE COMBUSTIBLE",
  "REV. ABRAZADERAS MANGUERAS",
  "TERMINALES ELECTRICOS",
  "LIMPIAR EQUIPO",
  "ADMISION ESCAPE, SILENCIADOR Y FLEXIBLE",
  "DESPUES DE INCENDIO",
  "PRESION DE ACEITE",
  "TEMPERATURA DE ACEITE",
  "TEMPERATURA REFRIGERANTE",
  "FUGAS DE REFRIGERANTE",
  "FUGAS DE ACEITE",
  "FUGAS DE COMBUSTIBLE",
  "FRECUENCIA RPM",
  "VOLTAJE DE SALIDA"
];

export const buildDefaultChecklist = () =>
  MAINTENANCE_CHECKLIST_ITEMS.map((item) => ({
    item,
    estado: "ok",
    observacion: ""
  }));

export const toApiVerificaciones = (checklist = []) =>
  checklist.map((item) => ({
    item: item.item,
    visto: item.estado === "ok",
    observacion: item.observacion?.trim() || null
  }));
