import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import api from "../api/axios";
import { Table, Alert } from "react-bootstrap";

export default function EvaluationHistoryPage() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/patients/${patientId}/evaluations`);
        setHistory(res.data);
      } catch (err) {
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [patientId]);

  return (
    <Layout>
      {/* HEADER */}
      <div className="pm-header">
        <h2>Evaluation History</h2>
        <p>Past AI evaluations and risk assessments</p>
      </div>

      {/* CONTENT */}
      <div className="pm-table-card">
        {loading && (
          <Alert variant="secondary">
            Loading evaluation history…
          </Alert>
        )}

        {!loading && history.length === 0 && (
          <Alert variant="warning">
            No evaluations found for this patient.
          </Alert>
        )}

        {!loading && history.length > 0 && (
          <Table hover responsive borderless>
            <thead>
              <tr>
                <th>Date</th>
                <th>Primary Diagnosis</th>
                <th>High Risk</th>
              </tr>
            </thead>

            <tbody>
              {history.map((e) => (
                <tr
                  key={e.id}
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    navigate(
                      `/patients/${patientId}/evaluations/${e.id}`
                    )
                  }
                >
                  <td>
                    {new Date(e.created_at).toLocaleString()}
                  </td>

                  <td>
                    {e.diagnosis?.primary_diagnosis || "—"}
                  </td>

                  <td>
                    {e.diagnosis?.high_risk ? (
                      <span style={{ color: "#991b1b", fontWeight: 700 }}>
                        YES
                      </span>
                    ) : (
                      <span style={{ color: "#065f46", fontWeight: 600 }}>
                        NO
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </Layout>
  );
}
