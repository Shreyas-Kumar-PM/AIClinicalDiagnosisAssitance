import api from "./axios";

export const fetchEarlyWarnings = () =>
  api.get("/early_warning");

export const fetchPatientWarning = (patientId) =>
  api.get(`/early_warning/${patientId}`);
