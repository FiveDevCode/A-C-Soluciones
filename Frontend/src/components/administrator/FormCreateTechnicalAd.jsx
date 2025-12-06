import { jwtDecode } from "jwt-decode";
import { handleCreateSubmitTechnical } from "../../controllers/administrator/createTc.controller";
import BaseFormModal from "../common/BaseFormModal";

// Especialidades técnicas profesionales
const ESPECIALIDADES_HIDROELECTRICAS = [
  "Técnico en Mantenimiento Electromecánico Industrial",
  "Técnico en Electricidad Industrial",
  "Técnico en Automatización Industrial",
  "Técnico en Instalaciones Hidrosanitarias",
  "Técnico en Mantenimiento de Motores Diésel",
  "Técnico en Instrumentación Industrial",
  "Técnico en Electrónica Industrial",
  "Técnico en Mecatrónica",
  "Técnico en Tratamiento de Aguas",
  "Técnico en Saneamiento Ambiental",
  "Técnico en Construcción y Edificaciones",
  "Técnico en Mantenimiento de Plantas Eléctricas",
  "Técnico en Sistemas de Potencia Eléctrica",
  "Técnico en Mecánica de Mantenimiento",
  "Técnico en Redes de Abastecimiento de Agua",
  "Técnico en Mantenimiento de Sistemas Hidráulicos",
  "Técnico en Mantenimiento de Sistemas Neumáticos",
  "Técnico en Instalaciones Eléctricas Residenciales y Comerciales",
  "Técnico en Operación de Plantas de Tratamiento de Aguas Residuales (PTAR)",
  "Técnico en Obras Civiles",
  "Técnico en Montaje y Mantenimiento de Redes de Distribución de Energía",
  "Técnico en Control de Procesos Industriales",
  "Técnico en Mantenimiento de Equipos de Bombeo",
  "Técnico en Seguridad Industrial y Salud Ocupacional",
  "Técnico en Refrigeración y Climatización",
  "Técnico en Gestión de Sistemas de Manejo Ambiental",
  "Técnico en Mantenimiento de Tableros Eléctricos",
  "Técnico en Instalación y Mantenimiento de Redes Contra Incendios",
  "Técnico en Soldadura de Productos Metálicos",
  "Técnico en Mantenimiento de Maquinaria Pesada",
  "Técnico en Electrotecnia",
  "Técnico en Proyectos de Construcción",
  "Técnico en Instalaciones de Redes de Servicios",
  "Técnico en Perforación de Pozos y Excavaciones",
  "Técnico en Impermeabilización y Acabados",
  "Técnico en Operación y Mantenimiento de Redes de Acueducto",
  "Técnico en Sistemas de Iluminación",
  "Técnico en Bobinado de Motores y Transformadores",
  "Técnico en Mantenimiento de Equipos Rotativos",
  "Técnico en Automatización de Edificaciones (Inmótica)",
  "Técnico en Mantenimiento de Infraestructura",
  "Técnico en Gestión Eficiente de la Energía",
  "Técnico en Supervisión de Redes Eléctricas",
  "Técnico en Fontanería y Gas",
  "Técnico en Dibujo Arquitectónico y de Ingeniería",
  "Técnico en Logística de Mantenimiento",
  "Técnico en Control de Calidad Industrial",
  "Técnico en Operación de Sistemas de Riego y Drenaje",
  "Técnico en Mantenimiento de Sistemas de Bombeo Solar",
  "Técnico en Diagnóstico y Reparación de Sistemas Eléctricos Automotrices",
  "Técnico en Montaje de Estructuras Metálicas",
  "Técnico en Instalaciones Eléctricas de Baja Tensión",
  "Técnico en Instalaciones Eléctricas de Media Tensión",
  "Técnico en Mantenimiento de Subestaciones",
  "Técnico en Programación de PLC",
  "Técnico en Sistemas de Puesta a Tierra",
  "Técnico en Mantenimiento de Grupos Electrógenos",
  "Técnico en Mecánica de Fluidos",
  "Técnico en Operación de Calderas y Equipos de Presión",
  "Técnico en Gestión de Recursos Hídricos",
  "Técnico en Instalaciones Hidráulicas y Sanitarias",
  "Técnico en Mantenimiento de Piscinas y Zonas Húmedas",
  "Técnico en Construcción de Redes de Alcantarillado",
  "Técnico en Topografía",
  "Técnico en Suelos y Concretos",
  "Técnico en Enchape y Solados",
  "Técnico en Mantenimiento Locativo",
  "Técnico en Electricidad y Electrónica",
  "Técnico en Metrología",
  "Técnico en Energías Renovables",
  "Técnico en Instalación de Sistemas Fotovoltaicos",
  "Técnico en Mantenimiento de Ascensores y Transporte Vertical",
  "Técnico en Soldadura TIG y MIG",
  "Técnico en Operación de Maquinaria de Excavación",
  "Técnico en Geotecnia",
  "Técnico en Análisis de Muestras Químicas (Agua)",
  "Técnico en Control Ambiental",
  "Técnico en Seguridad en Espacios Confinados",
  "Técnico en Prevención de Riesgos Laborales",
  "Técnico en Supervisión de Obras Civiles",
  "Técnico en Electricidad Naval",
  "Técnico en Mantenimiento de Motores Fuera de Borda",
  "Técnico en Mantenimiento de Equipos Portuarios",
  "Técnico en Instalación de Redes de Gas Natural",
  "Técnico en Domótica",
  "Técnico en Redes de Datos y Cableado Estructurado",
  "Técnico en Mantenimiento de Infraestructura Hospitalaria",
  "Técnico en Mantenimiento de Infraestructura Hotelera",
  "Técnico en Gestión de Activos Industriales",
  "Técnico en Operación de Sistemas de Potabilización",
  "Técnico en Mecánica Industrial",
  "Técnico en Electromecánica de Minería",
  "Técnico en Perforación de Suelos",
  "Técnico en Mantenimiento General",
  "Técnico en Servicios Generales",
  "Técnico en Operaciones de Mantenimiento Correctivo",
  "Técnico en Planificación de Mantenimiento",
  "Técnico en Instalación de Transferencias Automáticas",
  "Técnico en Control y Automatismos Eléctricos",
  "Técnico en Maestro de Obra en Edificaciones",
];

