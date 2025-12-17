import { Card, Badge } from "react-bootstrap";
import { Bar } from "react-chartjs-2";

export default function DiagnosisResult({ result }) {
  if (!result || !result.top_diagnoses) return null;

  const max = Math.max(...result.top_diagnoses.map((d) => d.confidence));

  const data = {
    labels: result.top_diagnoses.map((d) => d.name),
    datasets: [
      {
        data: result.top_diagnoses.map((d) =>
          Math.round((d.confidence / max) * 100)
        ),
        backgroundColor: "#6366f1",
        borderRadius: 10,
      },
    ],
  };

  return (
    <Card className="glass-card p-4 mt-4">
      <h4>
        Diagnosis <span style={{ color: "#6366f1" }}>Result</span>
      </h4>

      <p>
        <strong>Primary:</strong>{" "}
        <span style={{ color: "#6366f1" }}>
          {result.primary_diagnosis}
        </span>
      </p>

      <p>
        <strong>High Risk:</strong>{" "}
        {result.high_risk ? (
          <Badge bg="danger">YES</Badge>
        ) : (
          <Badge bg="success">NO</Badge>
        )}
      </p>

      <Bar data={data} options={{ responsive: true }} />
    </Card>
  );
}
