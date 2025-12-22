import { useState } from "react";
import { Card, Row, Col, Form, Badge } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import Layout from "../components/layout/Layout";

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
    <Layout>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card className="p-4">
          <h4>Treatment Response Simulator</h4>
          <p className="text-muted">
            Adjust therapy parameters to observe predicted response.
          </p>

          <Row className="g-4">
            <Col md={6}>
              <Form.Select
                value={form.type}
                onChange={(e) => update("type", e.target.value)}
              >
                <option value="antibiotic">Antibiotic</option>
                <option value="supportive">Supportive Care</option>
              </Form.Select>
            </Col>

            <Col md={6}>
              <Form.Range
                min={1}
                max={4}
                value={form.dose}
                onChange={(e) => update("dose", e.target.value)}
              />
              Dose: {form.dose}
            </Col>

            <Col md={6}>
              <Form.Range
                min={6}
                max={72}
                step={6}
                value={form.duration_hours}
                onChange={(e) =>
                  update("duration_hours", e.target.value)
                }
              />
              Duration: {form.duration_hours} hrs
            </Col>

            <Col md={6}>
              <Form.Select
                value={form.ventilation}
                onChange={(e) =>
                  update("ventilation", e.target.value)
                }
              >
                <option value="none">No Ventilation</option>
                <option value="non_invasive">
                  Non-Invasive Ventilation
                </option>
              </Form.Select>
            </Col>
          </Row>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-4 mt-4">
                  <h5>
                    Predicted Response{" "}
                    <Badge
                      bg={
                        result.response_label === "Good"
                          ? "success"
                          : result.response_label === "Moderate"
                          ? "warning"
                          : "danger"
                      }
                    >
                      {result.response_label}
                    </Badge>
                  </h5>

                  <h3>
                    {Math.round(result.response_score * 100)}%
                  </h3>

                  <p className="text-muted">
                    {result.explanation}
                  </p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </Layout>
  );
}
