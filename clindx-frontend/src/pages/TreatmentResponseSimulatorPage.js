import { useState } from "react";
import { Card, Row, Col, Form, Badge } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";

export default function TreatmentResponseSimulatorPage() {
  const [form, setForm] = useState({
    type: "antibiotic",
    dose: 1,
    duration_hours: 12,
    ventilation: "none",
  });

  const [result, setResult] = useState(null);

  const update = (key, value) => {
    const updated = { ...form, [key]: value };
    setForm(updated);

    api
      .post("/simulator/treatment_response", { treatment: updated })
      .then((res) => setResult(res.data));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card
        className="p-4"
        style={{
          background: "linear-gradient(180deg,#f8fafc,#eef2f7)",
          borderRadius: 18,
          boxShadow: "0 20px 40px rgba(15,23,42,0.08)",
        }}
      >
        <h4 className="mb-1">Treatment Response Simulator</h4>
        <p className="text-muted mb-4">
          Adjust therapy parameters to observe predicted patient response.
        </p>

        <Row className="g-4">
          <Col md={6}>
            <Card className="p-3 h-100">
              <Form.Label>Treatment Type</Form.Label>
              <Form.Select
                value={form.type}
                onChange={(e) => update("type", e.target.value)}
              >
                <option value="antibiotic">Antibiotic</option>
                <option value="supportive">Supportive Care</option>
              </Form.Select>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="p-3 h-100">
              <Form.Label>Dose Level</Form.Label>
              <Form.Range
                min={1}
                max={4}
                value={form.dose}
                onChange={(e) => update("dose", e.target.value)}
              />
              <strong>Level {form.dose}</strong>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="p-3 h-100">
              <Form.Label>Duration (hours)</Form.Label>
              <Form.Range
                min={6}
                max={72}
                step={6}
                value={form.duration_hours}
                onChange={(e) => update("duration_hours", e.target.value)}
              />
              <strong>{form.duration_hours} hrs</strong>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="p-3 h-100">
              <Form.Label>Ventilation Support</Form.Label>
              <Form.Select
                value={form.ventilation}
                onChange={(e) => update("ventilation", e.target.value)}
              >
                <option value="none">No Ventilation</option>
                <option value="non_invasive">Non-Invasive Ventilation</option>
              </Form.Select>
            </Card>
          </Col>
        </Row>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card
                className="p-4 mt-4"
                style={{
                  background: "#fefce8",
                  borderRadius: 16,
                }}
              >
                <h5 className="mb-2">
                  Predicted Response{" "}
                  <Badge
                    bg={
                      result.response_label === "Good"
                        ? "success"
                        : result.response_label === "Moderate"
                        ? "warning"
                        : "danger"
                    }
                    className="ms-2"
                  >
                    {result.response_label}
                  </Badge>
                </h5>

                <h2 style={{ fontWeight: 700 }}>
                  {Math.round(result.response_score * 100)}%
                </h2>

                <p className="text-muted mt-2">{result.explanation}</p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
