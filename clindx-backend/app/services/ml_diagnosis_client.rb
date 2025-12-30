class MlDiagnosisClient
    require "net/http"
    require "json"
  
    ML_URL = ENV["ML_SERVICE_URL"] || "http://localhost:8000/predict"
  
    def self.predict(text)
      uri = URI.parse(ML_URL)
  
      request = Net::HTTP::Post.new(uri)
      request["Content-Type"] = "application/json"
      request.body = { symptoms: text }.to_json
  
      response = Net::HTTP.start(
        uri.hostname,
        uri.port,
        read_timeout: 60
      ) { |http| http.request(request) }
  
      JSON.parse(response.body)
    end
  end
  