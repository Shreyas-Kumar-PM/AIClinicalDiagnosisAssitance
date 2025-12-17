import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import api from "../api/axios";
import { Badge } from "react-bootstrap";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

export default function PatientSummaryPage() {
  const { patientId } = useParams();
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/patients/${patientId}/evaluations`);
        setEvaluations(res.data.reverse());
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [patientId]);

  if (loading) {
    return (
      <Layout>
        <div className="pm-table-card">Loading patient summary…</div>
      </Layout>
    );
  }

  const latest = evaluations[evaluations.length - 1];

  const chartData = {
    labels: evaluations.map((e) =>
      new Date(e.created_at).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Temperature (°F)",
        data: evaluations.map((e) => e.vitals?.temp),
        borderColor: "#0b132b",
        backgroundColor: "#0b132b",
        borderWidth: 2,
        tension: 0.35,
      },
      {
        label: "Heart Rate",
        data: evaluations.map((e) => e.vitals?.hr),
        borderColor: "#6b7280",
        backgroundColor: "#6b7280",
        borderWidth: 2,
        tension: 0.35,
      },
      {
        label: "SpO₂",
        data: evaluations.map((e) => e.vitals?.spo2),
        borderColor: "#b45309",
        backgroundColor: "#b45309",
        borderWidth: 2,
        tension: 0.35,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#020617",
          font: { weight: "600" },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#374151" },
        grid: { color: "#e5e7eb" },
      },
      y: {
        ticks: { color: "#374151" },
        grid: { color: "#e5e7eb" },
      },
    },
  };

  return (
    <Layout>
      {/* HEADER */}
      <div className="pm-header">
        <h2>Patient Summary</h2>
        <p>Overview of clinical evaluations and vitals trends</p>
      </div>

      {/* SUMMARY */}
      <div className="pm-table-card" style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", gap: 40, flexWrap: "wrap" }}>
          <SummaryItem
            label="Total Evaluations"
            value={evaluations.length}
          />

          <SummaryItem
            label="Last Diagnosis"
            value={latest?.diagnosis?.primary_diagnosis || "—"}
          />

          <SummaryItem
            label="Risk Status"
            value={
              latest?.diagnosis?.high_risk ? (
                <Badge bg="danger">High Risk</Badge>
              ) : (
                <Badge bg="success">Normal</Badge>
              )
            }
          />
        </div>
      </div>

      {/* CHART */}
      {evaluations.length > 1 ? (
        <div className="pm-table-card">
          <h4 style={{ marginBottom: 16 }}>Vitals Trend</h4>
          <Line data={chartData} options={chartOptions} />
        </div>
      ) : (
        <div className="pm-table-card">
          Not enough data to display trends.
        </div>
      )}
    </Layout>
  );
}

/* ===== Helper ===== */
function SummaryItem({ label, value }) {
  return (
    <div>
      <div
        style={{
          fontSize: 13,
          color: "#6b7280",
          fontWeight: 600,
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: "#020617",
        }}
      >
        {value}
      </div>
    </div>
  );
}
