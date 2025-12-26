class Api::V1::VitalsTrendsController < ApplicationController
    before_action :authorize_request
  
    def show
      patient = @current_doctor.patients.find(params[:patient_id])
      evaluations = patient.evaluations.order(created_at: :asc)
  
      trends = evaluations.map do |e|
        vitals = extract_vitals(e)
        next if vitals.blank?
  
        {
          time: e.created_at,
          heart_rate: vitals[:heart_rate],
          spo2: vitals[:spo2],
          temperature: vitals[:temperature],
          systolic_bp: vitals[:systolic_bp]
        }
      end.compact
  
      render json: {
        patient_id: patient.id,
        patient_name: patient.name,
        trends: trends
      }
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Patient not found" }, status: :not_found
    end
  
    private
  
    # ===============================
    # 🔐 SMART & SAFE VITALS EXTRACTOR
    # ===============================
    def extract_vitals(evaluation)
      source =
        evaluation.try(:vitals) ||
        evaluation.try(:input_data) ||
        evaluation.try(:raw_features)
  
      return nil unless source.is_a?(Hash)
  
      {
        heart_rate: extract_number(source, %w[heart_rate hr pulse]),
        spo2: extract_number(source, %w[spo2 oxygen_saturation]),
        temperature: extract_number(source, %w[temperature temp body_temp]),
        systolic_bp: extract_systolic_bp(source)
      }
    end
  
    # -------------------------------
    # Extract numeric values safely
    # -------------------------------
    def extract_number(hash, keys)
      keys.each do |k|
        val = hash[k] || hash[k.to_sym]
        return val.to_f if val.present?
      end
      nil
    end
  
    # -------------------------------
    # 🩺 SPECIAL HANDLING FOR BP
    # -------------------------------
    def extract_systolic_bp(hash)
      # Case 1: flat systolic key
      %w[systolic_bp systolic bp_sys blood_pressure_sys].each do |k|
        val = hash[k] || hash[k.to_sym]
        return val.to_f if val.present?
      end
  
      # Case 2: nested blood_pressure object
      bp = hash["blood_pressure"] || hash[:blood_pressure]
      if bp.is_a?(Hash)
        val = bp["systolic"] || bp[:systolic]
        return val.to_f if val.present?
      end
  
      # Case 3: "120/80" string
      if bp.is_a?(String) && bp.include?("/")
        systolic = bp.split("/").first
        return systolic.to_f if systolic.present?
      end
  
      nil
    end
  end
  