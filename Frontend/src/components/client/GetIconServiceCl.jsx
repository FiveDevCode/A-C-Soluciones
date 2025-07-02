import {
  FaPumpSoap,
  FaFireExtinguisher,
  FaBolt,
  FaCogs,
  FaTools,
  FaWater,
  FaLightbulb,
  FaScrewdriver,
  FaSolarPanel,
  FaRobot,
  FaSwimmingPool,
  FaWarehouse,
  FaHardHat,
  FaOilCan,
  FaCheckCircle,
} from "react-icons/fa";

const getIconByService = (name = "") => {
  const lower = name.toLowerCase();

  // === Bombas y presión ===
  if (lower.includes("centrifuga")) return <FaPumpSoap size={28} />;
  if (lower.includes("sumergible") || lower.includes("lapicero")) return <FaWater size={28} />;
  if (lower.includes("freático")) return <FaWater size={28} />;
  if (lower.includes("piscina")) return <FaSwimmingPool size={28} />;
  if (lower.includes("red contra incendios") && lower.includes("bomba")) return <FaFireExtinguisher size={28} />;
  if (lower.includes("velocidad variable")) return <FaCogs size={28} />;
  if (lower.includes("aguas residuales") || lower.includes("ptar")) return <FaWarehouse size={28} />;

  // === Planta eléctrica ===
  if (lower.includes("motor") && !lower.includes("prueba")) return <FaBolt size={28} />;
  if (lower.includes("sistema eléctrico")) return <FaBolt size={28} />;
  if (lower.includes("prueba de motor")) return <FaCheckCircle size={28} />;

  // === Incendios y brazos hidráulicos ===
  if (lower.includes("red contra incendios")) return <FaFireExtinguisher size={28} />;
  if (lower.includes("brazos hidráulicos")) return <FaOilCan size={28} />;

  // === Electricidad e iluminación ===
  if (lower.includes("instalaciones eléctricas")) return <FaBolt size={28} />;
  if (lower.includes("iluminación")) return <FaLightbulb size={28} />;
  if (lower.includes("transferencias")) return <FaScrewdriver size={28} />;

  // === Tableros, automatización, PLC ===
  if (lower.includes("tableros de control")) return <FaSolarPanel size={28} />;
  if (lower.includes("arrancadores") || lower.includes("variadores de velocidad")) return <FaCogs size={28} />;
  if (lower.includes("automatizaciones") || lower.includes("plc")) return <FaRobot size={28} />;

  // === Piscinas e impermeabilización ===
  if (lower.includes("fragua de piscinas")) return <FaSwimmingPool size={28} />;
  if (lower.includes("impermeabilización")) return <FaWarehouse size={28} />;

  // === Pozos profundos ===
  if (lower.includes("pozos")) return <FaWater size={28} />;

  // === Lavado y desinfección ===
  if (lower.includes("lavado") || lower.includes("desinfección") || lower.includes("tanques de almacenamiento")) return <FaHardHat size={28} />;
  if (lower.includes("chequeo general") || lower.includes("empaques") || lower.includes("válvulas")) return <FaHardHat size={28} />;

  // === Default ===
  return <FaTools size={28} />;
};

export default getIconByService