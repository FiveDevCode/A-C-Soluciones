import { administratorService } from "../../services/administrator-service";

const handleGetListBillAd = async () => {
  try {
    const res = await administratorService.getListBill();
    return (res.data || []).slice().reverse();
  } catch (err) {
    throw err;
  }
};

export { handleGetListBillAd };
