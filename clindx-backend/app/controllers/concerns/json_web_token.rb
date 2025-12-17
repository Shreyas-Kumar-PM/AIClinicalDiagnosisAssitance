module JsonWebToken
    SECRET_KEY = Rails.application.secret_key_base
  
    def encode_token(payload)
      JWT.encode(payload, SECRET_KEY)
    end
  
    def decode_token(token)
      JWT.decode(token, SECRET_KEY)[0]
    end
  end
  