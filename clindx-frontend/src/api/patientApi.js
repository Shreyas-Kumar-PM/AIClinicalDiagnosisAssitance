import api from "./axios";

export const getPatients = () => api.get("/patients");
export const addPatient = (data) => api.post("/patients", { patient: data });
