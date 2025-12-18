import os
import numpy as np
import pandas as pd
import joblib

from inference.hf_model import hf_symptom_analysis
from inference.hf_explainer import HFDiagnosisExplainer

# -------------------------------------------------
# PATHS
# -------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")

# -------------------------------------------------
# LOAD MODELS
# -------------------------------------------------
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

vitals_features = joblib.load(
    os.path.join(MODEL_DIR, "vitals_features.pkl")
)

lab_features = joblib.load(
    os.path.join(MODEL_DIR, "lab_features.pkl")
)

# -------------------------------------------------
# 🔐 LOCK FEATURE SPACE (CRITICAL)
# -------------------------------------------------
EXPECTED_SYMPTOM_FEATURES = symptom_model.n_features_in_

encoder_vocab = list(symptom_encoder.classes_)
encoder_index = {s: i for i, s in enumerate(encoder_vocab)}

# -------------------------------------------------
# HF EXPLAINER (SINGLE INSTANCE)
# -------------------------------------------------
hf_explainer = HFDiagnosisExplainer()

# -------------------------------------------------
# HELPERS
# -------------------------------------------------
def normalize_symptoms(symptoms):
    return [
        s.strip().lower().replace(" ", "_")
        for s in symptoms
        if isinstance(s, str)
    ]

def build_symptom_vector(symptoms):
    """
    Builds a FIXED-SIZE symptom vector
    matching training-time feature count
    """
    vector = np.zeros(EXPECTED_SYMPTOM_FEATURES)

    for s in symptoms:
        if s in encoder_index:
            idx = encoder_index[s]
            if idx < EXPECTED_SYMPTOM_FEATURES:
                vector[idx] = 1

    return vector.reshape(1, -1)

# -------------------------------------------------
# MAIN PREDICTION FUNCTION
# -------------------------------------------------
def predict(symptoms, vitals, labs):
    # -----------------------------
    # SYMPTOMS
    # -----------------------------
    symptoms = normalize_symptoms(symptoms)
    symptom_vector = build_symptom_vector(symptoms)

    symptom_pred = symptom_model.predict(symptom_vector)[0]

    # -----------------------------
    # VITALS
    # -----------------------------
    vitals_df = pd.DataFrame([vitals], columns=vitals_features)
    vitals_prob = float(vitals_model.predict_proba(vitals_df)[0][1])

    # -----------------------------
    # LABS
    # -----------------------------
    labs_df = pd.DataFrame([labs], columns=lab_features)
    lab_prob = float(lab_model.predict_proba(labs_df)[0][1])

    avg_risk = float(np.mean([vitals_prob, lab_prob]))

    # -----------------------------
    # FINAL DIAGNOSIS (UNCHANGED)
    # -----------------------------
    if vitals_prob > 0.8 and lab_prob > 0.8:
        diagnosis = "Sepsis Risk"
        high_risk = True
    elif symptom_pred != "Healthy" and avg_risk > 0.4:
        diagnosis = "Bacterial Infection"
        high_risk = False
    else:
        diagnosis = "Viral Infection"
        high_risk = False

    # -----------------------------
    # HF CONTEXT + EXPLANATION
    # -----------------------------
    hf_context = hf_symptom_analysis(symptoms)

    hf_explanation = hf_explainer.explain(
        diagnosis=diagnosis,
        risk_score=avg_risk,
        symptoms=symptoms
    )

    # -----------------------------
    # RESPONSE
    # -----------------------------
    return {
        "primary_diagnosis": diagnosis,
        "high_risk": high_risk,
        "risk_score": round(avg_risk, 2),

        "model_outputs": {
            "classical_symptom_prediction": symptom_pred,
            "vitals_risk_probability": round(vitals_prob, 2),
            "lab_risk_probability": round(lab_prob, 2),
            "hf_analysis": hf_context,
            "hf_explanation": hf_explanation
        },

        "top_diagnoses": [
            {"name": "Viral Infection", "confidence": round(1 - avg_risk, 2)},
            {"name": "Bacterial Infection", "confidence": round(avg_risk * 0.6, 2)},
            {"name": "Sepsis", "confidence": round(avg_risk * 0.4, 2)}
        ]
    }
