module Api
    module V1
      class SimulatorController < ApplicationController
        # Uses authorize_request from ApplicationController
  
        def what_if
          vitals = params.require(:vitals).permit(
            :heart_rate,
            :systolic_bp,
            :diastolic_bp,
            :respiratory_rate,
            :spo2,
            :temperature
          )
  
          risk_score = calculate_risk(vitals)
          risk_label =
            if risk_score >= 0.75
              "High"
            elsif risk_score >= 0.4
              "Moderate"
            else
              "Low"
            end
  
          render json: {
            simulated_risk_score: risk_score.round(2),
            simulated_risk_label: risk_label,
            explanation: explain_change(vitals, risk_score)
          }
        end
  
        private
  
        def calculate_risk(v)
          score = 0.0
  
          score += 0.2 if v[:heart_rate].to_i > 120
          score += 0.2 if v[:respiratory_rate].to_i > 28
          score += 0.25 if v[:spo2].to_i < 92
          score += 0.2 if v[:systolic_bp].to_i < 90
          score += 0.15 if v[:temperature].to_f > 39.0
  
          [score, 1.0].min
        end
  
        def explain_change(v, score)
          reasons = []
  
          reasons << "Elevated heart rate increases physiological stress." if v[:heart_rate].to_i > 120
          reasons << "Low oxygen saturation indicates respiratory compromise." if v[:spo2].to_i < 92
          reasons << "Hypotension suggests circulatory instability." if v[:systolic_bp].to_i < 90
          reasons << "High respiratory rate reflects increased work of breathing." if v[:respiratory_rate].to_i > 28
          reasons << "High fever increases metabolic demand." if v[:temperature].to_f > 39.0
  
          reasons.empty? ?
            "Vitals remain within acceptable clinical ranges." :
            reasons.join(" ")
        end
      end
    end
  end
  