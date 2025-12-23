# inference/hf_model.py

MODEL_NAME = "emilyalsentzer/Bio_ClinicalBERT"

def hf_symptom_analysis(symptoms):
    """
    OPTIONAL HF context extractor.
    Safe: returns None if torch/transformers unavailable.
    """
    try:
        import torch
        from transformers import AutoTokenizer, AutoModel

        tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        model = AutoModel.from_pretrained(MODEL_NAME)
        model.eval()

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

    except Exception as e:
        print("⚠️ HF symptom analysis skipped:", e)
        return None
