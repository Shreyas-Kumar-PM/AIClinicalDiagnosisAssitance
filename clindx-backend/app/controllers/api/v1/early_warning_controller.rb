module Api
    module V1
      class EarlyWarningController < ApplicationController
        def index
          patients = @current_doctor.patients
  
          results = patients.map do |patient|
            evaluation = patient.evaluations.order(created_at: :desc).first
  
            if evaluation.nil?
              {
                patient_id: patient.id,
                patient_name: patient.name,
                score: 0,
                risk_label: "Low",
                triggers: [],
                last_evaluation_at: nil
              }
            else
              vitals = extract_vitals(evaluation)
              score, triggers = compute_score(vitals)
  
              {
                patient_id: patient.id,
                patient_name: patient.name,
                score: score,
                risk_label: risk_label(score),
                triggers: triggers,
                last_evaluation_at: evaluation.created_at
              }
            end
          end
  
          render json: results
        end
  
        private
  
        # ✅ Safely extract vitals from evaluation JSON
        def extract_vitals(evaluation)
          evaluation.respond_to?(:vitals) && evaluation.vitals.is_a?(Hash) ?
            evaluation.vitals :
            {}
        end
  
        # ✅ Compute score safely and cap it
        def compute_score(v)
          score = 0
          triggers = []
  
          if v["heart_rate"].to_i > 120
            score += 20
            triggers << "Elevated heart rate"
          end
  
          if v["respiratory_rate"].to_i > 28
            score += 20
            triggers << "High respiratory rate"
          end
  
          if v["spo2"].to_i > 0 && v["spo2"].to_i < 92
            score += 30
            triggers << "Low oxygen saturation"
          end
  
          if v["systolic_bp"].to_i > 0 && v["systolic_bp"].to_i < 90
            score += 20
            triggers << "Low blood pressure"
          end
  
          if v["temperature"].to_f > 39
            score += 10
            triggers << "High temperature"
          end
  
          [ [score, 100].min, triggers ]
        end
  
        def risk_label(score)
          return "High" if score >= 70
          return "Moderate" if score >= 40
          "Low"
        end
      end
    end
  end
  