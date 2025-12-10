



import { administratorService } from "../../services/administrator-service";

const handleGetListAdministrator = async () => {
  try {
    const res = await administratorService.getListAdministrator();
    return (res.data || []).slice().reverse();
  } catch (err) {
    throw err;
  }
};


export {handleGetListAdministrator};