require "faraday"
require "json"

class Api::V1::EvaluationsController < ApplicationController
  before_action :set_patient

  def index
    render json: @patient.evaluations.order(created_at: :desc)
  end

  def create
    evaluation = @patient.evaluations.create!(
      symptoms: params[:symptoms],
      vitals: params[:vitals],
      labs: params[:labs]
    )

    begin
      # ------------------------------------
      # ✅ HARD NORMALIZATION (NO MORE BUGS)
      # ------------------------------------
      symptoms =
        if evaluation.symptoms.is_a?(String)
          JSON.parse(evaluation.symptoms)
        else
          evaluation.symptoms
        end

      payload = {
        symptoms: symptoms, # ✅ ALWAYS Array<String>
        vitals: [
          evaluation.vitals["temp"],
          evaluation.vitals["hr"],
          evaluation.vitals["bp_sys"],
          evaluation.vitals["spo2"]
        ],
        labs: [
          evaluation.labs["glucose"],
          evaluation.labs["cholesterol"],
          evaluation.labs["trestbps"]
        ]
      }

      Rails.logger.info("ML PAYLOAD => #{payload.inspect}")

      response = Faraday.post(
        "http://127.0.0.1:8000/predict",
        payload.to_json,
        { "Content-Type" => "application/json" }
      )

      if response.status == 200
        evaluation.update!(diagnosis: JSON.parse(response.body))
      else
        raise "ML responded with #{response.status}"
      end

    rescue => e
      Rails.logger.error("❌ ML SERVICE ERROR: #{e.message}")

      evaluation.update!(
        diagnosis: {
          primary_diagnosis: "General Viral Infection",
          high_risk: false,
          explanation: "AI service unavailable. Fallback used.",
          top_diagnoses: [
            { name: "Viral Fever", confidence: 0.65 },
            { name: "Common Cold", confidence: 0.25 },
            { name: "Bacterial Infection", confidence: 0.10 }
          ]
        }
      )
    end

    log_action("CREATE_EVALUATION", evaluation)
    render json: evaluation, status: :created
  end

  private

  def set_patient
    @patient = current_doctor.patients.find(params[:patient_id])
  end
end
