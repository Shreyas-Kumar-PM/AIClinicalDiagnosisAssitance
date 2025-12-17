class ApplicationController < ActionController::API
    before_action :authorize_request
  
    attr_reader :current_doctor
  
    private
  
    def authorize_request
      header = request.headers["Authorization"]
      token = header.split(" ").last if header
  
      decoded = JwtService.decode(token)
  
      if decoded
        @current_doctor = Doctor.find(decoded[:doctor_id])
      else
        render json: { error: "Unauthorized" }, status: :unauthorized
      end
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Unauthorized" }, status: :unauthorized
    end
  
    def log_action(action, auditable)
      AuditLog.create!(
        doctor: @current_doctor,
        action: action,
        auditable_type: auditable.class.name,
        auditable_id: auditable.id,
        metadata: auditable.as_json
      )
    end
  end
  