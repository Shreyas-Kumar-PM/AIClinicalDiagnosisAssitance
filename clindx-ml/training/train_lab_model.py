import pandas as pd
import joblib
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# Load dataset
df = pd.read_csv("data/labs/labs.csv")

# Rename columns for clarity (optional but recommended)
df = df.rename(columns={
    "fbs": "glucose",
    "chol": "cholesterol"
})

# Select features that exist
X = df[["glucose", "cholesterol", "trestbps"]]
y = df["target"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = DecisionTreeClassifier(
    max_depth=5,
    min_samples_leaf=20,
    random_state=42
)

model.fit(X_train, y_train)

# Evaluate
preds = model.predict(X_test)
print("Accuracy:", accuracy_score(y_test, preds))

# Save model
joblib.dump(model, "models/lab_model.pkl")
