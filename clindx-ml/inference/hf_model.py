from transformers import AutoTokenizer, AutoModel
import torch

MODEL_NAME = "emilyalsentzer/Bio_ClinicalBERT"

tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
model = AutoModel.from_pretrained(MODEL_NAME)
model.eval()

def hf_symptom_analysis(symptoms: list[str]) -> dict:
    """
    Clinical context extraction ONLY (no classification)
    """
    text = "Patient presents with: " + ", ".join(symptoms)

    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=128
    )

    with torch.no_grad():
        outputs = model(**inputs)
        embedding = outputs.last_hidden_state.mean(dim=1)

    return {
        "hf_summary": text,
        "hf_confidence": round(float(torch.norm(embedding)), 2),
        "hf_model": MODEL_NAME
    }
