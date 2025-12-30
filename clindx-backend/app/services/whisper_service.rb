require 'tempfile'
require 'open3'
require 'json'

class WhisperService
  PYTHON_BIN = Rails.root.join("whisper-env/bin/python").to_s
  MODEL = "base"

  def self.transcribe(uploaded_audio)
    Tempfile.create(["audio", ".wav"]) do |file|
      file.binmode
      file.write(uploaded_audio.read)
      file.flush

      python_code = <<~PYTHON
        import whisper, json, sys
        model = whisper.load_model("#{MODEL}")
        result = model.transcribe(sys.argv[1], language="en")
        print(json.dumps({"text": result["text"]}))
      PYTHON

      stdout, stderr, status = Open3.capture3(
        PYTHON_BIN,
        "-c",
        python_code,
        file.path
      )

      raise "Whisper error: #{stderr}" unless status.success?

      JSON.parse(stdout)["text"]
    end
  end
end
