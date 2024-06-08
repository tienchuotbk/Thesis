import axios from "axios";

const axiosClient = axios.create({
  baseURL: `${process.env.VITE_API_URL}/api`,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    let res = error.response;
    if (res.status == 401) {
    }
    console.error(`Looks like there was a problem. Status Code: “ + res.status`);
    return Promise.reject(error);
  }
);

export default axiosClient;
