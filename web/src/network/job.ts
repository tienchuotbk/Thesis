import { AxiosRequestConfig, AxiosResponse } from "axios";
import axiosClient from "./api-client";

const JobApi = {
  getAll: (config: AxiosRequestConfig) => {
    return axiosClient.get(`/jobs/`, config);
  },
  getById: (id: string) => {
    return axiosClient.get(`/jobs/${id}`);
  },
  getListRecommendById: (id: string): Promise<{ payload: any }> => {
    return axiosClient.get(`/jobs/${id}/recommend`);
  },
};

export default JobApi;
