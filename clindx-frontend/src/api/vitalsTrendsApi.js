import axios from "./axios";

export const getVitalsTrends = (patientId) => {
  return axios.get(`/vitals_trends/${patientId}`);
};
