import { useEffect, useRef, useState } from "react";
import {
  Card,
  Button,
  Spinner,
  Form,
  Badge,
  ProgressBar,
  Row,
  Col,
} from "react-bootstrap";
import Layout from "../components/layout/Layout";
import { fetchPatients } from "../services/patientsApi";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

export default function VoiceDiagnosisPage() {
  const token = localStorage.getItem("token");

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // 🆕 LIVE TRANSCRIPTION STATE
  const [finalTranscript, setFinalTranscript] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recognitionRef = useRef(null);

  /* ---------------- LOAD PATIENTS ---------------- */
  useEffect(() => {
    fetchPatients(token).then(setPatients).catch(console.error);
  }, [token]);

  /* ---------------- START RECORDING ---------------- */
  const startRecording = async () => {
    if (!SpeechRecognition) {
      alert("Live speech recognition not supported in this browser.");
      return;
    }

    // 🎙 AUDIO RECORDING (for backend)
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    audioChunksRef.current = [];
    recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
    recorder.start();
    mediaRecorderRef.current = recorder;

    // 🧠 LIVE SPEECH → TEXT
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += text + " ";
        } else {
          interim += text;
        }
      }

      if (final) {
        setFinalTranscript((prev) => prev + final);
      }
      setLiveTranscript(interim);
    };

    recognition.start();
    recognitionRef.current = recognition;

    // RESET STATE
    setFinalTranscript("");
    setLiveTranscript("");
    setResult(null);
    setRecording(true);
  };

  /* ---------------- STOP RECORDING ---------------- */
  const stopRecording = () => {
    recognitionRef.current?.stop();
    mediaRecorderRef.current.stop();

    setRecording(false);
    setLoading(true);

    mediaRecorderRef.current.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/wav",
      });

      const formData = new FormData();
      formData.append("audio", audioBlob);
      formData.append("patient_id", selectedPatient);

      const res = await fetch(
        "http://localhost:3000/api/v1/voice_diagnosis/evaluate",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await res.json();
      setResult(data);
      setLoading(false);
    };
  };

  return (
    <Layout>
      <h3 style={{ color: "#f8fafc", marginBottom: "24px" }}>
        🎙 Voice-Based Clinical Diagnosis
      </h3>

      {/* ================= CONTROLS ================= */}
      <Card style={darkCard} className="mb-4">
        <Card.Body>
          <Row className="align-items-end">
            <Col md={6}>
              <Form.Label className="text-light">
                Select Patient
              </Form.Label>
              <Form.Select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
              >
                <option value="">-- Choose Patient --</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (ID: {p.id})
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={6} className="text-end">
              {!recording ? (
                <Button
                  size="lg"
                  disabled={!selectedPatient}
                  onClick={startRecording}
                >
                  🎤 Start Recording
                </Button>
              ) : (
                <Button size="lg" variant="danger" onClick={stopRecording}>
                  ⏹ Stop & Analyze
                </Button>
              )}
            </Col>
          </Row>

          {recording && (
            <div className="mt-3">
              <Badge bg="success">LIVE TRANSCRIPTION</Badge>
            </div>
          )}

          {loading && (
            <div className="mt-3 text-light">
              <Spinner animation="border" size="sm" /> Analyzing voice input…
            </div>
          )}
        </Card.Body>
      </Card>

      {/* ================= LIVE CLINICAL TRANSCRIPT ================= */}
      {(finalTranscript || liveTranscript) && (
        <Card style={transcriptCard} className="mb-4">
          <Card.Body>
            <h5 style={{ color: "#111827", marginBottom: "12px" }}>
              📝 Clinical Transcript
            </h5>

            <div style={transcriptBox}>
              <strong>{finalTranscript}</strong>
              <span style={{ opacity: 0.5 }}>{liveTranscript}</span>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* ================= DIAGNOSIS ================= */}
      {result && (
        <>
          <Card style={darkCard} className="mb-4">
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h5 className="text-info">🧠 Primary Diagnosis</h5>
                  <h3 className="text-info fw-bold">
                    {result.diagnosis?.primary_diagnosis}
                  </h3>

                  <Badge
                    bg={result.diagnosis?.high_risk ? "danger" : "success"}
                  >
                    {result.diagnosis?.high_risk
                      ? "HIGH RISK"
                      : "LOW / MODERATE RISK"}
                  </Badge>
                </Col>

                <Col md={6}>
                  <h6 className="text-light">Overall Risk Score</h6>
                  <ProgressBar
                    now={result.diagnosis?.risk_score * 100}
                    label={`${Math.round(
                      result.diagnosis?.risk_score * 100
                    )}%`}
                    variant={
                      result.diagnosis?.risk_score > 0.7
                        ? "danger"
                        : "warning"
                    }
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card style={lightCard}>
            <Card.Body>
              <h5 style={{ color: "#111827" }}>📊 Model Insights</h5>

              <Row className="mt-3">
                <Col md={4}>
                  <strong style={darkText}>Vitals Risk</strong>
                  <p style={darkText}>
                    {result.diagnosis?.model_outputs?.vitals_risk_probability}
                  </p>
                </Col>

                <Col md={4}>
                  <strong style={darkText}>Lab Risk</strong>
                  <p style={darkText}>
                    {result.diagnosis?.model_outputs?.lab_risk_probability}
                  </p>
                </Col>

                <Col md={4}>
                  <strong style={darkText}>Symptom Model</strong>
                  <p style={darkText}>
                    {
                      result.diagnosis?.model_outputs
                        ?.classical_symptom_prediction
                    }
                  </p>
                </Col>
              </Row>

              <hr />

              <strong style={darkText}>🤖 AI Explanation</strong>
              <p style={{ ...darkText, marginTop: "8px" }}>
                {result.diagnosis?.model_outputs?.hf_explanation}
              </p>
            </Card.Body>
          </Card>
        </>
      )}
    </Layout>
  );
}

/* ================= STYLES ================= */

const darkCard = {
  background: "#020617",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.08)",
};

const lightCard = {
  background: "#f8f8e8",
  borderRadius: "16px",
  border: "1px solid #e5e7eb",
};

const transcriptCard = {
  background: "#fffbe6",
  borderRadius: "16px",
  border: "1px solid #fde68a",
};

const transcriptBox = {
  color: "#111827",
  fontSize: "16px",
  fontWeight: 500,
  lineHeight: "1.7",
  background: "#ffffff",
  padding: "16px",
  borderRadius: "12px",
  borderLeft: "6px solid #f59e0b",
  boxShadow: "inset 0 0 0 1px #e5e7eb",
};

const darkText = {
  color: "#111827",
};
