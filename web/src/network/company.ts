import { AxiosRequestConfig } from "axios";
import axiosClient from "./api-client";

const CompanyApi = {
  getAll: (config: AxiosRequestConfig) => {
    return axiosClient.get(`/companies/`, config);
  },
  getById: (id: string) => {
    return axiosClient.get(`/companies/${id}`);
  },
  getJobsById: (id: string) => {
    return axiosClient.get(`/companies/${id}/jobs`);
  },
  analytics: () => {
    return axiosClient.get(`/companies/analytics`);
  },
};

export default CompanyApi;
