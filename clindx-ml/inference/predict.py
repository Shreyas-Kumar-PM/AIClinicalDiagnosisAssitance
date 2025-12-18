import os
import numpy as np
import pandas as pd
import joblib

from inference.hf_model import hf_symptom_analysis

BASE_DIR = os.path.dirname(os.path.dirname(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

# -----------------------------
# Load models you ACTUALLY have
# -----------------------------
symptom_encoder = joblib.load(os.path.join(MODEL_DIR, "symptom_encoder.pkl"))
symptom_model = joblib.load(os.path.join(MODEL_DIR, "symptom_model.pkl"))

vitals_model = joblib.load(os.path.join(MODEL_DIR, "vitals_model.pkl"))
lab_model = joblib.load(os.path.join(MODEL_DIR, "lab_model.pkl"))

vitals_features = joblib.load(os.path.join(MODEL_DIR, "vitals_features.pkl"))
lab_features = joblib.load(os.path.join(MODEL_DIR, "lab_features.pkl"))

# ✅ derive vocabulary from encoder (NO extra file)
symptom_vocab = set(symptom_encoder.classes_)

# -----------------------------
# Helpers
# -----------------------------
def normalize_symptoms(symptoms):
    return [
        s.strip().lower().replace(" ", "_")
        for s in symptoms
    ]

def filter_known_symptoms(symptoms):
    return [s for s in symptoms if s in symptom_vocab]

# -----------------------------
# Main Prediction
# -----------------------------
def predict(symptoms, vitals, labs):
    symptoms = normalize_symptoms(symptoms)
    symptoms = filter_known_symptoms(symptoms)

    # ---- Symptoms model
    encoded_symptoms = symptom_encoder.transform([symptoms])
    symptom_pred = symptom_model.predict(encoded_symptoms)[0]

    # ---- Vitals model (DataFrame = NO warnings)
    vitals_df = pd.DataFrame([vitals], columns=vitals_features)
    vitals_prob = float(vitals_model.predict_proba(vitals_df)[0][1])

    # ---- Lab model (DataFrame = NO warnings)
    labs_df = pd.DataFrame([labs], columns=lab_features)
    lab_prob = float(lab_model.predict_proba(labs_df)[0][1])

    avg_risk = float(np.mean([vitals_prob, lab_prob]))

    # ---- Final decision (UNCHANGED LOGIC)
    if vitals_prob > 0.8 and lab_prob > 0.8:
        diagnosis = "Sepsis Risk"
        high_risk = True
    elif symptom_pred != "Healthy" and avg_risk > 0.4:
        diagnosis = "Bacterial Infection"
        high_risk = False
    else:
        diagnosis = "Viral Infection"
        high_risk = False

    hf_output = hf_symptom_analysis(symptoms)

    return {
        "primary_diagnosis": diagnosis,
        "high_risk": high_risk,
        "risk_score": round(avg_risk, 2),
        "model_outputs": {
            "classical_symptom_prediction": symptom_pred,
            "vitals_risk_probability": round(vitals_prob, 2),
            "lab_risk_probability": round(lab_prob, 2),
            "hf_analysis": hf_output
        },
        "top_diagnoses": [
            {"name": "Viral Infection", "confidence": round(1 - avg_risk, 2)},
            {"name": "Bacterial Infection", "confidence": round(avg_risk * 0.6, 2)},
            {"name": "Sepsis", "confidence": round(avg_risk * 0.4, 2)}
        ]
    }
