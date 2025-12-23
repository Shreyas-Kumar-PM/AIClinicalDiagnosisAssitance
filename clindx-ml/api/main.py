# api/main.py

import os
from fastapi import FastAPI, Request
from pydantic import BaseModel
from typing import List

from inference.predict import predict

os.environ["TOKENIZERS_PARALLELISM"] = "false"

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
    return predict(req.symptoms, req.vitals, req.labs)

@app.post("/predict_debug")
async def run_prediction_debug(request: Request):
    raw = await request.json()
    parsed = DiagnosisRequest(**raw)

    return {
        "DEBUG_raw": raw,
        "DEBUG_result": predict(
            parsed.symptoms,
            parsed.vitals,
            parsed.labs
        )
    }
