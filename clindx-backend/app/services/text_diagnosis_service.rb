class TextDiagnosisService
    def self.call(text:, patient:)
      ml_response = MlDiagnosisClient.predict(text)
  
      {
        primary_diagnosis: ml_response["primary_diagnosis"],
        risk_score: ml_response["risk_score"].to_f,
        high_risk: ml_response["risk_score"].to_f >= 0.7,
        model_outputs: {
          classical_symptom_prediction: ml_response["symptom_prediction"],
          vitals_risk_probability: ml_response["vitals_risk"],
          lab_risk_probability: ml_response["lab_risk"],
          hf_explanation: ml_response["explanation"]
        }
      }
    rescue => e
      Rails.logger.error("TextDiagnosisService error: #{e.message}")
      {
        primary_diagnosis: "Unknown",
        risk_score: 0.0,
        high_risk: false,
        model_outputs: {}
      }
    end
  end
  