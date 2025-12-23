from transformers import pipeline


class HFDiagnosisExplainer:
    """
    Generates a short, patient-friendly clinical explanation.
    This module is CONTEXT-ONLY and does NOT affect diagnosis logic.
    """

    def __init__(self):
        self.enabled = True
        try:
            self.generator = pipeline(
                task="text2text-generation",
                model="google/flan-t5-base",
                max_length=160,
                repetition_penalty=1.6,
                do_sample=False
            )
        except Exception as e:
            print("⚠️ HF Explainer disabled:", e)
            self.enabled = False

    def explain(
        self,
        diagnosis: str,
        risk_score: float,
        symptoms: list[str]
    ) -> str | None:
        if not self.enabled:
            return None

        symptom_text = ", ".join(symptoms) if symptoms else "reported symptoms"

        risk_label = (
            "high"
            if risk_score >= 0.8
            else "moderate"
            if risk_score >= 0.4
            else "low"
        )

        prompt = f"""
You are a clinical decision support system.

Diagnosis: {diagnosis}
Risk level: {risk_label}
Patient symptoms: {symptom_text}

Write a clear, calm explanation for a patient in 3–4 sentences.
Explain why this diagnosis was suggested based on symptoms and risk.
Do NOT repeat phrases.
Do NOT give treatment or medical advice.
"""

        output = self.generator(prompt)[0]["generated_text"]
        return output.strip()