# inference/hf_model.py
import os

MODEL_NAME = "emilyalsentzer/Bio_ClinicalBERT"

_tokenizer = None
_model = None
_torch_available = False

try:
    import torch
    from transformers import AutoTokenizer, AutoModel
    _torch_available = True
except Exception:
    _torch_available = False


def hf_symptom_analysis(symptoms):
    """
    OPTIONAL clinical NLP context.
    NEVER crashes the app.
    """
    if not _torch_available:
        return None

    global _tokenizer, _model

    try:
        if _model is None:
            _tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
            _model = AutoModel.from_pretrained(MODEL_NAME)
            _model.eval()

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
        print("⚠️ HF analysis skipped:", e)
        return None
