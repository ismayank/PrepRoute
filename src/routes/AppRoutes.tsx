import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import CreateTest from "../pages/CreateTest";
import AddQuestions from "../pages/AddQuestions";
import PreviewPublish from "../pages/PreviewPublish";
import TestTracking from "../pages/TestTracking";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/create-test" element={
        <ProtectedRoute>
          <CreateTest />
        </ProtectedRoute>
      } />
      <Route path="/edit-test/:id" element={
        <ProtectedRoute>
          <CreateTest />
        </ProtectedRoute>
      } />
      <Route path="/add-questions" element={
        <ProtectedRoute>
          <AddQuestions />
        </ProtectedRoute>
      } />
      <Route path="/preview-publish/:id" element={
        <ProtectedRoute>
          <PreviewPublish />
        </ProtectedRoute>
      } />
      <Route path="/test-tracking" element={
        <ProtectedRoute>
          <TestTracking />
        </ProtectedRoute>
      } />
    </Routes>
  );
}