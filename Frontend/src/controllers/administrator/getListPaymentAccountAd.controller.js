import { administratorService } from "../../services/administrator-service";




const handleGetListPaymentAccountAd = async () => {
  try {
    const response = await administratorService.getListPaymentAccount();
    return response.data;
  } catch (error) {
    console.error("Error en handleGetListPaymentAccountAd:", error);
    throw error;
  }
};
export {handleGetListPaymentAccountAd};
