# inference/hf_explainer.py

class HFDiagnosisExplainer:
    def __init__(self):
        self.enabled = False
        self.generator = None

    def _load(self):
        if self.generator is not None:
            return

        try:
            from transformers import pipeline

            self.generator = pipeline(
                task="text2text-generation",
                model="google/flan-t5-base",
                max_length=120,
                do_sample=False
            )
            self.enabled = True

        except Exception as e:
            print("⚠️ HF explainer disabled:", e)
            self.enabled = False

    def explain(self, diagnosis, risk_score, symptoms):
        self._load()

        if not self.enabled:
            return None

        symptom_text = ", ".join(symptoms) if symptoms else "reported symptoms"

        risk_label = (
            "high" if risk_score >= 0.8 else
            "moderate" if risk_score >= 0.4 else
            "low"
        )

        prompt = f"""
Diagnosis: {diagnosis}
Risk level: {risk_label}
Symptoms: {symptom_text}

Explain this to a patient in 2-3 simple sentences.
"""

        return self.generator(prompt)[0]["generated_text"].strip()
