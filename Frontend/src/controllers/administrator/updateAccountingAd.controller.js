import { administratorService } from "../../services/administrator-service";

const handleUpdateAccountingAd = async (id, data) => {
  try {
    console.log('🎯 [CONTROLLER FRONTEND] ID:', id);
    console.log('🎯 [CONTROLLER FRONTEND] Data recibido:', data);
    console.log('🎯 [CONTROLLER FRONTEND] Tipo de data:', typeof data);
    console.log('🎯 [CONTROLLER FRONTEND] Keys de data:', Object.keys(data));
    
    // IMPORTANTE: Envía el objeto directamente, NO lo envuelvas en otro objeto
    const response = await administratorService.updateAccounting(id, data);
    
    console.log('✅ [CONTROLLER FRONTEND] Respuesta del servidor:', response);
    
    return response;
  } catch (error) {
    console.error('❌ [CONTROLLER FRONTEND] Error:', error);
    throw error;
  }
};

export { handleUpdateAccountingAd };
