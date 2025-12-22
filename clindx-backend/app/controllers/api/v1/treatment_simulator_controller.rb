module Api
    module V1
      class TreatmentSimulatorController < ApplicationController
        # POST /api/v1/simulator/treatment_response
        def treatment_response
          treatment = params.require(:treatment).permit(
            :type,
            :dose,
            :duration_hours,
            :ventilation
          )
  
          score = calculate_response_score(treatment)
  
          label =
            if score >= 0.75
              "Good"
            elsif score >= 0.45
              "Moderate"
            else
              "Poor"
            end
  
          render json: {
            response_score: score.round(2),
            response_label: label,
            explanation: explanation_for(treatment, score)
          }
        end
  
        private
  
        def calculate_response_score(t)
          score = 0.2 # baseline
  
          # Treatment type
          score += 0.25 if t[:type] == "antibiotic"
  
          # Dose effect
          dose = t[:dose].to_i
          score += dose * 0.1
  
          # Duration effect (caps at 48h)
          duration = [t[:duration_hours].to_i, 48].min
          score += (duration / 24.0) * 0.15
  
          # Ventilation effect
          if t[:ventilation] == "non_invasive"
            score += 0.15
          end
  
          [score, 1.0].min
        end
  
        def explanation_for(t, score)
          reasons = []
  
          reasons << "Antibiotic therapy improves infection control." if t[:type] == "antibiotic"
          reasons << "Higher dose enhances therapeutic effect." if t[:dose].to_i >= 3
          reasons << "Longer treatment duration supports sustained recovery." if t[:duration_hours].to_i >= 24
          reasons << "Ventilatory support reduces respiratory workload." if t[:ventilation] == "non_invasive"
  
          summary =
            if score >= 0.75
              "Overall response is expected to be favorable."
            elsif score >= 0.45
              "Partial improvement is expected with current therapy."
            else
              "Limited response expected; reassessment advised."
            end
  
          (reasons + [summary]).join(" ")
        end
      end
    end
  end
  