import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import api from "../api/axios";
import { Card, Row, Col, Badge } from "react-bootstrap";
import { Line, Pie } from "react-chartjs-2";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [patientsCount, setPatientsCount] = useState(0);
  const [evaluations, setEvaluations] = useState([]);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const load = async () => {
      try {
        const patientsRes = await api.get("/patients");

        let allEvaluations = [];
        for (const p of patientsRes.data) {
          const ev = await api.get(`/patients/${p.id}/evaluations`);
          allEvaluations.push(...ev.data);
        }

        setPatientsCount(patientsRes.data.length);
        setEvaluations(allEvaluations);
      } catch (e) {
        console.error("Dashboard load failed", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /* ================= DERIVED METRICS ================= */
  const totalEvaluations = evaluations.length;

  const highRiskCount = evaluations.filter(
    (e) => e.diagnosis?.high_risk === true
  ).length;

  /* ================= RISK TREND ================= */
  const trendPoints = evaluations
    .slice(-7)
    .map((e) => {
      const top = e.diagnosis?.top_diagnoses?.[0];
      return top ? Math.round(top.confidence * 100) : 0;
    });

  const trendLabels = evaluations
    .slice(-7)
    .map((e) =>
      new Date(e.created_at).toLocaleDateString()
    );

  const riskTrendData = {
    labels: trendLabels,
    datasets: [
      {
        label: "Risk %",
        data: trendPoints,
        borderColor: "#1e3a8a",
        backgroundColor: "rgba(30,58,138,0.15)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  /* ================= DIAGNOSIS DISTRIBUTION ================= */
  const diagnosisMap = {};
  evaluations.forEach((e) => {
    const d = e.diagnosis?.primary_diagnosis || "Unknown";
    diagnosisMap[d] = (diagnosisMap[d] || 0) + 1;
  });

  const diagnosisData = {
    labels: Object.keys(diagnosisMap),
    datasets: [
      {
        data: Object.values(diagnosisMap),
        backgroundColor: [
          "#1e3a8a",
          "#64748b",
          "#b91c1c",
          "#15803d",
          "#7c3aed",
        ],
      },
    ],
  };

  /* ================= RECENT ================= */
  const recent = evaluations.slice(0, 5);

  /* ================= UI ================= */
  return (
    <Layout>
      <Card
        className="p-5 mb-4"
        style={{
          background: "linear-gradient(135deg,#1e3a8a,#020617)",
          color: "#f8fafc",
          borderRadius: "22px",
        }}
      >
        <h1 style={{ fontWeight: 800 }}>ClinDx AI</h1>
        <p className="text-light">
          Real-time clinical intelligence powered by evaluations
        </p>
      </Card>

      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <>
          {/* ================= STATS ================= */}
          <Row className="g-4 mb-4">
            <Col md={4}>
              <Stat title="Active Patients" value={patientsCount} />
            </Col>
            <Col md={4}>
              <Stat title="Evaluations Run" value={totalEvaluations} />
            </Col>
            <Col md={4}>
              <Stat
                title="High-Risk Flags"
                value={highRiskCount}
                danger
              />
            </Col>
          </Row>

          {/* ================= CHARTS ================= */}
          <Row className="g-4 mb-4">
            <Col md={7}>
              <Card className="p-4">
                <h6>Risk Trend</h6>
                {trendPoints.length ? (
                  <Line data={riskTrendData} />
                ) : (
                  <p className="text-muted">No trend data</p>
                )}
              </Card>
            </Col>

            <Col md={5}>
              <Card className="p-4">
                <h6>Diagnosis Distribution</h6>
                {Object.keys(diagnosisMap).length ? (
                  <Pie data={diagnosisData} />
                ) : (
                  <p className="text-muted">No diagnosis data</p>
                )}
              </Card>
            </Col>
          </Row>

          {/* ================= RECENT ================= */}
          <Card className="p-4">
            <h6>Recent Evaluations</h6>

            {recent.length === 0 ? (
              <p className="text-muted">No evaluations yet</p>
            ) : (
              recent.map((e) => (
                <div
                  key={e.id}
                  className="d-flex justify-content-between align-items-center mb-2"
                >
                  <span>
                    {e.diagnosis?.primary_diagnosis || "Unknown"}
                  </span>
                  <Badge
                    bg={e.diagnosis?.high_risk ? "danger" : "success"}
                  >
                    {e.diagnosis?.high_risk ? "High Risk" : "Low Risk"}
                  </Badge>
                </div>
              ))
            )}
          </Card>
        </>
      )}
    </Layout>
  );
}

/* ================= SMALL COMPONENT ================= */
function Stat({ title, value, danger }) {
  return (
    <Card
      className="p-4"
      style={{
        borderRadius: "16px",
        border: "1px solid #e5e7eb",
      }}
    >
      <h6 className="text-muted">{title}</h6>
      <h2 style={{ color: danger ? "#b91c1c" : "#0f172a" }}>
        {value}
      </h2>
    </Card>
  );
}
