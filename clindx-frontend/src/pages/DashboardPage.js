import Layout from "../components/layout/Layout";
import { Card, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { motion } from "framer-motion";

export default function DashboardPage() {
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

  return (
    <Layout>
      {/* ================= HEADER ================= */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-card p-4 mb-4 dashboard-header"
      >
        <h2>
          ClinDx <span>AI</span>
        </h2>
        <p>
          ClinDx AI assists clinicians by combining patient symptoms, vitals,
          lab values, and advanced machine learning models to provide early
          diagnostic insights and risk stratification.
        </p>
      </motion.div>

      {/* ================= INFO SECTION ================= */}
      <Row className="mb-4">
        <Col md={8}>
          <Card className="dashboard-info-card p-4">
            <h5>How ClinDx AI Works</h5>
            <p>
              The system evaluates patient-reported symptoms, vital signs, and
              lab investigations using ensemble machine learning models.
              Natural language models add contextual understanding while
              preserving clinical safety.
            </p>
            <p className="mb-0">
              This tool is intended for <strong>clinical decision support</strong>
              and does not replace professional medical judgment.
            </p>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="dashboard-info-card p-4 text-center">
            <h6 className="mb-3">Diagnosis Distribution</h6>
            <Pie data={analyticsData} />
          </Card>
        </Col>
      </Row>

      {/* ================= MAIN ACTION CARDS ================= */}
      <Row className="g-4">
        {[
          {
            title: "Patients",
            text: "Manage patient records and view history",
            link: "/patients",
            btn: "View Patients",
          },
          {
            title: "New Evaluation",
            text: "Run an AI-powered diagnosis",
            link: "/patients",
            btn: "Start Evaluation",
          },
          {
            title: "AI Insights",
            text: "Advanced confidence-based analytics",
            disabled: true,
            btn: "Coming Soon",
          },
        ].map((card, i) => (
          <Col md={4} key={i}>
            <motion.div
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="dashboard-action-card p-4">
                <h5>{card.title}</h5>
                <p>{card.text}</p>

                {card.disabled ? (
                  <Button disabled className="w-100 dashboard-disabled-btn">
                    {card.btn}
                  </Button>
                ) : (
                  <Link to={card.link}>
                    <Button className="w-100 dashboard-primary-btn">
                      {card.btn}
                    </Button>
                  </Link>
                )}
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
    </Layout>
  );
}
