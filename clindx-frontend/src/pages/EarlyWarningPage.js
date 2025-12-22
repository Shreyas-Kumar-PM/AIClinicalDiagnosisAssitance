import { useEffect, useState } from "react";
import { Card, Row, Col, Badge, ProgressBar } from "react-bootstrap";
import { motion } from "framer-motion";
import api from "../api/axios";
import Layout from "../components/layout/Layout"; // ✅ ADD THIS

export default function EarlyWarningPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("/early_warning").then((res) => {
      setData(res.data || []);
    });
  }, []);

  const riskVariant = (label) => {
    if (label === "High") return "danger";
    if (label === "Moderate") return "warning";
    return "success";
  };

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          padding: "32px",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #020617, #020617)",
          color: "#f8fafc",
        }}
      >
        <h2 style={{ fontWeight: 700 }}>Early Warning System</h2>
        <p className="text-secondary">
          Automated detection of patient deterioration using latest evaluations.
        </p>

        <Row className="g-4 mt-4">
          {data.map((p) => (
            <Col md={6} key={p.patient_id}>
              <motion.div whileHover={{ scale: 1.02 }}>
                <Card
                  className="p-4"
                  style={{
                    borderRadius: "16px",
                    background: "#ffffff",
                    color: "#020617",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 style={{ fontWeight: 600 }}>{p.patient_name}</h5>
                    <Badge bg={riskVariant(p.risk_label)}>
                      {p.risk_label} Risk
                    </Badge>
                  </div>

                  <div className="mt-3">
                    <strong>Deterioration Score:</strong> {p.score}%
                  </div>

                  <ProgressBar
                    now={p.score}
                    variant={riskVariant(p.risk_label)}
                    className="my-2"
                  />

                  <div className="mt-3">
                    <strong>Triggers:</strong>{" "}
                    {p.triggers && p.triggers.length > 0
                      ? p.triggers.join(", ")
                      : "No abnormal signals detected"}
                  </div>

                  <div
                    className="mt-2 text-muted"
                    style={{ fontSize: "0.9rem" }}
                  >
                    <strong>Last Evaluation:</strong>{" "}
                    {p.last_evaluation_at
                      ? new Date(p.last_evaluation_at).toLocaleString()
                      : "No evaluation yet"}
                  </div>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </motion.div>
    </Layout>
  );
}
