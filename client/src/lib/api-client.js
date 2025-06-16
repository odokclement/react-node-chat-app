import { HOST } from "@/utils/constants";
import axios from "axios";


const apiClent = axios.create({
    baseURL:HOST,
});

export default apiClent;