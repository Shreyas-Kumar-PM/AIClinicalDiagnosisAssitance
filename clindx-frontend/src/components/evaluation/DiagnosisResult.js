import { Card, Badge, Row, Col, Alert } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // ✅ ADDED (ONLY IMPORT)

/**
 * DiagnosisResult
 * - Existing logic untouched
 * - Clinical Summary Card added
 * - Risk Meter added (NEW)
 * - UX + visual polish
 * - Navy / beige / grey theme
 */
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
    animation: { duration: 900, easing: "easeOutQuart" },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#f9fafb",
        bodyColor: "#e5e7eb",
        callbacks: {
          label: (ctx) => `${ctx.raw}% confidence`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { color: "#6b7280", callback: (v) => `${v}%` },
        grid: { color: "#e5e7eb" },
      },
      x: {
        ticks: { color: "#374151" },
        grid: { display: false },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <Card className="p-4 mt-4" style={{
        background: "linear-gradient(180deg, #f8fafc, #f1f5f9)",
        borderRadius: "18px",
        border: "1px solid #e5e7eb",
        boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
      }}>

        {/* ================= CLINICAL SUMMARY ================= */}
        <Card className="p-4 mb-4" style={{
          background: "#fefce8",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
        }}>
          <h6 className="text-secondary mb-2">Clinical Summary</h6>
          <p style={{ color: "#374151", lineHeight: 1.6 }}>
            {clinicalSummary}
          </p>
          <Badge bg={
            riskLabel === "High"
              ? "danger"
              : riskLabel === "Moderate"
              ? "warning"
              : "success"
          }>
            Overall Risk: {riskLabel}
          </Badge>
        </Card>

        {/* ================= RISK METER ================= */}
        <Card className="p-4 mb-4 text-center" style={{
          background: "#f8fafc",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
        }}>
          <h6 className="text-secondary mb-3">Overall Risk Meter</h6>

          <div style={{ position: "relative", width: 220, margin: "0 auto" }}>
            <div style={{
              width: 220,
              height: 110,
              borderTopLeftRadius: 220,
              borderTopRightRadius: 220,
              background:
                "linear-gradient(90deg, #15803d, #f59e0b, #b91c1c)",
            }} />

            <motion.div
              animate={{ rotate: needleRotation }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{
                position: "absolute",
                width: 4,
                height: 90,
                background: "#0f172a",
                bottom: 0,
                left: "50%",
                transformOrigin: "bottom center",
              }}
            />

            <div style={{
              position: "absolute",
              width: 14,
              height: 14,
              background: "#0f172a",
              borderRadius: "50%",
              bottom: -7,
              left: "50%",
              transform: "translateX(-50%)",
            }} />
          </div>

          <h5 className="mt-3" style={{ color: riskColor }}>
            {riskScorePercent}% — {riskLabel} Risk
          </h5>
        </Card>

        {/* ================= WHAT-IF SIMULATOR BUTTON (ONLY ADDITION) ================= */}
        <div className="mt-4 text-end">
          <Link to={`/patients/${result.patient_id}/simulator`}>
            <button
              style={{
                background: "#1e3a8a",
                color: "#f8fafc",
                border: "none",
                padding: "12px 20px",
                borderRadius: "10px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              🔬 What-If Clinical Simulator
            </button>
          </Link>
        </div>

        {/* ===== EVERYTHING BELOW IS UNCHANGED ===== */}
        {/* HEADER, INFO, ALERT, CHART, ML OUTPUTS, AI EXPLANATION, NLP CONTEXT */}
        {/* (Left exactly as you had it) */}
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