const FormCreateTechnicalAd = ({ onClose, onSuccess }) => {

  const fields = [
    { name: "numero_de_cedula", label: "Cédula", type: "text", inputProps: { maxLength: 10 }, required: true },
    { name: "nombre", label: "Nombre", type: "text", required: true },
    { name: "apellido", label: "Apellido", type: "text", required: true },
    { name: "correo_electronico", label: "Correo electrónico", type: "email", required: true },
    { name: "telefono", label: "Teléfono", type: "text", inputProps: { maxLength: 10 }, required: true },
    { name: "contrasenia", label: "Contraseña", type: "password", required: true },
    { 
      name: "especialidad", 
      label: "Especialidad", 
      type: "autocomplete",
      options: ESPECIALIDADES_HIDROELECTRICAS,
      required: true
    },
  ];

  const handleSubmit = async (data) => {
    const token = localStorage.getItem("authToken");
    const decoded = jwtDecode(token);

    await handleCreateSubmitTechnical(
      data.numero_de_cedula,
      data.nombre,
      data.apellido,
      data.correo_electronico,
      data.telefono,
      data.contrasenia,
      data.especialidad,
      parseInt(decoded.id)
    );
  };

  return (
    <BaseFormModal
      title="Agregar técnico"
      fields={fields}
      onSubmit={handleSubmit}
      onClose={onClose}
      onSuccess={onSuccess}
      successMessage="¡Técnico registrado exitosamente!"
    />
  );
};

export default FormCreateTechnicalAd;
