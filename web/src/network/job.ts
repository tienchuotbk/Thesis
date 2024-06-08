import axiosClient from "./api-client";

const JobApi = {
  getById: (id: string) => {
    return axiosClient.get(`/jobs/${id}`);
  },
};

export default JobApi;
