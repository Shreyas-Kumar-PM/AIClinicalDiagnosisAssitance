module Api
    module V1
      class VoiceDiagnosisController < ApplicationController
        skip_before_action :authorize_request, only: [:evaluate]
  
        def evaluate
          audio = params[:audio]
          patient_id = params[:patient_id]
  
          return render json: { error: "Audio missing" }, status: :bad_request unless audio
          return render json: { error: "Patient ID missing" }, status: :bad_request unless patient_id
  
          # 1️⃣ Speech → Text
          transcript = WhisperService.transcribe(audio)
  
          # 2️⃣ Convert transcript into ML-compatible format
          symptoms = transcript.present? ? transcript.split(/,|and|\./).map(&:strip) : []
          vitals   = [] # voice-only mode
          labs     = [] # voice-only mode
  
          # 3️⃣ Call ML service
          diagnosis = ::MlDiagnosisService.run(
            symptoms: symptoms,
            vitals: vitals,
            labs: labs
          )
  
          render json: {
            patient_id: patient_id,
            transcript: transcript,
            symptoms: symptoms,
            diagnosis: diagnosis
          }
        rescue => e
          Rails.logger.error(e.full_message)
          render json: { error: e.message }, status: :internal_server_error
        end
      end
    end
  end
  