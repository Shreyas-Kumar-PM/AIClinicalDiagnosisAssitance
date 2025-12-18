import api from "./axios";

/**
 * Fetch all patients
 */
export const getPatients = () => api.get("/patients");

/**
 * Add a new patient
 */
export const addPatient = (data) =>
  api.post("/patients", { patient: data });

/**
 * Delete a patient by ID
 */
export const deletePatient = (id) =>
  api.delete(`/patients/${id}`);
