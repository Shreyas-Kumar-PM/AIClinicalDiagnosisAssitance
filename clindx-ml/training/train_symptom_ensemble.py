import os
import joblib
import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score
from sklearn.calibration import CalibratedClassifierCV

# -------------------------------------------------
# PATHS
# -------------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data", "processed")
MODEL_DIR = os.path.join(BASE_DIR, "models")

os.makedirs(MODEL_DIR, exist_ok=True)

DATA_FILE = os.path.join(DATA_DIR, "symptoms_training.csv")

# -------------------------------------------------
# LOAD DATA
# -------------------------------------------------
print("📥 Loading processed symptom dataset")

df = pd.read_csv(DATA_FILE)

if df.empty:
    raise RuntimeError("❌ Processed symptom dataset is empty")

# Expecting: disease, symptom
if not {"disease", "symptom"}.issubset(df.columns):
    raise RuntimeError("❌ Dataset must contain disease and symptom columns")

# -------------------------------------------------
# GROUP SYMPTOMS BY DISEASE
# -------------------------------------------------
grouped = (
    df.groupby("disease")["symptom"]
    .apply(list)
    .reset_index()
)

# -------------------------------------------------
# SYNTHETIC PATIENT CASE GENERATION
# -------------------------------------------------
print("🧪 Generating synthetic patient cases")

rng = np.random.default_rng(42)
cases = []

for _, row in grouped.iterrows():
    disease = row["disease"]
    symptoms = list(set(row["symptom"]))

    if len(symptoms) < 2:
        continue

    for _ in range(8):  # synthetic patients per disease
        k = rng.integers(2, min(len(symptoms), 6))
        sampled = rng.choice(symptoms, size=k, replace=False).tolist()

        cases.append({
            "disease": disease,
            "symptoms": sampled
        })

df_cases = pd.DataFrame(cases)

print(f"🧠 Generated {len(df_cases)} patient cases")

# -------------------------------------------------
# ENCODE SYMPTOMS
# -------------------------------------------------
mlb = MultiLabelBinarizer()
X = mlb.fit_transform(df_cases["symptoms"])
y = df_cases["disease"]

joblib.dump(mlb, os.path.join(MODEL_DIR, "symptom_encoder.pkl"))

# -------------------------------------------------
# TRAIN / TEST SPLIT
# -------------------------------------------------
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# -------------------------------------------------
# TRAIN MODELS
# -------------------------------------------------
print("\n🧠 Training models")

models = {
    "lr": LogisticRegression(
        max_iter=2000,
        n_jobs=-1,
        class_weight="balanced"
    ),
    "rf": RandomForestClassifier(
        n_estimators=400,
        max_depth=18,
        min_samples_leaf=2,
        n_jobs=-1,
        random_state=42
    ),
    "gb": GradientBoostingClassifier(
        n_estimators=200,
        learning_rate=0.05,
        max_depth=3,
        random_state=42
    )
}

trained = {}

for name, model in models.items():
    model.fit(X_train, y_train)
    preds = model.predict(X_test)
    acc = accuracy_score(y_test, preds)
    print(f"✅ {name.upper()} accuracy: {acc:.2f}")
    trained[name] = model

# -------------------------------------------------
# CALIBRATION
# -------------------------------------------------
print("\n🎯 Calibrating models")

calibrated_models = []

for name, model in trained.items():
    calibrated = CalibratedClassifierCV(
        estimator=model,
        method="sigmoid",
        cv=3
    )
    calibrated.fit(X_train, y_train)

    joblib.dump(
        calibrated,
        os.path.join(MODEL_DIR, f"symptom_model_{name}_calibrated.pkl")
    )

    calibrated_models.append(calibrated)

# -------------------------------------------------
# ENSEMBLE
# -------------------------------------------------
class CalibratedEnsemble:
    def __init__(self, models):
        self.models = models
        self.classes_ = models[0].classes_

    def predict_proba(self, X):
        probs = [m.predict_proba(X) for m in self.models]
        return np.mean(probs, axis=0)

    def predict(self, X):
        probs = self.predict_proba(X)
        return self.classes_[np.argmax(probs, axis=1)]

ensemble = CalibratedEnsemble(calibrated_models)

joblib.dump(
    ensemble,
    os.path.join(MODEL_DIR, "symptom_ensemble_calibrated.pkl")
)

# -------------------------------------------------
# FINAL SUMMARY
# -------------------------------------------------
print("\n🎯 ENSEMBLE TRAINED & CALIBRATED")
print(f"🦠 Diseases learned: {len(ensemble.classes_)}")
print(f"🤒 Symptoms encoded: {len(mlb.classes_)}")
print("📦 Saved models:")
print("   - symptom_encoder.pkl")
print("   - symptom_model_*_calibrated.pkl")
print("   - symptom_ensemble_calibrated.pkl")
