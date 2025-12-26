import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import api from "../api/axios";
import { Card, Row, Col, Badge, Table } from "react-bootstrap";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [patientsCount, setPatientsCount] = useState(0);
  const [evaluations, setEvaluations] = useState([]);

  /* ================= FETCH ================= */
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
        setEvaluations(allEvaluations.reverse());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  /* ================= METRICS ================= */
  const totalEvaluations = evaluations.length;
  const highRiskCount = evaluations.filter(
    (e) => e.diagnosis?.high_risk
  ).length;

  /* ================= CHART DATA ================= */
  const normalCount = evaluations.filter(
    (e) => !e.diagnosis?.high_risk
  ).length;

  const criticalCount = highRiskCount;

  const pieData = {
    labels: ["Normal", "Critical"],
    datasets: [
      {
        data: [normalCount, criticalCount],
        backgroundColor: ["#2563eb", "#dc2626"],
        borderWidth: 0,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#374151",
          fontWeight: 600,
        },
      },
    },
  };

  const trendValues = evaluations.slice(-30).map((e) => {
    const top = e.diagnosis?.top_diagnoses?.[0];
    return top ? Number(top.confidence.toFixed(2)) : 0;
  });

  const trendData = {
    labels: trendValues.map((_, i) => i + 1),
    datasets: [
      {
        label: "Risk Score",
        data: trendValues,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.15)",
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: "#374151" },
      },
    },
    scales: {
      x: {
        grid: { color: "#e5e7eb" },
        ticks: { color: "#6b7280" },
      },
      y: {
        min: 0,
        max: 1,
        grid: { color: "#e5e7eb" },
        ticks: { color: "#6b7280" },
      },
    },
  };

  const recent = evaluations.slice(0, 5);

  /* ================= UI ================= */
  return (
    <Layout>
      {/* HEADER (MATCHES PATIENTS PAGE) */}
      <div className="patients-header">
        <h2>ClinDx AI Dashboard</h2>
        <p>Real-time clinical risk intelligence & monitoring</p>
      </div>

      {loading ? (
        <p>Loading dashboard…</p>
      ) : (
        <>
          {/* STATS */}
          <Row className="g-4 mb-4">
            <Col md={4}>
              <Stat title="Active Patients" value={patientsCount} />
            </Col>
            <Col md={4}>
              <Stat title="Evaluations Run" value={totalEvaluations} />
            </Col>
            <Col md={4}>
              <Stat title="High-Risk Flags" value={highRiskCount} danger />
            </Col>
          </Row>

          {/* CHARTS */}
          <Row className="g-4 mb-4">
            <Col md={12}>
              <Card className="patients-table-card">
                <h5 className="mb-3">Risk Level Distribution</h5>
                <div
                  style={{
                    height: "300px",
                    maxWidth: "520px",
                    margin: "0 auto",
                  }}
                >
                  <Pie data={pieData} options={pieOptions} />
                </div>
              </Card>
            </Col>

            <Col md={12}>
              <Card className="patients-table-card">
                <h5 className="mb-3">Risk Score Trend</h5>
                <div style={{ height: "420px" }}>
                  <Line data={trendData} options={trendOptions} />
                </div>
              </Card>
            </Col>
          </Row>

          {/* RECENT TABLE */}
          <Card className="patients-table-card">
            <h5 className="mb-3">Recent Evaluations</h5>

            {recent.length === 0 ? (
              <p className="empty-text">No evaluations yet</p>
            ) : (
              <Table borderless>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Diagnosis</th>
                    <th>Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((e) => (
                    <tr key={e.id}>
                      <td>
                        {new Date(e.created_at).toLocaleDateString()}
                      </td>
                      <td>
                        {e.diagnosis?.primary_diagnosis || "Unknown"}
                      </td>
                      <td>
                        <Badge
                          bg={
                            e.diagnosis?.high_risk
                              ? "danger"
                              : "success"
                          }
                        >
                          {e.diagnosis?.high_risk
                            ? "Critical"
                            : "Normal"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </>
      )}
    </Layout>
  );
}

/* ================= STAT ================= */
function Stat({ title, value, danger }) {
  return (
    <Card className="patients-table-card">
      <h6 style={{ color: "#6b7280", fontWeight: 600 }}>
        {title}
      </h6>
      <h2
        style={{
          color: danger ? "#dc2626" : "#020617",
          fontWeight: 800,
        }}
      >
        {value}
      </h2>
    </Card>
  );
}
