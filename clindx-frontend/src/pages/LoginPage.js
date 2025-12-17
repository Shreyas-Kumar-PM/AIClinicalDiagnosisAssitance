import { useState } from "react";
import api from "../api/axios";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await api.post("/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="brand-title">ClinDx AI</div>
        <div className="brand-subtitle">
          AI-powered clinical decision support
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form>
          <Form.Control
            className="mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Form.Control
            className="mb-4"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button className="w-100" onClick={login}>
            Login
          </Button>
        </Form>

        <div className="auth-footer">
          New doctor? <Link to="/register">Create account</Link>
        </div>
      </div>
    </div>
  );
}
