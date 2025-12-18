import { useEffect, useState } from "react";
import { Table, Button, Form, Row, Col, Modal } from "react-bootstrap";
import Layout from "../components/layout/Layout";
import { getPatients, addPatient, deletePatient } from "../api/patientApi";
import { Link } from "react-router-dom";

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    const res = await getPatients();
    setPatients(res.data);
  };

  const submit = async () => {
    await addPatient(form);
    setForm({});
    load();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deletePatient(deleteTarget.id);
    setDeleteTarget(null);
    load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Layout>
      {/* ================= HEADER ================= */}
      <div className="pm-header">
        <h2>Patients Management</h2>
        <p>Manage patients and access clinical insights</p>
      </div>

      {/* ================= ADD PATIENT ================= */}
      <div className="pm-add-card">
        <h4>Add New Patient</h4>

        <Row className="mt-4 g-3 align-items-end">
          <Col md={4}>
            <Form.Label>Name</Form.Label>
            <Form.Control
              placeholder="Full name"
              value={form.name || ""}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </Col>

          <Col md={3}>
            <Form.Label>Age</Form.Label>
            <Form.Control
              placeholder="Age"
              value={form.age || ""}
              onChange={(e) =>
                setForm({ ...form, age: e.target.value })
              }
            />
          </Col>

          <Col md={3}>
            <Form.Label>Gender</Form.Label>
            <Form.Control
              placeholder="Gender"
              value={form.gender || ""}
              onChange={(e) =>
                setForm({ ...form, gender: e.target.value })
              }
            />
          </Col>

          <Col md={2}>
            <Button className="pm-primary-btn w-100" onClick={submit}>
              Add Patient
            </Button>
          </Col>
        </Row>
      </div>

      {/* ================= PATIENTS TABLE ================= */}
      <div className="pm-table-card">
        <Table responsive borderless>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th style={{ width: "300px" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {patients.length === 0 && (
              <tr>
                <td colSpan="4" className="pm-empty">
                  No patients registered yet
                </td>
              </tr>
            )}

            {patients.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.age}</td>
                <td>{p.gender}</td>
                <td>
                  <div className="pm-actions">
                    <Link to={`/patients/${p.id}/summary`}>
                      <button className="pm-secondary-btn">
                        Summary
                      </button>
                    </Link>

                    <Link to={`/patients/${p.id}/history`}>
                      <button className="pm-secondary-btn">
                        History
                      </button>
                    </Link>

                    <Link to={`/evaluate/${p.id}`}>
                      <button className="pm-primary-btn">
                        Evaluate
                      </button>
                    </Link>

                    <button
                      className="pm-danger-btn"
                      onClick={() => setDeleteTarget(p)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* ================= DELETE CONFIRM MODAL ================= */}
      <Modal
        show={!!deleteTarget}
        onHide={() => setDeleteTarget(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Patient</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong>{deleteTarget?.name}</strong>?  
          <br />
          This action cannot be undone.
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setDeleteTarget(null)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
}
