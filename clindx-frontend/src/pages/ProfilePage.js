import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import api from "../api/axios";
import { Card, Row, Col, Badge } from "react-bootstrap";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const res = await api.get("/profile");
      setProfile(res.data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <Layout>
        <p style={{ color: "#6b7280" }}>Loading profile...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <Card
        className="p-4"
        style={{
          maxWidth: "720px",
          background: "#f9fafb",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
        }}
      >
        {/* HEADER */}
        <h3
          style={{
            color: "#0b132b",
            fontWeight: 700,
            marginBottom: "0.5rem",
          }}
        >
          Doctor Profile
        </h3>

        <p style={{ color: "#6b7280", marginBottom: "2rem" }}>
          Professional information associated with your account
        </p>

        {/* DETAILS */}
        <Row className="mb-4">
          <Col md={6}>
            <p style={{ color: "#6b7280", marginBottom: "4px" }}>
              Name
            </p>
            <p style={{ fontWeight: 600, color: "#111827" }}>
              {profile.name}
            </p>
          </Col>

          <Col md={6}>
            <p style={{ color: "#6b7280", marginBottom: "4px" }}>
              Email
            </p>
            <p style={{ fontWeight: 600, color: "#111827" }}>
              {profile.email}
            </p>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <p style={{ color: "#6b7280", marginBottom: "6px" }}>
              Specialization
            </p>
            <Badge
              style={{
                background: "#f5e6c8",
                color: "#111827",
                padding: "6px 12px",
                borderRadius: "10px",
                fontWeight: 600,
              }}
            >
              {profile.specialization}
            </Badge>
          </Col>

          <Col md={6}>
            <p style={{ color: "#6b7280", marginBottom: "6px" }}>
              Member Since
            </p>
            <p style={{ fontWeight: 600, color: "#111827" }}>
              {new Date(profile.joined_at).toLocaleDateString()}
            </p>
          </Col>
        </Row>
      </Card>
    </Layout>
  );
}
