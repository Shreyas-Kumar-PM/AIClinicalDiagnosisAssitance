import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div
      style={{
        width: "230px",
        minHeight: "100vh",
        background: "#020617",
        padding: "28px",
        borderRight: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <h6
        style={{
          color: "#f5f5dc",
          fontWeight: 700,
          marginBottom: "28px",
        }}
      >
        Doctor Panel
      </h6>

      <Nav className="flex-column">
        <Nav.Link
          as={Link}
          to="/dashboard"
          style={{ color: "#e5e7eb", marginBottom: "12px" }}
        >
          Dashboard
        </Nav.Link>

        <Nav.Link
          as={Link}
          to="/patients"
          style={{ color: "#e5e7eb", marginBottom: "12px" }}
        >
          Patients
        </Nav.Link>

        <Nav.Link
          as={Link}
          to="/audit-logs"
          style={{ color: "#e5e7eb" }}
        >
          Audit Logs
        </Nav.Link>
      </Nav>
    </div>
  );
}
