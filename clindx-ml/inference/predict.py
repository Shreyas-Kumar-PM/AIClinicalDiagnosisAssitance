# ❌ REMOVE any import like:
# from inference.predict import predict

def predict(symptoms, vitals, labs):
    temp, hr, bp_sys, spo2 = vitals
    glucose, cholesterol, trestbps = labs

    high_risk = temp >= 39 or bp_sys < 90 or spo2 < 92

    if high_risk:
        primary = "Sepsis Risk"
    elif temp > 38:
        primary = "Viral Fever"
    else:
        primary = "Normal"

    return {
        "primary_diagnosis": primary,
        "high_risk": high_risk,
        "explanation": "Rule-based demo model",
        "top_diagnoses": [
            {"name": "Viral Fever", "confidence": 0.6},
            {"name": "Bacterial Infection", "confidence": 0.3},
            {"name": "Sepsis", "confidence": 0.1}
        ]
    }
