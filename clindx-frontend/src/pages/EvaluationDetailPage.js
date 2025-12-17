import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import api from "../api/axios";
import { Row, Col, Badge } from "react-bootstrap";

export default function EvaluationDetailPage() {
  const { patientId, evaluationId } = useParams();
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(
          `/patients/${patientId}/evaluations/${evaluationId}`
        );
        setEvaluation(res.data);
      } catch (err) {
        setEvaluation(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [patientId, evaluationId]);

  if (loading) {
    return (
      <Layout>
        <div className="pm-table-card">Loading evaluation details…</div>
      </Layout>
    );
  }

  if (!evaluation) {
    return (
      <Layout>
        <div className="pm-table-card">Failed to load evaluation.</div>
      </Layout>
    );
  }

  /* ===== Clinical Alerts ===== */
  const alerts = [];
  if (evaluation.vitals?.temp > 102)
    alerts.push("High fever detected (Temperature > 102°F)");
  if (evaluation.vitals?.spo2 < 92)
    alerts.push("Low oxygen saturation (SpO₂ < 92%)");
  if (evaluation.labs?.glucose > 180)
    alerts.push("Elevated blood glucose level");

  return (
    <Layout>
      {/* HEADER */}
      <div className="pm-header">
        <h2>Evaluation Details</h2>
        <p>
          Conducted on{" "}
          {new Date(evaluation.created_at).toLocaleString()}
        </p>
      </div>

      {/* 🚨 CLINICAL ALERT BANNER */}
      {alerts.length > 0 && (
        <div
          style={{
            background: "#fef3c7", // soft beige
            borderLeft: "6px solid #b91c1c", // medical red
            borderRadius: 14,
            padding: "18px 20px",
            marginBottom: 28,
          }}
        >
          <div
            style={{
              fontWeight: 800,
              color: "#7c2d12",
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            🚨 Clinical Alert
          </div>

          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {alerts.map((a, i) => (
              <li
                key={i}
                style={{
                  color: "#7c2d12",
                  fontWeight: 600,
                  marginBottom: 6,
                }}
              >
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* VITALS & LABS */}
      <Row className="mb-4">
        <Col md={6}>
          <div className="pm-table-card">
            <h5 style={{ marginBottom: 16 }}>Vitals</h5>
            <TableRow label="Temperature" value={evaluation.vitals?.temp} unit="°F" />
            <TableRow label="Heart Rate" value={evaluation.vitals?.hr} unit="bpm" />
            <TableRow label="Blood Pressure (Sys)" value={evaluation.vitals?.bp_sys} unit="mmHg" />
            <TableRow label="SpO₂" value={evaluation.vitals?.spo2} unit="%" />
          </div>
        </Col>

        <Col md={6}>
          <div className="pm-table-card">
            <h5 style={{ marginBottom: 16 }}>Laboratory Results</h5>
            <TableRow label="Glucose" value={evaluation.labs?.glucose} unit="mg/dL" />
            <TableRow label="Cholesterol" value={evaluation.labs?.cholesterol} unit="mg/dL" />
            <TableRow label="Resting BP" value={evaluation.labs?.trestbps} unit="mmHg" />
          </div>
        </Col>
      </Row>

      {/* DIAGNOSIS */}
      <div className="pm-table-card">
        <h5 style={{ marginBottom: 12 }}>AI Diagnosis</h5>

        <div
          style={{
            background: "#e5e7eb",
            borderRadius: 12,
            padding: 16,
            fontWeight: 700,
            color: "#020617",
          }}
        >
          {evaluation.diagnosis?.primary_diagnosis || "—"}
        </div>

        {evaluation.diagnosis?.high_risk && (
          <div style={{ marginTop: 12 }}>
            <Badge bg="danger">High Risk Case</Badge>
          </div>
        )}
      </div>
    </Layout>
  );
}

/* ===== Helper Row ===== */
function TableRow({ label, value, unit }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 0",
        borderBottom: "1px solid #cbd5e1",
      }}
    >
      <span style={{ fontWeight: 600 }}>{label}</span>
      <span>
        {value ?? "—"} {value ? unit : ""}
      </span>
    </div>
  );
}
