import pandas as pd
import os
import re

# ============================================================
# PATHS (MATCH YOUR STRUCTURE)
# ============================================================
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
SYM_DIR = os.path.join(BASE_DIR, "data", "symptoms")
OUT_DIR = os.path.join(BASE_DIR, "data", "processed")

os.makedirs(OUT_DIR, exist_ok=True)

OUT_TRAIN = os.path.join(OUT_DIR, "symptoms_training.csv")
OUT_META = os.path.join(OUT_DIR, "symptom_metadata.csv")

# ============================================================
# HELPERS
# ============================================================
def norm_symptom(s):
    if not isinstance(s, str):
        return None
    s = s.lower()
    s = re.sub(r"[^a-z\s]", "", s)
    s = re.sub(r"\s+", " ", s)
    return s.strip().replace(" ", "_")

def norm_disease(d):
    if not isinstance(d, str):
        return None
    return d.strip().title()

def split_symptoms(val):
    if not isinstance(val, str):
        return []
    for sep in ["|", ",", ";"]:
        if sep in val:
            return [v.strip() for v in val.split(sep)]
    return [val.strip()]

# ============================================================
# 1️⃣ LOAD ALL DATASETS ROBUSTLY
# ============================================================
rows = []

# ---------- DATASET 1: dataset.csv
print("📥 Loading dataset.csv")
df1 = pd.read_csv(os.path.join(SYM_DIR, "dataset.csv"))
df1.columns = [c.lower() for c in df1.columns]

if "disease" in df1.columns:
    symptom_cols = [c for c in df1.columns if c != "disease"]

    # CASE A: Multiple symptom columns
    if len(symptom_cols) > 1:
        for _, row in df1.iterrows():
            disease = norm_disease(row["disease"])
            for col in symptom_cols:
                if pd.notna(row[col]) and str(row[col]).strip():
                    rows.append({
                        "disease": disease,
                        "symptom": norm_symptom(row[col])
                    })

    # CASE B: Single "symptoms" column
    else:
        for _, row in df1.iterrows():
            disease = norm_disease(row["disease"])
            for s in split_symptoms(row[symptom_cols[0]]):
                rows.append({
                    "disease": disease,
                    "symptom": norm_symptom(s)
                })

# ---------- DATASET 2: disease_symptoms_mendeley.csv
print("📥 Loading disease_symptoms_mendeley.csv")
df2 = pd.read_csv(os.path.join(SYM_DIR, "disease_symptoms_mendeley.csv"))
df2.columns = [c.lower() for c in df2.columns]

if "disease" in df2.columns and "symptom" in df2.columns:
    for _, row in df2.iterrows():
        rows.append({
            "disease": norm_disease(row["disease"]),
            "symptom": norm_symptom(row["symptom"])
        })

# ============================================================
# 2️⃣ BUILD TRAINING DATASET
# ============================================================
train_df = pd.DataFrame(rows)
train_df.dropna(inplace=True)
train_df.drop_duplicates(inplace=True)

if train_df.empty:
    raise RuntimeError("❌ No symptoms extracted — please check CSV content")

train_df.to_csv(OUT_TRAIN, index=False)
print("✅ Training dataset saved")

# ============================================================
# 3️⃣ BUILD SYMPTOM METADATA
# ============================================================
print("📥 Preparing symptom metadata")
meta = []

# ---------- Description
desc_path = os.path.join(SYM_DIR, "symptom_Description.csv")
if os.path.exists(desc_path):
    df = pd.read_csv(desc_path)
    df.columns = [c.lower() for c in df.columns]
    if "symptom" in df.columns:
        df["symptom"] = df["symptom"].apply(norm_symptom)
        meta.append(df)

# ---------- Severity
sev_path = os.path.join(SYM_DIR, "Symptom-severity.csv")
if os.path.exists(sev_path):
    df = pd.read_csv(sev_path)
    df.columns = [c.lower() for c in df.columns]
    if "symptom" in df.columns:
        df["symptom"] = df["symptom"].apply(norm_symptom)
        meta.append(df)

if meta:
    meta_df = meta[0]
    for df in meta[1:]:
        meta_df = meta_df.merge(df, on="symptom", how="left")

    meta_df.drop_duplicates(inplace=True)
    meta_df.to_csv(OUT_META, index=False)
    print("✅ Symptom metadata saved")

# ============================================================
# SUMMARY
# ============================================================
print("\n🎯 SUCCESS")
print(f"🦠 Diseases: {train_df['disease'].nunique()}")
print(f"🤒 Symptoms: {train_df['symptom'].nunique()}")
print("📄 Output files:")
print("   - data/processed/symptoms_training.csv")
print("   - data/processed/symptom_metadata.csv")
