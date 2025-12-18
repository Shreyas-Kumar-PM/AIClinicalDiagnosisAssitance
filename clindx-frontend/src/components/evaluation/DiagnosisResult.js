import { Card, Badge, Row, Col, Alert } from "react-bootstrap";
import { Bar } from "react-chartjs-2";

export default function DiagnosisResult({ result }) {
  if (!result || !result.top_diagnoses) return null;

  // ✅ USE REAL CONFIDENCE VALUES
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

  return (
    <Card className="glass-card p-4 mt-4">
      {/* HEADER */}
      <Row className="mb-3">
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
          <p className="mb-1">
            <strong>Primary Diagnosis</strong>
          </p>
          <h5 style={{ color: result.high_risk ? "#ef4444" : "#22c55e" }}>
            {result.primary_diagnosis}
          </h5>
        </Col>

        <Col md={6}>
          <p className="mb-1">
            <strong>High Risk Status</strong>
          </p>
          {result.high_risk ? (
            <Badge bg="danger">YES</Badge>
          ) : (
            <Badge bg="success">NO</Badge>
          )}
        </Col>
      </Row>

      {/* HIGH RISK WARNING */}
      {result.high_risk && (
        <Alert variant="danger" className="mt-2">
          ⚠️ <strong>Critical condition detected.</strong> Immediate medical
          attention is recommended.
        </Alert>
      )}

      {/* CHART */}
      <div className="mt-4">
        <h6 style={{ color: "#64748b" }} className="mb-3">
          Diagnostic Confidence Distribution
        </h6>
        <Bar data={data} options={options} />
      </div>

      {/* MODEL OUTPUTS */}
      {result.model_outputs && (
        <div className="mt-4">
          <h6 style={{ color: "#64748b" }}>AI Model Insights</h6>

          <Row className="mt-3">
            <Col md={4}>
              <Card className="p-3 soft-card">
                <strong>Symptoms Model</strong>
                <p className="mb-0 text-muted">
                  Predicted:{" "}
                  <span style={{ color: "#6366f1" }}>
                    {result.model_outputs.symptom_prediction}
                  </span>
                </p>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="p-3 soft-card">
                <strong>Vitals Risk</strong>
                <p className="mb-0 text-muted">
                  {(result.model_outputs.vitals_risk_probability * 100).toFixed(
                    0
                  )}
                  %
                </p>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="p-3 soft-card">
                <strong>Lab Risk</strong>
                <p className="mb-0 text-muted">
                  {(result.model_outputs.lab_risk_probability * 100).toFixed(0)}
                  %
                </p>
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </Card>
  );
}
