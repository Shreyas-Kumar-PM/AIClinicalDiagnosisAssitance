class Api::V1::AuthController < ApplicationController
    # 🔥 IMPORTANT FIX
    skip_before_action :authorize_request, only: [:login, :register]
  
    # POST /api/v1/login
    def login
      doctor = Doctor.find_by(email: params[:email])
  
      if doctor&.authenticate(params[:password])
        token = JwtService.encode(doctor_id: doctor.id)
        render json: { token: token }, status: :ok
      else
        render json: { error: "Invalid credentials" }, status: :unauthorized
      end
    end
  
    # POST /api/v1/register
    def register
      doctor = Doctor.new(doctor_params)
  
      if doctor.save
        token = JwtService.encode(doctor_id: doctor.id)
        render json: { token: token }, status: :created
      else
        render json: { errors: doctor.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
    private
  
    def doctor_params
      params.require(:doctor).permit(
        :name,
        :email,
        :specialization,
        :password
      )
    end
  end
  