import torch
from transformers import AutoTokenizer, AutoModel

MODEL_NAME = "emilyalsentzer/Bio_ClinicalBERT"

_tokenizer = None
_model = None

def load_model():
    global _tokenizer, _model

    if _model is not None:
        return

    _tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    _model = AutoModel.from_pretrained(MODEL_NAME)
    _model.eval()

def hf_symptom_analysis(symptoms):
    try:
        load_model()

        text = "Patient presents with: " + ", ".join(symptoms)

        inputs = _tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            padding=True,
            max_length=128
        )

        with torch.no_grad():
            outputs = _model(**inputs)
            embedding = outputs.last_hidden_state.mean(dim=1)

        return {
            "hf_summary": text,
            "hf_confidence": round(float(torch.norm(embedding)), 2),
            "hf_model": MODEL_NAME
        }

    except Exception as e:
        print("⚠️ HF model skipped:", e)
        return None
