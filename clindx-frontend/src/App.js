import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import PatientsPage from "./pages/PatientsPage";
import EvaluationPage from "./pages/EvaluationPage";
import EvaluationHistoryPage from "./pages/EvaluationHistoryPage";
import EvaluationDetailPage from "./pages/EvaluationDetailPage";
import PatientSummaryPage from "./pages/PatientSummaryPage";
import AuditLogsPage from "./pages/AuditLogsPage";
import ProfilePage from "./pages/ProfilePage";
import WhatIfSimulatorPage from "./pages/WhatIfSimulatorPage";
import TreatmentResponseSimulatorPage from "./pages/TreatmentResponseSimulatorPage";
import EarlyWarningPage from "./pages/EarlyWarningPage";
import VitalsTrendAnalyzerPage from "./pages/VitalsTrendAnalyzerPage";

/* ✅ NEW */
import VoiceDiagnosisPage from "./pages/VoiceDiagnosisPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/patients" element={<PatientsPage />} />

        <Route path="/evaluate/:patientId" element={<EvaluationPage />} />
        <Route
          path="/patients/:patientId/history"
          element={<EvaluationHistoryPage />}
        />
        <Route
          path="/patients/:patientId/evaluations/:evaluationId"
          element={<EvaluationDetailPage />}
        />
        <Route
          path="/patients/:patientId/summary"
          element={<PatientSummaryPage />}
        />

        {/* 🎙 Voice-Based Diagnosis */}
        <Route
          path="/voice-diagnosis"
          element={<VoiceDiagnosisPage />}
        />

        <Route path="/audit-logs" element={<AuditLogsPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route
          path="/patients/:patientId/simulator"
          element={<WhatIfSimulatorPage />}
        />
        <Route
          path="/patients/:patientId/treatment"
          element={<TreatmentResponseSimulatorPage />}
        />

        <Route path="/early-warning" element={<EarlyWarningPage />} />
        <Route
          path="/vitals-trends/:patientId"
          element={<VitalsTrendAnalyzerPage />}
        />
      </Routes>
    </Router>
  );
}
