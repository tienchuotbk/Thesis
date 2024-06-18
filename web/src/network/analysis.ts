import { AxiosRequestConfig } from "axios";
import axiosClient from "./api-client";

const AnalysisApi = {
  getMap: (config: AxiosRequestConfig) => {
    return axiosClient.get(`/analysis/map`, config);
  },
  getPie: (config: AxiosRequestConfig) => {
    return axiosClient.get(`/analysis/pie`, config);
  },
  getTable: (config: AxiosRequestConfig) => {
    return axiosClient.get(`/analysis/table`, config);
  },
  getLine: (config: AxiosRequestConfig) => {
    return axiosClient.get(`/analysis/line`, config);
  },
};

export default AnalysisApi;
