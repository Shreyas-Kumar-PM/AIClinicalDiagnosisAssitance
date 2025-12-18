import { Card, Badge, Row, Col, Alert } from "react-bootstrap";
import { Bar } from "react-chartjs-2";

export default function DiagnosisResult({ result }) {
  if (!result || !result.top_diagnoses || !result.model_outputs) {
    return null;
  }

  const hf = result.model_outputs.hf_analysis;

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
          d.name === result.primary_diagnosis ? "#ef4444" : "#6366f1"
        ),
        borderRadius: 12,
        barThickness: 60,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.raw}% confidence`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (v) => `${v}%`,
        },
      },
    },
  };

  // -------------------------
  // SAFE NLP TEXT (NOW WORKS)
  // -------------------------
  const patientContext =
    typeof hf?.hf_summary === "string" && hf.hf_summary.trim().length > 0
      ? hf.hf_summary
      : null;

  return (
    <Card className="glass-card p-4 mt-4">
      {/* HEADER */}
      <Row className="mb-3 align-items-center">
        <Col>
          <h4>
            Diagnosis{" "}
            <span style={{ color: "#6366f1", fontWeight: 600 }}>
              Result
            </span>
          </h4>
        </Col>
        <Col className="text-end">
          <Badge bg={result.high_risk ? "danger" : "success"} pill>
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
          <h5 style={{ color: result.high_risk ? "#ef4444" : "#22c55e" }}>
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

        <Row className="mt-3">
          <Col md={4}>
            <Card className="p-3 soft-card">
              <strong>Symptoms Model</strong>
              <p className="mb-0 text-muted">
                Prediction:{" "}
                <span style={{ color: "#6366f1" }}>
                  {result.model_outputs.classical_symptom_prediction}
                </span>
              </p>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="p-3 soft-card">
              <strong>Vitals Risk</strong>
              <p className="mb-0 text-muted">
                {Math.round(
                  result.model_outputs.vitals_risk_probability * 100
                )}
                %
              </p>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="p-3 soft-card">
              <strong>Lab Risk</strong>
              <p className="mb-0 text-muted">
                {Math.round(
                  result.model_outputs.lab_risk_probability * 100
                )}
                %
              </p>
            </Card>
          </Col>
        </Row>
      </div>

      {/* NLP REPORT */}
      {hf && (
        <div className="mt-4">
          <h6 className="text-secondary">
            Clinical Language Model (NLP) Report
          </h6>

          <Card className="p-4 soft-card mt-2">
            {patientContext && (
              <>
                <p className="mb-2">
                  <strong>Patient Presents With</strong>
                </p>
                <p className="text-muted mb-3">
                  {patientContext}
                </p>
              </>
            )}

            <Row>
              <Col md={6}>
                <Badge bg="info">
                  Model: {hf.hf_model}
                </Badge>
              </Col>
              <Col md={6} className="text-end">
                <Badge bg="secondary">
                  NLP Signal Strength: {hf.hf_confidence.toFixed(2)}
                </Badge>
              </Col>
            </Row>

            <p className="mt-3 text-muted" style={{ fontSize: "0.85rem" }}>
              ℹ️ NLP output provides contextual understanding only and does not
              influence the final diagnosis.
            </p>
          </Card>
        </div>
      )}
    </Card>
  );
}
