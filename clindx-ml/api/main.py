# api/main.py
from fastapi import FastAPI, Request
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

@app.post("/predict_debug")
async def run_prediction_debug(request: Request):
    raw = await request.json()
    parsed = DiagnosisRequest(**raw)

    return {
        "input": parsed.dict(),
        "output": predict(parsed.symptoms, parsed.vitals, parsed.labs)
    }
