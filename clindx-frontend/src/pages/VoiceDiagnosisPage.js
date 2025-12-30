import { useEffect, useRef, useState } from "react";
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  Badge,
  Alert,
} from "react-bootstrap";
import Layout from "../components/layout/Layout";
import { fetchPatients } from "../services/patientsApi";
import api from "../api/axios";
import DiagnosisResult from "../components/evaluation/DiagnosisResult";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

/* ================= MEDICAL TERMS ================= */
const MEDICAL_TERMS = [
  "fever",
  "chills",
  "cough",
  "chest pain",
  "shortness of breath",
  "headache",
  "nausea",
  "vomiting",
  "spo2",
  "oxygen",
  "infection",
  "sepsis",
  "blood pressure",
  "glucose",
  "heart rate",
  "tachycardia",
];

export default function VoiceDiagnosisPage() {
  const token = localStorage.getItem("token");

  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");

  /* VOICE */
  const [recording, setRecording] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState("");
  const [liveTranscript, setLiveTranscript] = useState("");
  const [editableTranscript, setEditableTranscript] = useState("");
  const [confidence, setConfidence] = useState(null);

  /* CLINICAL INPUTS */
  const [vitals, setVitals] = useState({});
  const [labs, setLabs] = useState({});

  /* RESULT */
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  /* REFS */
  const recognitionRef = useRef(null);
  const confidenceSamples = useRef([]);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationRef = useRef(null);

  /* LOAD PATIENTS */
  useEffect(() => {
    fetchPatients(token).then(setPatients).catch(console.error);
  }, [token]);

  /* ================= WAVEFORM ================= */
  const startWaveform = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioCtx = new AudioContext();
    const source = audioCtx.createMediaStreamSource(stream);
    const analyser = audioCtx.createAnalyser();

    analyser.fftSize = 2048;
    source.connect(analyser);

    audioContextRef.current = audioCtx;
    analyserRef.current = analyser;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const bufferLength = analyser.fftSize;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = "#020617";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = "#facc15";
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();
  };

  const stopWaveform = () => {
    cancelAnimationFrame(animationRef.current);
    audioContextRef.current?.close();
  };

  /* ================= START RECORDING ================= */
  const startRecording = () => {
    if (!SpeechRecognition) {
      alert("Speech recognition not supported.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    confidenceSamples.current = [];

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i][0];
        const text = res.transcript;

        if (typeof res.confidence === "number") {
          confidenceSamples.current.push(res.confidence);
        }

        event.results[i].isFinal
          ? (final += text + " ")
          : (interim += text);
      }

      if (final) setFinalTranscript((p) => p + final);
      setLiveTranscript(interim);
    };

    recognition.start();
    recognitionRef.current = recognition;

    setFinalTranscript("");
    setLiveTranscript("");
    setEditableTranscript("");
    setResult(null);
    setConfidence(null);
    setRecording(true);

    startWaveform();
  };

  /* ================= STOP RECORDING ================= */
  const stopRecording = () => {
    recognitionRef.current?.stop();
    setRecording(false);
    stopWaveform();

    const formatted =
      finalTranscript
        .trim()
        .replace(/\s+/g, " ")
        .replace(/(^\w|\.\s+\w)/g, (c) => c.toUpperCase()) + ".";

    setEditableTranscript(formatted);
    setLiveTranscript("");

    if (confidenceSamples.current.length) {
      const avg =
        confidenceSamples.current.reduce((a, b) => a + b, 0) /
        confidenceSamples.current.length;
      setConfidence(Math.round(avg * 100));
    }
  };

  /* ================= RUN DIAGNOSIS ================= */
  const runDiagnosis = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const res = await api.post(
        `/patients/${selectedPatient}/evaluations`,
        {
          symptoms: editableTranscript.split(",").map((s) => s.trim()),
          vitals,
          labs,
        }
      );

      if (res.data?.diagnosis) setResult(res.data.diagnosis);
      else setError("Diagnosis not generated.");
    } catch {
      setError("Failed to run diagnosis.");
    } finally {
      setLoading(false);
    }
  };

  /* ================= HIGHLIGHT PREVIEW ================= */
  const highlightMedicalTerms = (text) => {
    let out = text;
    MEDICAL_TERMS.forEach((term) => {
      const r = new RegExp(`\\b(${term})\\b`, "gi");
      out = out.replace(r, `<span class="medical">$1</span>`);
    });
    return out;
  };

  return (
    <Layout>
      <h3 className="text-light mb-4">🎙 Voice-Based Clinical Diagnosis</h3>

      {/* PATIENT + RECORD */}
      <Card style={darkCard} className="mb-4">
        <Card.Body>
          <Row>
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
                    {p.name}
                  </option>
                ))}
              </Form.Select>
            </Col>

            <Col md={6} className="text-end">
              {!recording ? (
                <Button disabled={!selectedPatient} onClick={startRecording}>
                  🎤 Start Recording
                </Button>
              ) : (
                <Button variant="danger" onClick={stopRecording}>
                  ⏹ Stop Recording
                </Button>
              )}
            </Col>
          </Row>

          {recording && (
            <>
              <Badge bg="success" className="mt-3">
                LIVE TRANSCRIPTION
              </Badge>
              <canvas
                ref={canvasRef}
                width="800"
                height="120"
                style={{ width: "100%", marginTop: 16, borderRadius: 12 }}
              />
            </>
          )}
        </Card.Body>
      </Card>

      {/* TRANSCRIPT */}
      {(recording || editableTranscript) && (
        <Card style={transcriptCard} className="mb-4">
          <Card.Body>
            <div className="d-flex justify-content-between">
              <h5>📝 Clinical Transcript</h5>
              {confidence && (
                <Badge bg="info">Confidence {confidence}%</Badge>
              )}
            </div>

            <Form.Control
              as="textarea"
              rows={4}
              value={editableTranscript}
              onChange={(e) => setEditableTranscript(e.target.value)}
            />

            <div
              className="preview"
              dangerouslySetInnerHTML={{
                __html: highlightMedicalTerms(editableTranscript),
              }}
            />

            {recording && (
              <div className="live">{liveTranscript}</div>
            )}
          </Card.Body>
        </Card>
      )}

      {/* VITALS */}
      <Card className="pm-add-card mb-4">
        <h5>Vitals</h5>
        <Row className="g-4">
          {["temp", "hr", "bp_sys", "spo2"].map((v) => (
            <Col md={6} key={v}>
              <Form.Control
                placeholder={v.toUpperCase()}
                onChange={(e) =>
                  setVitals({ ...vitals, [v]: Number(e.target.value) })
                }
              />
            </Col>
          ))}
        </Row>
      </Card>

      {/* LABS */}
      <Card className="pm-add-card mb-4">
        <h5>Laboratory Results</h5>
        <Row className="g-4">
          {["glucose", "cholesterol", "trestbps"].map((l) => (
            <Col md={6} key={l}>
              <Form.Control
                placeholder={l.toUpperCase()}
                onChange={(e) =>
                  setLabs({ ...labs, [l]: Number(e.target.value) })
                }
              />
            </Col>
          ))}
        </Row>
      </Card>

      <Button
        className="pm-primary-btn"
        disabled={loading || !editableTranscript}
        onClick={runDiagnosis}
      >
        {loading ? "Running Diagnosis..." : "Run Diagnosis"}
      </Button>

      {error && <Alert variant="danger" className="mt-4">{error}</Alert>}
      {result && <DiagnosisResult result={result} />}

      <style>{`
        .preview {
          margin-top: 12px;
          padding: 14px;
          background: #ffffff;
          border-radius: 12px;
          border-left: 6px solid #facc15;
          font-weight: 500;
          color: #020617;
        }
        .medical {
          background: #fde68a;
          padding: 2px 6px;
          border-radius: 6px;
          font-weight: 700;
        }
        .live {
          margin-top: 10px;
          font-style: italic;
          color: #64748b;
        }
      `}</style>
    </Layout>
  );
}

/* STYLES */
const darkCard = {
  background: "#020617",
  borderRadius: "16px",
};

const transcriptCard = {
  background: "#fffbe6",
  borderRadius: "16px",
};
