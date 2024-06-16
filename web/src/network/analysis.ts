import { AxiosRequestConfig } from "axios";
import axiosClient from "./api-client";

const AnalysisApi = {
  getMap: (config: AxiosRequestConfig) => {
    return axiosClient.get(`/analysis/map`, config);
  },
  getPie: (config: AxiosRequestConfig) => {
    return axiosClient.get(`/analysis/pie`, config);
  },
};

export default AnalysisApi;
