import Layout from "../components/layout/Layout";
import { Card, Row, Col, Button, Badge, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Pie, Line } from "react-chartjs-2";
import { motion } from "framer-motion";

export default function DashboardPage() {
  /* ================= SAMPLE DATA (SAFE / STATIC) ================= */
  const analyticsData = {
    labels: ["Viral", "Bacterial", "Sepsis Risk"],
    datasets: [
      {
        data: [55, 30, 15],
        backgroundColor: ["#1e3a8a", "#64748b", "#b91c1c"],
        borderWidth: 0,
      },
    ],
  };

  const riskTrendData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        data: [22, 35, 48, 41, 62],
        borderColor: "#1e3a8a",
        backgroundColor: "rgba(30,58,138,0.15)",
        tension: 0.45,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: "#1e3a8a",
      },
    ],
  };

  const recentEvaluations = [
    { patient: "John D.", diagnosis: "Viral Infection", risk: "Low", time: "2h ago" },
    { patient: "Anita S.", diagnosis: "Bacterial Infection", risk: "Moderate", time: "5h ago" },
    { patient: "Rahul K.", diagnosis: "Sepsis Risk", risk: "High", time: "1d ago" },
  ];

  return (
    <Layout>
      {/* ================= HERO ================= */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: "linear-gradient(135deg, #1e3a8a, #020617)",
          borderRadius: "24px",
          padding: "52px",
          marginBottom: "36px",
          color: "#f8fafc",
        }}
      >
        <h1 style={{ fontWeight: 800, letterSpacing: "-0.5px" }}>
          ClinDx <span style={{ color: "#f5f5dc" }}>AI</span>
        </h1>
        <p style={{ maxWidth: "760px", lineHeight: 1.7, color: "#e5e7eb" }}>
          Clinical decision support platform combining patient symptoms, vital
          signs, laboratory data, and machine learning models to deliver early
          diagnostic insights and structured risk stratification.
        </p>
        <div className="mt-3">
          <Badge bg="light" text="dark" className="me-2">
            Clinical Decision Support
          </Badge>
          <Badge bg="secondary">ML-Powered</Badge>
        </div>
      </motion.div>

      {/* ================= KPI STATS ================= */}
      <Row className="g-4 mb-5">
        {[
          { label: "Active Patients", value: "128" },
          { label: "Evaluations Run", value: "342" },
          { label: "High-Risk Flags", value: "27", color: "#b91c1c" },
        ].map((stat, i) => (
          <Col md={4} key={i}>
            <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
              <Card
                className="p-4 h-100"
                style={{
                  borderRadius: "18px",
                  background: "#fefce8",
                  border: "1px solid #e5e7eb",
                }}
              >
                <h6 className="text-muted mb-1">{stat.label}</h6>
                <h3
                  style={{
                    fontWeight: 700,
                    color: stat.color || "#0f172a",
                  }}
                >
                  {stat.value}
                </h3>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* ================= ANALYTICS ================= */}
      <Row className="g-4 mb-5">
        <Col md={7}>
          <Card
            className="p-4 h-100"
            style={{
              borderRadius: "20px",
              background: "#ffffff",
              border: "1px solid #e5e7eb",
            }}
          >
            <h5 className="mb-3">Risk Trend (Last 5 Days)</h5>
            <Line
              data={riskTrendData}
              options={{
                responsive: true,
                animation: { duration: 900 },
                plugins: { legend: { display: false } },
                scales: {
                  y: { beginAtZero: true, ticks: { callback: (v) => `${v}%` } },
                },
              }}
            />
          </Card>
        </Col>

        <Col md={5}>
          <Card
            className="p-4 h-100 text-center"
            style={{
              borderRadius: "20px",
              background: "#ffffff",
              border: "1px solid #e5e7eb",
            }}
          >
            <h6 className="mb-3 text-secondary">
              Diagnosis Distribution
            </h6>
            <Pie data={analyticsData} />
          </Card>
        </Col>
      </Row>

      {/* ================= QUICK ACTIONS ================= */}
      <Row className="g-4 mb-5">
        {[
          {
            title: "Patients",
            text: "View and manage patient records",
            link: "/patients",
            btn: "View Patients",
          },
          {
            title: "New Evaluation",
            text: "Run an AI-powered diagnostic evaluation",
            link: "/patients",
            btn: "Start Evaluation",
          },
          {
            title: "AI Insights",
            text: "Advanced analytics & trends",
            disabled: true,
            btn: "Coming Soon",
          },
        ].map((card, i) => (
          <Col md={4} key={i}>
            <motion.div whileHover={{ scale: 1.04 }}>
              <Card
                className="p-4 h-100"
                style={{
                  borderRadius: "18px",
                  background: "#f1f5f9",
                  border: "1px solid #e5e7eb",
                }}
              >
                <h5 style={{ fontWeight: 600 }}>{card.title}</h5>
                <p className="text-muted">{card.text}</p>

                {card.disabled ? (
                  <Button disabled className="w-100">
                    {card.btn}
                  </Button>
                ) : (
                  <Link to={card.link}>
                    <Button
                      className="w-100"
                      style={{
                        background: "#1e3a8a",
                        border: "none",
                        fontWeight: 600,
                      }}
                    >
                      {card.btn}
                    </Button>
                  </Link>
                )}
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

      {/* ================= RECENT EVALUATIONS ================= */}
      <Card
        className="p-4"
        style={{
          borderRadius: "20px",
          background: "#ffffff",
          border: "1px solid #e5e7eb",
        }}
      >
        <h5 className="mb-3">Recent Evaluations</h5>
        <Table hover responsive className="align-middle">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Diagnosis</th>
              <th>Risk</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {recentEvaluations.map((e, i) => (
              <tr key={i}>
                <td>{e.patient}</td>
                <td>{e.diagnosis}</td>
                <td>
                  <Badge
                    bg={
                      e.risk === "High"
                        ? "danger"
                        : e.risk === "Moderate"
                        ? "warning"
                        : "success"
                    }
                  >
                    {e.risk}
                  </Badge>
                </td>
                <td>{e.time}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    </Layout>
  );
}
