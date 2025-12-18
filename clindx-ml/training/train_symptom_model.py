import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.metrics import accuracy_score

df = pd.read_csv("data/symptoms/dataset.csv")

symptom_cols = df.columns[1:]

def clean_symptoms(row):
    return [
        str(s).strip().lower()
        for s in row
        if pd.notna(s) and str(s).strip() not in ["0", "nan", ""]
    ]

df["symptoms"] = df[symptom_cols].values.tolist()
df["symptoms"] = df["symptoms"].apply(clean_symptoms)

X_raw = df["symptoms"]
y = df["Disease"]

mlb = MultiLabelBinarizer()
X = mlb.fit_transform(X_raw)

joblib.dump(mlb, "models/symptom_encoder.pkl")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = RandomForestClassifier(
    n_estimators=300,
    max_depth=20,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

preds = model.predict(X_test)
print("Symptom Model Accuracy:", accuracy_score(y_test, preds))

joblib.dump(model, "models/symptom_model.pkl")
