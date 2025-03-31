// hooks/useApi.js
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';
import axios from "axios";

const useApi = () => {
 
const authHeader = useAuthHeader();
console.log(authHeader.split(' ')[1]);
  // Create the axios instance with the Authorization header
  const api = axios.create({
    baseURL: "https://eduapi.senaycreatives.com",
    headers: {
      Authorization: authHeader.split(' ')[1],
    },
  
  });

  return api;
};

export default useApi;
