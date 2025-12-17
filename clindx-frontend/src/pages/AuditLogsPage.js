import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import api from "../api/axios";
import { Card, Table, Badge } from "react-bootstrap";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/audit_logs");
      setLogs(res.data);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <Layout>
      <Card
        className="p-4"
        style={{
          background: "#f9fafb",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
        }}
      >
        {/* HEADER */}
        <h3 style={{ color: "#0b132b", fontWeight: 700 }}>
          Audit Logs
        </h3>
        <p style={{ color: "#6b7280", marginBottom: "1.5rem" }}>
          System activity recorded for compliance and traceability
        </p>

        {/* CONTENT */}
        {loading ? (
          <p style={{ color: "#6b7280" }}>Loading logs...</p>
        ) : (
          <Table responsive borderless hover>
            <thead
              style={{
                borderBottom: "1px solid #e5e7eb",
                color: "#111827",
              }}
            >
              <tr>
                <th>Time</th>
                <th>Action</th>
                <th>Entity</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((l) => (
                <tr
                  key={l.id}
                  style={{
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <td style={{ color: "#374151" }}>
                    {new Date(l.created_at).toLocaleString()}
                  </td>

                  <td>
                    <Badge
                      style={{
                        background: "#f5e6c8",
                        color: "#111827",
                        fontWeight: 600,
                        padding: "6px 10px",
                        borderRadius: "8px",
                      }}
                    >
                      {l.action}
                    </Badge>
                  </td>

                  <td style={{ color: "#4b5563" }}>
                    {l.auditable_type} #{l.auditable_id}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </Layout>
  );
}
