module Api
    module V1
      class DashboardController < ApplicationController
        # GET /api/v1/dashboard/summary
        def summary
          patients = current_doctor.patients
  
          evaluations =
            Evaluation
              .joins(:patient)
              .where(patients: { doctor_id: current_doctor.id })
              .order(created_at: :asc)
  
          # ======================
          # BASIC COUNTS
          # ======================
          active_patients = patients.count
          evaluations_run = evaluations.count
  
          high_risk_flags =
            evaluations.count do |e|
              e.diagnosis.is_a?(Hash) && e.diagnosis["high_risk"] == true
            end
  
          # ======================
          # RISK TREND (by date)
          # ======================
          risk_trend =
            evaluations.group_by { |e| e.created_at.to_date }.map do |date, evs|
              {
                date: date,
                high_risk_count: evs.count { |e|
                  e.diagnosis.is_a?(Hash) && e.diagnosis["high_risk"] == true
                },
                total: evs.count
              }
            end
  
          # ======================
          # DIAGNOSIS DISTRIBUTION
          # ======================
          diagnosis_distribution =
            evaluations
              .map { |e| e.diagnosis&.dig("primary_diagnosis") }
              .compact
              .tally
              .map { |k, v| { name: k, count: v } }
  
          # ======================
          # RECENT EVALUATIONS
          # ======================
          recent =
            evaluations.last(5).reverse.map do |e|
              {
                patient: e.patient.name,
                primary_diagnosis: e.diagnosis&.dig("primary_diagnosis") || "Unknown",
                high_risk: e.diagnosis&.dig("high_risk") || false,
                created_at: e.created_at
              }
            end
  
          render json: {
            active_patients: active_patients,
            evaluations_run: evaluations_run,
            high_risk_flags: high_risk_flags,
            risk_trend: risk_trend,
            diagnosis_distribution: diagnosis_distribution,
            recent_evaluations: recent
          }
        end
      end
    end
  end
  