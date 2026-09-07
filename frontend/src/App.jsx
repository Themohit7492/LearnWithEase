import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import StartLearning from "./pages/StartLearning.jsx";
import EducationSelection from "./pages/EducationSelection.jsx";
import SubjectSelection from "./pages/SubjectSelection.jsx";
import SubjectDetails from "./pages/SubjectDetails.jsx";
import ChapterLearning from "./pages/ChapterLearning.jsx";
import Profile from "./pages/Profile.jsx";
import NotFound from "./pages/NotFound.jsx";
import AdminChapter from "./pages/AdminChapter";
const P = ({ children, adminOnly = false }) => (
  <ProtectedRoute adminOnly={adminOnly}>{children}</ProtectedRoute>
);
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <P>
                <Dashboard />
              </P>
            }
          />
          <Route
            path="/start-learning"
            element={
              <P>
                <StartLearning />
              </P>
            }
          />
          <Route
            path="/education/:educationId"
            element={
              <P>
                <EducationSelection />
              </P>
            }
          />
          <Route
            path="/subjects"
            element={
              <P>
                <SubjectSelection />
              </P>
            }
          />
          <Route
            path="/subject/:subjectId"
            element={
              <P>
                <SubjectDetails />
              </P>
            }
          />
          <Route
            path="/subject/:subjectId/chapter/:chapterId"
            element={
              <P>
                <ChapterLearning />
              </P>
            }
          />
          <Route
            path="/profile"
            element={
              <P>
                <Profile />
              </P>
            }
          />
          <Route
            path="/admin/chapter"
            element={
              <P adminOnly>
                <AdminChapter />
              </P>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
