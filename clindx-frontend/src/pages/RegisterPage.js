import { useState } from "react";
import api from "../api/axios";
import { Form, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const submit = async () => {
    try {
      const res = await api.post("/register", {
        doctor: form,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="brand-title">ClinDx AI</div>
        <div className="brand-subtitle">Doctor Registration</div>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form>
          <Form.Control
            className="mb-3"
            placeholder="Full Name"
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <Form.Control
            className="mb-3"
            placeholder="Email"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <Form.Control
            className="mb-3"
            placeholder="Specialization"
            onChange={(e) =>
              setForm({ ...form, specialization: e.target.value })
            }
          />

          <Form.Control
            className="mb-4"
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          <Button className="w-100" onClick={submit}>
            Create Account
          </Button>
        </Form>

        <div className="auth-footer">
          Already registered? <Link to="/">Login</Link>
        </div>
      </div>
    </div>
  );
}
