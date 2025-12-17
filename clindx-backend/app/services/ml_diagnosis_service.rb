class MlDiagnosisService
    include HTTParty
    base_uri "http://127.0.0.1:8000"
  
    def self.run(symptoms:, vitals:, labs:)
      response = post(
        "/predict",
        headers: { "Content-Type" => "application/json" },
        body: {
          symptoms: symptoms,
          vitals: vitals,
          labs: labs
        }.to_json
      )
  
      JSON.parse(response.body)
    rescue
      { error: "ML service unavailable" }
    end
  end
  