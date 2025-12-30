class SpeechToTextService
    include HTTParty
    base_uri "http://127.0.0.1:8000"
  
    def self.call(audio_file)
      response = post(
        "/transcribe",
        body: {
          file: audio_file
        }
      )
  
      response.success? ? response.parsed_response["text"] : nil
    rescue => e
      Rails.logger.error("SpeechToTextService error: #{e.message}")
      nil
    end
  end
  