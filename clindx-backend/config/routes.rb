Rails.application.routes.draw do
  namespace :api, defaults: { format: :json } do
    namespace :v1 do

      # ---------- AUTH ----------
      post "/register", to: "auth#register"
      post "/login",    to: "auth#login"

      # ---------- DOCTOR ----------
      get "/profile", to: "doctors#profile"

      # ---------- AUDIT LOGS ----------
      resources :audit_logs, only: [:index]

      # ---------- PATIENTS & EVALUATIONS ----------
      resources :patients do
        resources :evaluations, only: [:index, :show, :create]
      end

      # ---------- DASHBOARD ----------
      get "/dashboard/summary", to: "dashboard#summary"

      # ---------- EARLY WARNING ----------
      get "/early_warning", to: "early_warning#index"
      get "/early_warning/:patient_id", to: "early_warning#show"

      # ---------- ✅ VITALS TRENDS ----------
      get "/vitals_trends/:patient_id", to: "vitals_trends#show"

    end
  end
end
