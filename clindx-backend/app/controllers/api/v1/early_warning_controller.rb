module Api
  module V1
    class EarlyWarningController < ApplicationController
      def index
        patients = current_doctor.patients.includes(:evaluations)

        data = patients.map do |patient|
          eval = patient.evaluations.order(created_at: :desc).first

          if eval.nil?
            next build_empty(patient)
          end

          diagnosis = eval.diagnosis || {}

          score, triggers = compute_score(eval, diagnosis)

          {
            patient_id: patient.id,
            patient_name: patient.name,
            score: score,                       # 0–100
            risk_label: risk_label(score),
            triggers: triggers,
            last_evaluation_at: eval.created_at
          }
        end.compact

        render json: data
      end

      private

      def build_empty(patient)
        {
          patient_id: patient.id,
          patient_name: patient.name,
          score: 0,
          risk_label: "Low",
          triggers: [],
          last_evaluation_at: nil
        }
      end

      def compute_score(eval, diagnosis)
        score = 0
        triggers = []

        vitals = eval.vitals || {}

        if vitals["spo2"].to_i < 92
          score += 30
          triggers << "Low oxygen saturation"
        end

        if vitals["hr"].to_i > 120
          score += 20
          triggers << "Tachycardia"
        end

        if vitals["temp"].to_f > 39
          score += 15
          triggers << "High fever"
        end

        if diagnosis["high_risk"] == true
          score += 35
          triggers << "AI flagged high-risk diagnosis"
        end

        [score.clamp(0, 100), triggers]
      end

      def risk_label(score)
        return "High" if score >= 70
        return "Moderate" if score >= 40
        "Low"
      end
    end
  end
end
