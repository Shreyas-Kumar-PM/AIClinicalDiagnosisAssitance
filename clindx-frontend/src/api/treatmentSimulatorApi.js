import api from "./axios";

export const runTreatmentSimulation = (data) =>
  api.post("/simulator/treatment_response", data);
