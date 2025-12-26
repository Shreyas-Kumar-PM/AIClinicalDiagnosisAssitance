import { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import Layout from "../components/layout/Layout";
import { getVitalsTrends } from "../api/vitalsTrendsApi";
import { getPatients } from "../api/patientApi";

export default function VitalsTrendAnalyzerPage() {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [data, setData] = useState(null);
  
    useEffect(() => {
      getPatients().then(res => setPatients(res.data));
    }, []);
  
    const loadVitals = (patient) => {
      setSelectedPatient(patient);
      setData(null);
  
      getVitalsTrends(patient.id)
        .then(res => setData(res.data))
        .catch(console.error);
    };
  
    const buildChart = (label, key, color) => {
      const filtered = data.trends.filter(t => t[key] !== null);
  
      return {
        labels: filtered.map(t =>
          new Date(t.time).toLocaleDateString()
        ),
        datasets: [
          {
            label,
            data: filtered.map(t => t[key]),
            borderColor: color,
            backgroundColor: `${color}33`,
            fill: true,
            tension: 0.35
          }
        ]
      };
    };
  
    return (
      <Layout>
        <div className="vitals-page">
          {/* HEADER */}
          <div className="mb-4">
            <h2>Vitals Trend Analyzer</h2>
            <p>Select a patient to view vitals over time</p>
          </div>
  
          {/* PATIENT SELECTION */}
          <Row className="g-4 mb-5">
            {patients.map(p => (
              <Col md={4} key={p.id}>
                <Card
                  className={`glass-card patient-card p-3 ${
                    selectedPatient?.id === p.id ? "selected" : ""
                  }`}
                  onClick={() => loadVitals(p)}
                >
                  <h6>{p.name}</h6>
                  <div className="small">Age: {p.age}</div>
                  <div className="small">Gender: {p.gender}</div>
                </Card>
              </Col>
            ))}
          </Row>
  
          {!data && (
            <Card className="glass-card vitals-empty">
              Select a patient to view vitals trends
            </Card>
          )}
  
          {data && (
            <>
              <h5 className="mb-4">
                Vitals for <strong>{data.patient_name}</strong>
              </h5>
  
              <Row className="g-4">
                <Col md={6}>
                  <Card className="glass-card vitals-chart-card">
                    <h6>Heart Rate</h6>
                    <Line data={buildChart("Heart Rate", "heart_rate", "#3b82f6")} />
                  </Card>
                </Col>
  
                <Col md={6}>
                  <Card className="glass-card vitals-chart-card">
                    <h6>SpO₂</h6>
                    <Line data={buildChart("SpO₂", "spo2", "#22c55e")} />
                  </Card>
                </Col>
  
                <Col md={6}>
                  <Card className="glass-card vitals-chart-card">
                    <h6>Temperature</h6>
                    <Line data={buildChart("Temperature", "temperature", "#ef4444")} />
                  </Card>
                </Col>
  
                <Col md={6}>
                  <Card className="glass-card vitals-chart-card">
                    <h6>Systolic BP</h6>
                    <Line data={buildChart("Systolic BP", "systolic_bp", "#a855f7")} />
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </div>
      </Layout>
    );
  }
  
