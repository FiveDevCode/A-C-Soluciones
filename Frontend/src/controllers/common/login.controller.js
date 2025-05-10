import { commonService } from "../../services/common-service";




const handleLogin = (email, password) => {

    return commonService
    .login(email, password)


};


export {handleLogin};