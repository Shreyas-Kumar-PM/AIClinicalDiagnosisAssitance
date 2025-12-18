class Api::V1::PatientsController < ApplicationController
  before_action :authorize_request
  before_action :set_patient, only: [:show, :destroy]

  # -------------------------
  # GET /patients
  # -------------------------
  def index
    patients = @current_doctor.patients
    render json: patients
  end

  # -------------------------
  # POST /patients
  # -------------------------
  def create
    patient = @current_doctor.patients.new(patient_params)

    if patient.save
      render json: patient, status: :created
    else
      render json: { errors: patient.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # -------------------------
  # GET /patients/:id
  # -------------------------
  def show
    render json: @patient
  end

  # -------------------------
  # DELETE /patients/:id
  # -------------------------
  def destroy
    @patient.destroy

    render json: {
      message: "Patient deleted successfully",
      patient_id: @patient.id
    }, status: :ok
  end

  private

  # -------------------------
  # Helpers
  # -------------------------
  def set_patient
    @patient = @current_doctor.patients.find(params[:id])
  end

  def patient_params
    params.require(:patient).permit(:name, :age, :gender)
  end
end
