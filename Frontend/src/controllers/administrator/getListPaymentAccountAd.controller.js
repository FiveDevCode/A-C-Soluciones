import { administratorService } from "../../services/administrator-service";




const handleGetListPaymentAccountAd = async () => {
  try {
    const response = await administratorService.getListPaymentAccount();
    return response.data.slice().reverse();
  } catch (error) {
    console.error("Error en handleGetListPaymentAccountAd:", error);
    throw error;
  }
};
export {handleGetListPaymentAccountAd};
