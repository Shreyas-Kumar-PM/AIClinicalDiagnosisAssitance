from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from inference.predict import predict

app = FastAPI(title="ClinDx ML")

class DiagnosisRequest(BaseModel):
    symptoms: List[str]
    vitals: List[float]
    labs: List[float]

@app.get("/")
def health():
    return {"status": "ok"}

@app.post("/predict")
def run_prediction(req: DiagnosisRequest):
    return predict(
        symptoms=req.symptoms,
        vitals=req.vitals,
        labs=req.labs
    )
