import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Header() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <Navbar
      expand="lg"
      style={{
        background: "#020617",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <Container fluid>
        <Navbar.Brand
          as={Link}
          to="/dashboard"
          style={{
            color: "#f5f5dc",
            fontWeight: 800,
            letterSpacing: "0.5px",
          }}
        >
          ClinDx AI
        </Navbar.Brand>

        <Nav className="ms-auto">
          <Nav.Link
            as={Link}
            to="/profile"
            style={{ color: "#e5e7eb", marginRight: "16px" }}
          >
            Profile
          </Nav.Link>

          <Button variant="outline-light" size="sm" onClick={logout}>
            Logout
          </Button>
        </Nav>
      </Container>
    </Navbar>
  );
}
