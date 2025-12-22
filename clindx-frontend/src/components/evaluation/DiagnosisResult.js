/* eslint-disable no-unused-vars */
import { Card, Badge, Row, Col, Alert } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // ✅ ADDED

export default function DiagnosisResult({ result }) {
  if (!result || !result.top_diagnoses || !result.model_outputs) {
    return null;
  }

  const hf = result.model_outputs.hf_analysis;
  const explanation = result.model_outputs.hf_explanation;

  const riskLabel =
    result.risk_score >= 0.8
      ? "High"
      : result.risk_score >= 0.4
      ? "Moderate"
      : "Low";

  const riskScorePercent = Math.round(result.risk_score * 100);

  const riskColor =
    riskLabel === "High"
      ? "#b91c1c"
      : riskLabel === "Moderate"
      ? "#f59e0b"
      : "#15803d";

  const patientContext =
    typeof hf?.hf_summary === "string" && hf.hf_summary.trim().length > 0
      ? hf.hf_summary
      : "Patient presents with reported clinical symptoms.";

  const clinicalSummary = `
${patientContext}.
Model analysis suggests ${result.primary_diagnosis.toLowerCase()}.
Overall clinical risk is assessed as ${riskLabel.toLowerCase()}.
`.trim();

  const needleRotation = -90 + (riskScorePercent / 100) * 180;

  const data = {
    labels: result.top_diagnoses.map((d) => d.name),
    datasets: [
      {
        label: "Confidence (%)",
        data: result.top_diagnoses.map((d) =>
          Math.round(d.confidence * 100)
        ),
        backgroundColor: result.top_diagnoses.map((d) =>
          d.name === result.primary_diagnosis ? "#b91c1c" : "#1e3a8a"
        ),
        borderRadius: 14,
        barThickness: 55,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, max: 100 },
    },
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="p-4 mt-4">

        {/* 🔬 WHAT-IF SIMULATOR BUTTON */}
        <div className="text-end mb-3">
          <Link to={`/patients/${result.patient_id}/simulator`}>
            <button className="btn btn-primary">
              What-If Simulator
            </button>
          </Link>

          {" "}

          {/* 💊 TREATMENT RESPONSE BUTTON */}
          <Link to={`/patients/${result.patient_id}/treatment`}>
            <button className="btn btn-outline-primary">
              Treatment Response
            </button>
          </Link>
        </div>
{/* ================= HEADER ================= */}
<Row className="mb-3 align-items-center">
          <Col>
            <h4 style={{ color: "#0f172a", fontWeight: 600 }}>
              Diagnosis <span style={{ color: "#1e3a8a" }}>Result</span>
            </h4>
          </Col>
          <Col className="text-end">
            <Badge pill bg={result.high_risk ? "danger" : "success"}>
              Risk Score: {riskScorePercent}%
            </Badge>
          </Col>
        </Row>

        {/* ================= PRIMARY INFO ================= */}
        <Row className="mb-3">
          <Col md={6}>
            <p className="mb-1 text-muted">
              <strong>Primary Diagnosis</strong>
            </p>
            <h5
              style={{
                color: result.high_risk ? "#b91c1c" : "#065f46",
                fontWeight: 600,
              }}
            >
              {result.primary_diagnosis}
            </h5>
          </Col>

          <Col md={6}>
            <p className="mb-1 text-muted">
              <strong>High Risk Status</strong>
            </p>
            <Badge bg={result.high_risk ? "danger" : "success"}>
              {result.high_risk ? "YES" : "NO"}
            </Badge>
          </Col>
        </Row>

        {/* ================= ALERT ================= */}
        {result.high_risk && (
          <Alert variant="danger">
            ⚠️ <strong>Critical condition detected.</strong> Immediate medical
            attention is recommended.
          </Alert>
        )}

        {/* ================= CHART ================= */}
        <div className="mt-4">
          <h6 className="text-secondary mb-3">
            Diagnostic Confidence Distribution
          </h6>
          <Bar data={data} options={options} />
        </div>

        {/* ================= CLASSICAL ML OUTPUTS ================= */}
        <div className="mt-4">
          <h6 className="text-secondary">Classical ML Model Insights</h6>

          <Row className="mt-3 g-3">
            {[
              {
                label: "Symptoms Model",
                value: result.model_outputs.classical_symptom_prediction,
              },
              {
                label: "Vitals Risk",
                value: `${Math.round(
                  result.model_outputs.vitals_risk_probability * 100
                )}%`,
              },
              {
                label: "Lab Risk",
                value: `${Math.round(
                  result.model_outputs.lab_risk_probability * 100
                )}%`,
              },
            ].map((item, idx) => (
              <Col md={4} key={idx}>
                <motion.div whileHover={{ scale: 1.04 }}>
                  <Card
                    className="p-3"
                    style={{
                      background: "#fefce8",
                      borderRadius: "14px",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <strong>{item.label}</strong>
                    <p className="mb-0 text-muted mt-1">{item.value}</p>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </div>

        {/* ================= AI EXPLANATION ================= */}
        {explanation && (
          <div className="mt-4">
            <h6 className="text-secondary">AI Clinical Explanation</h6>
            <Card
              className="p-4 mt-2"
              style={{
                background: "#ecfeff",
                borderRadius: "14px",
                border: "1px solid #bae6fd",
              }}
            >
              <p className="mb-0 text-muted">{explanation}</p>
            </Card>
          </div>
        )}

        {/* ================= NLP CONTEXT ================= */}
        {hf && (
          <div className="mt-4">
            <h6 className="text-secondary">Clinical NLP Context</h6>
            <Card
              className="p-3 mt-2"
              style={{
                background: "#f8fafc",
                borderRadius: "14px",
                border: "1px solid #e5e7eb",
              }}
            >
              <p className="text-muted mb-2">{patientContext}</p>
              <Row>
                <Col md={6}>
                  <Badge bg="info">Model: {hf.hf_model}</Badge>
                </Col>
                <Col md={6} className="text-end">
                  <Badge bg="secondary">
                    NLP Signal: {hf.hf_confidence.toFixed(2)}
                  </Badge>
                </Col>
              </Row>
            </Card>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
