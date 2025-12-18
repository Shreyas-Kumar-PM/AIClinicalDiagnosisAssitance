import pandas as pd
import joblib
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

df = pd.read_csv("data/vitals/vitals.csv")

FEATURES = ["temp", "hr", "bp_sys", "spo2"]

X = df[FEATURES]
y = df["high_risk"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

preds = model.predict(X_test)
print(classification_report(y_test, preds))

joblib.dump(model, "models/vitals_model.pkl")
joblib.dump(FEATURES, "models/vitals_features.pkl")
