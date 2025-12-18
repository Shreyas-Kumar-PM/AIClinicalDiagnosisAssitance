import { Card, Badge, Row, Col, Alert } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";

/**
 * DiagnosisResult
 * - NO logic changes
 * - HF explanation added
 * - Navy / beige / grey theme
 * - Clean animations
 */
export default function DiagnosisResult({ result }) {
  if (!result || !result.top_diagnoses || !result.model_outputs) {
    return null;
  }

  const hf = result.model_outputs.hf_analysis;
  const explanation = result.model_outputs.hf_explanation;

  // -------------------------
  // Chart data
  // -------------------------
  const data = {
    labels: result.top_diagnoses.map((d) => d.name),
    datasets: [
      {
        label: "Confidence (%)",
        data: result.top_diagnoses.map((d) =>
          Math.round(d.confidence * 100)
        ),
        backgroundColor: result.top_diagnoses.map((d) =>
          d.name === result.primary_diagnosis
            ? "#b91c1c" // deep red
            : "#1e3a8a" // navy
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

  const patientContext =
    typeof hf?.hf_summary === "string" && hf.hf_summary.trim().length > 0
      ? hf.hf_summary
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <Card
        className="p-4 mt-4"
        style={{
          background: "linear-gradient(180deg, #f8fafc, #f1f5f9)",
          borderRadius: "18px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
        }}
      >
        {/* HEADER */}
        <Row className="mb-3 align-items-center">
          <Col>
            <h4 style={{ color: "#0f172a", fontWeight: 600 }}>
              Diagnosis <span style={{ color: "#1e3a8a" }}>Result</span>
            </h4>
          </Col>
          <Col className="text-end">
            <Badge pill bg={result.high_risk ? "danger" : "success"}>
              Risk Score: {Math.round(result.risk_score * 100)}%
            </Badge>
          </Col>
        </Row>

        {/* PRIMARY INFO */}
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

        {/* ALERT */}
        {result.high_risk && (
          <Alert variant="danger">
            ⚠️ <strong>Critical condition detected.</strong> Immediate medical
            attention is recommended.
          </Alert>
        )}

        {/* CHART */}
        <div className="mt-4">
          <h6 className="text-secondary mb-3">
            Diagnostic Confidence Distribution
          </h6>
          <Bar data={data} options={options} />
        </div>

        {/* CLASSICAL ML OUTPUTS */}
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

        {/* 🧠 HF EXPLANATION */}
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

        {/* NLP CONTEXT */}
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
              {patientContext && (
                <p className="text-muted mb-2">{patientContext}</p>
              )}
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
