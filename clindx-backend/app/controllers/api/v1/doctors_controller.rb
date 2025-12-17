class Api::V1::DoctorsController < ApplicationController
    def profile
      render json: {
        id: @current_doctor.id,
        name: @current_doctor.name,
        email: @current_doctor.email,
        specialization: @current_doctor.specialization,
        joined_at: @current_doctor.created_at
      }
    end
  end
  