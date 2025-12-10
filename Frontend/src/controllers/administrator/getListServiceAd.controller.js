import { administratorService } from "../../services/administrator-service";

const handleGetListServiceAd = async () => {
  try {
    const res = await administratorService.getServiceList();

    const data = res.data.data || [];

    // Ordenar por id de mayor a menor
    return data.sort((a, b) => b.id - a.id);
  } catch (err) {
    throw err;
  }
};

export { handleGetListServiceAd };
