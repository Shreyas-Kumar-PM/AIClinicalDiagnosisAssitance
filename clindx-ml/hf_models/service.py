from transformers import pipeline


class HuggingFaceService:
    """
    Hugging Face models are used ONLY for:
    - Clinical context understanding
    - Natural language explanation
    They DO NOT override ML diagnosis.
    """

    def __init__(self):
        self.enabled = True

        try:
            self.symptom_context_model = pipeline(
                "feature-extraction",
                model="emilyalsentzer/Bio_ClinicalBERT"
            )

            self.explainer_model = pipeline(
                "text2text-generation",
                model="google/flan-t5-base",
                max_length=180
            )

        except Exception as e:
            print("⚠️ Hugging Face models disabled:", e)
            self.enabled = False

    def get_symptom_context(self, symptoms: list[str]):
        if not self.enabled:
            return None

        text = "Patient presents with: " + ", ".join(symptoms)
        embeddings = self.symptom_context_model(text)

        return {
            "model": "Bio_ClinicalBERT",
            "embedding_size": len(embeddings[0][0]),
            "note": "Clinical symptom context extracted"
        }

    def generate_explanation(self, diagnosis: str, risk_score: float):
        if not self.enabled:
            return None

        prompt = (
            f"Explain the medical condition '{diagnosis}' "
            f"to a patient. Risk score is {risk_score}. "
            f"Keep the explanation short, professional, and clinical."
        )

        output = self.explainer_model(prompt)
        return output[0]["generated_text"]
