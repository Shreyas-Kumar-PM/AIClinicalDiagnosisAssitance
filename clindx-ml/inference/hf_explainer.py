from transformers import pipeline

class HFDiagnosisExplainer:
    """
    Generates a patient-friendly medical explanation.
    Does NOT affect diagnosis logic.
    """

    def __init__(self):
        self.enabled = True
        try:
            self.generator = pipeline(
                "text2text-generation",
                model="google/flan-t5-base",
                max_length=180
            )
        except Exception as e:
            print("⚠️ HF Explainer disabled:", e)
            self.enabled = False

    def explain(self, diagnosis: str, risk_score: float) -> str | None:
        if not self.enabled:
            return None

        prompt = (
            f"Explain the medical diagnosis '{diagnosis}' to a patient. "
            f"The risk score is {round(risk_score * 100)} percent. "
            f"Use simple, calm, professional medical language."
        )

        output = self.generator(prompt)
        return output[0]["generated_text"]
