class Api::V1::AuditLogsController < ApplicationController
    def index
      logs = current_doctor.audit_logs.order(created_at: :desc)
      render json: logs, status: :ok
    end
  end
  