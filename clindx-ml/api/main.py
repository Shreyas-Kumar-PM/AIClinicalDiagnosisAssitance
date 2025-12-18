from fastapi import FastAPI, Request
from pydantic import BaseModel
from typing import List
from inference.predict import predict

app = FastAPI(title="ClinDx ML")


# -----------------------------
# Request schema
# -----------------------------
class DiagnosisRequest(BaseModel):
    symptoms: List[str]
    vitals: List[float]
    labs: List[float]


# -----------------------------
# Health check
# -----------------------------
@app.get("/")
def health():
    return {"status": "ok"}


# -----------------------------
# NORMAL PREDICT (unchanged)
# -----------------------------
@app.post("/predict")
def run_prediction(req: DiagnosisRequest):
    return predict(
        symptoms=req.symptoms,
        vitals=req.vitals,
        labs=req.labs
    )


# -----------------------------
# 🔥 DEBUG ENDPOINT (IMPORTANT)
# -----------------------------
@app.post("/predict_debug")
async def run_prediction_debug(request: Request):
    """
    This endpoint shows EXACTLY what the frontend sends
    and EXACTLY what the backend uses.
    """

    # 1️⃣ Raw JSON sent by frontend
    raw_body = await request.json()

    # 2️⃣ Parsed request (Pydantic validation)
    parsed = DiagnosisRequest(**raw_body)

    # 3️⃣ Values actually passed to ML
    prediction_input = {
        "symptoms": parsed.symptoms,
        "vitals": parsed.vitals,
        "labs": parsed.labs,
    }

    # 4️⃣ Model output
    prediction_output = predict(
        symptoms=parsed.symptoms,
        vitals=parsed.vitals,
        labs=parsed.labs
    )

    return {
        "DEBUG_raw_frontend_payload": raw_body,
        "DEBUG_parsed_request_object": parsed.dict(),
        "DEBUG_prediction_input_used": prediction_input,
        "DEBUG_prediction_output": prediction_output
    }
