import { commonService } from "../../services/common-service"


const handleGetListClient = async () => {

    try {
      const res = await commonService.getListClient();
      return (res.data || []).slice().reverse();
    } catch (err) {
      throw err;
    }

}

export {handleGetListClient}