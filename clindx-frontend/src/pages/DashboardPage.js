import Layout from "../components/layout/Layout";
import { Card, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  return (
    <Layout>
      {/* Header */}
      <div
        className="glass-card p-4 mb-5"
        style={{
          background: "linear-gradient(135deg, #0b132b, #111827)",
        }}
      >
        <h2 style={{ color: "#f5f5dc", fontWeight: 800 }}>
          ClinDx <span style={{ color: "#e5e7eb" }}>AI</span>
        </h2>
        <p style={{ color: "#d1d5db", marginTop: "8px" }}>
          Intelligent clinical decision support powered by machine learning
        </p>
      </div>

      {/* Cards */}
      <Row className="g-4">
        {/* Patients */}
        <Col md={4}>
          <Card
            style={{
              background: "#e5e7eb",
              borderRadius: "16px",
              border: "none",
              height: "100%",
            }}
            className="p-4"
          >
            <h5 style={{ fontWeight: 700, color: "#0b132b" }}>
              Patients
            </h5>
            <p style={{ color: "#374151" }}>
              Manage patient records
            </p>

            <Link to="/patients">
              <Button
                style={{
                  background: "#f5f5dc",
                  border: "none",
                  color: "#0b132b",
                  fontWeight: 600,
                }}
                className="w-100 dashboard-btn"
              >
                View Patients
              </Button>
            </Link>
          </Card>
        </Col>

        {/* Evaluation */}
        <Col md={4}>
          <Card
            style={{
              background: "#e5e7eb",
              borderRadius: "16px",
              border: "none",
              height: "100%",
            }}
            className="p-4"
          >
            <h5 style={{ fontWeight: 700, color: "#0b132b" }}>
              New Evaluation
            </h5>
            <p style={{ color: "#374151" }}>
              Run a new AI diagnosis
            </p>

            <Link to="/patients">
              <Button
                style={{
                  background: "#f5f5dc",
                  border: "none",
                  color: "#0b132b",
                  fontWeight: 600,
                }}
                className="w-100 dashboard-btn"
              >
                Start Evaluation
              </Button>
            </Link>
          </Card>
        </Col>

        {/* Insights */}
        <Col md={4}>
          <Card
            style={{
              background: "#e5e7eb",
              borderRadius: "16px",
              border: "none",
              height: "100%",
            }}
            className="p-4"
          >
            <h5 style={{ fontWeight: 700, color: "#0b132b" }}>
              AI Insights
            </h5>
            <p style={{ color: "#374151" }}>
              Confidence-based analytics
            </p>

            <Button
              disabled
              style={{
                background: "#d1d5db",
                border: "none",
                color: "#6b7280",
                fontWeight: 600,
              }}
              className="w-100"
            >
              Coming Soon
            </Button>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
}
