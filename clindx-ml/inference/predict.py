import os
import numpy as np
import joblib

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

# -----------------------------
# Load models safely with joblib
# -----------------------------
symptom_encoder = joblib.load(
    os.path.join(MODEL_DIR, "symptom_encoder.pkl")
)

symptom_model = joblib.load(
    os.path.join(MODEL_DIR, "symptom_model.pkl")
)

vitals_model = joblib.load(
    os.path.join(MODEL_DIR, "vitals_model.pkl")
)

lab_model = joblib.load(
    os.path.join(MODEL_DIR, "lab_model.pkl")
)

# Optional: load feature orders (recommended)
try:
    vitals_features = joblib.load(os.path.join(MODEL_DIR, "vitals_features.pkl"))
    lab_features = joblib.load(os.path.join(MODEL_DIR, "lab_features.pkl"))
except Exception:
    vitals_features = ["temp", "hr", "bp_sys", "spo2"]
    lab_features = ["glucose", "cholesterol", "trestbps"]


# -----------------------------
# Main prediction function
# -----------------------------
def predict(symptoms, vitals, labs):
    """
    symptoms: List[str]
    vitals:   List[float]  -> [temp, hr, bp_sys, spo2]
    labs:     List[float]  -> [glucose, cholesterol, trestbps]
    """

    # -----------------------------
    # Encode symptoms correctly
    # -----------------------------
    # MultiLabelBinarizer expects List[List[str]]
    encoded_symptoms = symptom_encoder.transform([symptoms])
    symptom_pred = symptom_model.predict(encoded_symptoms)[0]
    symptom_probs = symptom_model.predict_proba(encoded_symptoms)[0]

    # -----------------------------
    # Vitals prediction
    # -----------------------------
    vitals_arr = np.array(vitals).reshape(1, -1)
    vitals_pred = vitals_model.predict(vitals_arr)[0]
    vitals_prob = vitals_model.predict_proba(vitals_arr)[0][1]

    # -----------------------------
    # Labs prediction
    # -----------------------------
    labs_arr = np.array(labs).reshape(1, -1)
    lab_pred = lab_model.predict(labs_arr)[0]
    lab_prob = lab_model.predict_proba(labs_arr)[0][1]

    # -----------------------------
    # Combine model outputs
    # -----------------------------
    avg_risk = float(np.mean([vitals_prob, lab_prob]))

    # -----------------------------
    # FINAL DIAGNOSIS (MODEL-DRIVEN)
    # -----------------------------
    if vitals_pred == 1 and lab_pred == 1:
        diagnosis = "Sepsis Risk"
        high_risk = True
    elif symptom_pred != "Healthy" and avg_risk > 0.4:
        diagnosis = "Bacterial Infection"
        high_risk = False
    else:
        diagnosis = "Viral Infection"
        high_risk = False

    return {
        "primary_diagnosis": diagnosis,
        "high_risk": high_risk,
        "risk_score": round(avg_risk, 2),
        "model_outputs": {
            "symptom_prediction": symptom_pred,
            "vitals_risk_probability": round(vitals_prob, 2),
            "lab_risk_probability": round(lab_prob, 2)
        },
        "top_diagnoses": [
            {"name": "Viral Infection", "confidence": round(1 - avg_risk, 2)},
            {"name": "Bacterial Infection", "confidence": round(avg_risk * 0.6, 2)},
            {"name": "Sepsis", "confidence": round(avg_risk * 0.4, 2)}
        ]
    }
