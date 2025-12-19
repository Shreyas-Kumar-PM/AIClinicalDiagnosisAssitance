import api from "./axios";

/**
 * Run what-if clinical simulation
 */
export const runWhatIfSimulation = (vitals) =>
  api.post("/simulator/what_if", { vitals });
