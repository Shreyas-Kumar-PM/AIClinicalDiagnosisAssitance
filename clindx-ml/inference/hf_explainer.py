# inference/hf_explainer.py
class HFDiagnosisExplainer:
    def __init__(self):
        self.enabled = False
        self.generator = None

    def explain(self, diagnosis, risk_score, symptoms):
        return None  # Disabled in production
