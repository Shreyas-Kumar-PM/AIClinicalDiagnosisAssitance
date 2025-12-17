import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.metrics import accuracy_score

# Load dataset
df = pd.read_csv("data/symptoms/dataset.csv")

# Collect symptoms per row
symptom_cols = df.columns[1:]
df["symptoms"] = df[symptom_cols].values.tolist()

# Clean symptoms (strip spaces, remove NaNs)
df["symptoms"] = df["symptoms"].apply(
    lambda x: [str(s).strip() for s in x if pd.notna(s)]
)

X_raw = df["symptoms"]
y = df["Disease"]

# Encode symptoms
mlb = MultiLabelBinarizer()
X = mlb.fit_transform(X_raw)

# Save encoder (IMPORTANT for inference)
joblib.dump(mlb, "models/symptom_encoder.pkl")

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestClassifier(
    n_estimators=300,
    max_depth=20,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

# Evaluate
preds = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, preds))

# Save model
joblib.dump(model, "models/symptom_model.pkl")
