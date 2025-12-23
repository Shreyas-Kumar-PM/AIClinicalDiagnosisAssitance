from fastapi import FastAPI, Request
from pydantic import BaseModel
from typing import List

from inference.predict import predict

app = FastAPI(title="ClinDx ML")

# -------------------------------------------------
# REQUEST SCHEMA
# -------------------------------------------------
class DiagnosisRequest(BaseModel):
    symptoms: List[str]
    vitals: List[float]
    labs: List[float]

# -------------------------------------------------
# HEALTH CHECK (NO MODEL LOAD)
# -------------------------------------------------
@app.get("/")
def health():
    return {"status": "ok"}

# -------------------------------------------------
# NORMAL PREDICTION
# -------------------------------------------------
@app.post("/predict")
def run_prediction(req: DiagnosisRequest):
    return predict(
        symptoms=req.symptoms,
        vitals=req.vitals,
        labs=req.labs
    )

# -------------------------------------------------
# DEBUG ENDPOINT
# -------------------------------------------------
@app.post("/predict_debug")
async def run_prediction_debug(request: Request):
    raw_body = await request.json()
    parsed = DiagnosisRequest(**raw_body)

    prediction_output = predict(
        symptoms=parsed.symptoms,
        vitals=parsed.vitals,
        labs=parsed.labs
    )

    return {
        "DEBUG_raw_frontend_payload": raw_body,
        "DEBUG_parsed_request": parsed.dict(),
        "DEBUG_prediction_output": prediction_output
    }
