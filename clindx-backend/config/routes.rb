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

      # ---------- WHAT-IF CLINICAL SIMULATOR (NEW) ----------
      post "/simulator/what_if", to: "simulator#what_if"

    end
  end
end
