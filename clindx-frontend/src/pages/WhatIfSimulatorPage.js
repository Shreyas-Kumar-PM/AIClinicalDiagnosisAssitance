import { useState } from "react";
import { Card, Row, Col, Form, Badge } from "react-bootstrap";
import { motion } from "framer-motion";
import { runWhatIfSimulation } from "../api/simulatorApi";
import Layout from "../components/layout/Layout";

export default function WhatIfSimulatorPage() {
  const [vitals, setVitals] = useState({
    heart_rate: 90,
    systolic_bp: 120,
    diastolic_bp: 80,
    respiratory_rate: 18,
    spo2: 98,
    temperature: 37,
  });

  const [result, setResult] = useState(null);

  const handleChange = (key, value) => {
    const updated = { ...vitals, [key]: Number(value) };
    setVitals(updated);

    runWhatIfSimulation(updated).then((res) =>
      setResult(res.data)
    );
  };

  const vitalMeta = {
    heart_rate: { label: "Heart Rate", unit: "bpm", min: 40, max: 180 },
    systolic_bp: { label: "Systolic BP", unit: "mmHg", min: 80, max: 200 },
    diastolic_bp: { label: "Diastolic BP", unit: "mmHg", min: 40, max: 120 },
    respiratory_rate: { label: "Respiratory Rate", unit: "/min", min: 8, max: 40 },
    spo2: { label: "SpO₂", unit: "%", min: 80, max: 100 },
    temperature: { label: "Temperature", unit: "°C", min: 34, max: 42 },
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        {/* HEADER */}
        <Card
          className="p-4 mb-4"
          style={{
            background: "linear-gradient(135deg, #1e3a8a, #020617)",
            borderRadius: "20px",
            color: "#f8fafc",
            border: "none",
          }}
        >
          <h3 style={{ fontWeight: 700 }}>What-If Clinical Simulator</h3>
          <p style={{ color: "#e5e7eb", maxWidth: 700 }}>
            Adjust patient vitals to simulate physiological changes and observe
            real-time risk recalculation.
          </p>
        </Card>

        {/* VITALS */}
        <Row className="g-4">
          {Object.entries(vitals).map(([key, value]) => (
            <Col md={6} key={key}>
              <motion.div whileHover={{ y: -4 }}>
                <Card
                  className="p-4 h-100"
                  style={{
                    borderRadius: "18px",
                    background: "#fefce8",
                    border: "1px solid #e5e7eb",
                  }}
                >
                  <div className="d-flex justify-content-between mb-2">
                    <h6 style={{ fontWeight: 600 }}>
                      {vitalMeta[key].label}
                    </h6>
                    <Badge bg="secondary">
                      {value} {vitalMeta[key].unit}
                    </Badge>
                  </div>

                  <Form.Range
                    min={vitalMeta[key].min}
                    max={vitalMeta[key].max}
                    value={value}
                    onChange={(e) =>
                      handleChange(key, e.target.value)
                    }
                  />
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* RESULT */}
        {result && (
          <Card className="p-4 mt-4">
            <h5>Simulated Risk</h5>
            <Badge
              bg={
                result.simulated_risk_label === "High"
                  ? "danger"
                  : result.simulated_risk_label === "Moderate"
                  ? "warning"
                  : "success"
              }
            >
              {result.simulated_risk_label}
            </Badge>
            <h3 className="mt-2">
              {Math.round(result.simulated_risk_score * 100)}%
            </h3>
            <p className="text-muted">{result.explanation}</p>
          </Card>
        )}
      </motion.div>
    </Layout>
  );
}
