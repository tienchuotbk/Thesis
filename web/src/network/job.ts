import { AxiosRequestConfig, AxiosResponse } from "axios";
import axiosClient from "./api-client";

const JobApi = {
  getAll: (config: AxiosRequestConfig) => {
    return axiosClient.get(`/jobs/`, config);
  },
  getById: (id: string, uid: string) => {
    return axiosClient.get(`/jobs/${id}?uid=${uid}`);
  },
  getListRecommendById: (id: string, uid: string): Promise<{ payload: any }> => {
    return axiosClient.get(`/jobs/${id}/recommend?uid=${uid}`);
  },
};

export default JobApi;
