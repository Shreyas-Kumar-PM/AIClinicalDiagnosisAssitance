import { useParams } from "react-router-dom";
import { useState } from "react";
import Layout from "../components/layout/Layout";
import api from "../api/axios";
import DiagnosisResult from "../components/evaluation/DiagnosisResult";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";

export default function EvaluationPage() {
  const { patientId } = useParams();
  const [symptoms, setSymptoms] = useState("");
  const [vitals, setVitals] = useState({});
  const [labs, setLabs] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const res = await api.post(`/patients/${patientId}/evaluations`, {
        symptoms: symptoms.split(",").map((s) => s.trim()),
        vitals,
        labs,
      });

      // ✅ IMPORTANT FIX HERE
      if (res.data?.diagnosis) {
        setResult(res.data.diagnosis);
      } else {
        setError("Diagnosis not generated. Please try again.");
      }
    } catch (err) {
      setError("Failed to run diagnosis. Please check inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* HEADER */}
      <div className="pm-header" style={{ maxWidth: "900px" }}>
        <h2>Patient Evaluation</h2>
        <p>Enter symptoms, vitals and lab values to run diagnosis</p>
      </div>

      {/* FORM */}
      <div className="pm-add-card" style={{ maxWidth: "900px" }}>
        <Form>
          {/* SYMPTOMS */}
          <Form.Label className="pm-label">Symptoms</Form.Label>
          <Form.Control
            className="pm-input mb-4"
            placeholder="fever, chills, headache"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
          />

          {/* VITALS */}
          <h5 className="mb-3" style={{ color: "#0f172a" }}>
            Vitals
          </h5>
          <Row className="g-4 mb-4">
            {["temp", "hr", "bp_sys", "spo2"].map((v) => (
              <Col md={6} key={v}>
                <Form.Control
                  className="pm-input"
                  placeholder={v.toUpperCase()}
                  onChange={(e) =>
                    setVitals({ ...vitals, [v]: Number(e.target.value) })
                  }
                />
              </Col>
            ))}
          </Row>

          {/* LABS */}
          <h5 className="mb-3" style={{ color: "#0f172a" }}>
            Laboratory Results
          </h5>
          <Row className="g-4 mb-4">
            {["glucose", "cholesterol", "trestbps"].map((l) => (
              <Col md={6} key={l}>
                <Form.Control
                  className="pm-input"
                  placeholder={l.toUpperCase()}
                  onChange={(e) =>
                    setLabs({ ...labs, [l]: Number(e.target.value) })
                  }
                />
              </Col>
            ))}
          </Row>

          {/* SUBMIT */}
          <Button
            className="pm-primary-btn"
            disabled={loading}
            onClick={submit}
          >
            {loading ? "Running Diagnosis..." : "Run Diagnosis"}
          </Button>
        </Form>
      </div>

      {/* ERROR */}
      {error && (
        <Alert variant="danger" className="mt-4">
          {error}
        </Alert>
      )}

      {/* RESULT */}
      {result && <DiagnosisResult result={result} />}
    </Layout>
  );
}
