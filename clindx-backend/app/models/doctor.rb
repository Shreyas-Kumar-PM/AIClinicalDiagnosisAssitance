class Doctor < ApplicationRecord
    has_secure_password
    has_many :patients
    has_many :audit_logs
    validates :email, presence: true, uniqueness: true
  end
  