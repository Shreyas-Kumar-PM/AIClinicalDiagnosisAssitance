import axios from "axios";

const API_BASE = "http://localhost:3000/api/v1";

export const evaluateVoiceDiagnosis = async ({ patientId, audioBlob, token }) => {
  const formData = new FormData();
  formData.append("patient_id", patientId);
  formData.append("audio", audioBlob, "recording.wav");

  const response = await axios.post(
    `${API_BASE}/voice_diagnosis/evaluate`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
