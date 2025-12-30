import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const linkStyle = (path) => ({
    color: location.pathname.startsWith(path) ? "#facc15" : "#e5e7eb",
    marginBottom: "14px",
    fontWeight: location.pathname.startsWith(path) ? 600 : 400,
  });

  return (
    <aside
      style={{
        width: "230px",
        minHeight: "100vh",
        background: "#020617",
        padding: "28px 22px",
        borderRight: "1px solid rgba(255,255,255,0.08)",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Title */}
      <h6
        style={{
          color: "#f5f5dc",
          fontWeight: 700,
          marginBottom: "28px",
          letterSpacing: "0.6px",
        }}
      >
        🩺 Doctor Panel
      </h6>

      <Nav className="flex-column">
        <Nav.Link as={Link} to="/dashboard" style={linkStyle("/dashboard")}>
          Dashboard
        </Nav.Link>

        <Nav.Link as={Link} to="/patients" style={linkStyle("/patients")}>
          Patients
        </Nav.Link>

        {/* 🎙 Voice Diagnosis */}
        <Nav.Link
          as={Link}
          to="/voice-diagnosis"
          style={linkStyle("/voice-diagnosis")}
        >
          Voice Diagnosis
        </Nav.Link>

        {/* 🚨 Early Warning */}
        <Nav.Link
          as={Link}
          to="/early-warning"
          style={linkStyle("/early-warning")}
        >
           Early Warning System
        </Nav.Link>

        {/* 📈 Vitals */}
        <Nav.Link
          as={Link}
          to="/vitals-trends/4"
          style={linkStyle("/vitals-trends")}
        >
          Vitals Trends
        </Nav.Link>

        {/* 🧾 Audit */}
        <Nav.Link
          as={Link}
          to="/audit-logs"
          style={linkStyle("/audit-logs")}
        >
          Audit Logs
        </Nav.Link>
      </Nav>
    </aside>
  );
}
