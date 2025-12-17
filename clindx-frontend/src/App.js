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
        <Route path="/audit-logs" element={<AuditLogsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}
