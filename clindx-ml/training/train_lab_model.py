import pandas as pd
import joblib
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Load dataset
df = pd.read_csv("data/labs/labs.csv")

# Normalize column names
df = df.rename(columns={
    "fbs": "glucose",
    "chol": "cholesterol"
})

FEATURES = ["glucose", "cholesterol", "trestbps"]

X = df[FEATURES]
y = df["target"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = DecisionTreeClassifier(
    max_depth=5,
    min_samples_leaf=20,
    random_state=42
)

model.fit(X_train, y_train)

preds = model.predict(X_test)
print("Lab Model Accuracy:", accuracy_score(y_test, preds))

joblib.dump(model, "models/lab_model.pkl")
joblib.dump(FEATURES, "models/lab_features.pkl")
