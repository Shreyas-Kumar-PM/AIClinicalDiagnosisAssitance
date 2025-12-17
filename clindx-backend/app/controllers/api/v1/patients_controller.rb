class Api::V1::PatientsController < ApplicationController
    before_action :authorize_request
  
    def index
      patients = @current_doctor.patients
      render json: patients
    end
  
    def create
      patient = @current_doctor.patients.new(patient_params)
      if patient.save
        render json: patient, status: :created
      else
        render json: { errors: patient.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
    def show
      patient = @current_doctor.patients.find(params[:id])
      render json: patient
    end
  
    private
  
    def patient_params
      params.require(:patient).permit(:name, :age, :gender)
    end
  end
  