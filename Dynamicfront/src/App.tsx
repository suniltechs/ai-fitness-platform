import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "@/routes/ProtectedRoute";
import LoginPage from "@/pages/LoginPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import RegisterPage from "@/pages/RegisterPage";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import AccountStatusPage from "@/pages/student/AccountStatusPage";

// Admin layout + pages
import AdminDashboard from "@/pages/AdminDashboard";
import AdminOverview from "@/pages/admin/AdminOverview";
import StudentManagement from "@/pages/admin/StudentManagement";
import AttendanceMonitor from "@/pages/admin/AttendanceMonitor";
import AssignWorkout from "@/pages/admin/AssignWorkout";
import ImportExport from "@/pages/admin/ImportExport";
import Announcements from "@/pages/admin/Announcements";
import WorkoutMonitoring from "@/pages/admin/WorkoutMonitoring";
import AdminProfile from "@/pages/admin/AdminProfile";
import StudentDetails from "@/pages/admin/StudentDetails";
import ManageAchievements from "@/pages/admin/ManageAchievements";
import AdminTestimonials from "@/pages/admin/AdminTestimonials";
import AdminRAGChat from "@/pages/admin/AdminRAGChat";

// Student layout + pages
import StudentDashboard from "@/pages/StudentDashboard";
import StudentOverview from "@/pages/student/StudentOverview";
import MyWorkouts from "@/pages/student/MyWorkouts";
import MyMetrics from "@/pages/student/MyMetrics";
import MyDiet from "@/pages/student/MyDiet";
import MyAttendance from "@/pages/student/MyAttendance";
import PendingApproval from "@/pages/student/PendingApproval";
import BMICalculatorPage from "@/pages/student/BMICalculatorPage";
import StudentProfile from "@/pages/student/StudentProfile";
import MyAnnouncements from "@/pages/student/MyAnnouncements";

import LandingPage from "@/pages/LandingPage";
import AchievementsPage from "@/pages/AchievementsPage";
import ServicesPage from "@/pages/ServicesPage";
import MembershipPage from "@/pages/MembershipPage";
import TermsPage from "@/pages/TermsPage";
import PrivacyPage from "@/pages/PrivacyPage";
import ContactUs from "@/pages/ContactUs";
import ScrollToTop from "@/components/ScrollToTop";

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/membership" element={<MembershipPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/account-status" element={<AccountStatusPage />} />
        <Route
          path="/waiting-approval"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <PendingApproval />
            </ProtectedRoute>
          }
        />

        {/* Admin routes (nested) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="students/:id" element={<StudentDetails />} />
          <Route path="attendance" element={<AttendanceMonitor />} />
          <Route path="workouts" element={<AssignWorkout />} />
          <Route path="import-export" element={<ImportExport />} />
          <Route path="announcements" element={<Announcements />} />
          <Route path="monitoring" element={<WorkoutMonitoring />} />
          <Route path="achievements" element={<ManageAchievements />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="ai-assistant" element={<AdminRAGChat />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* Student routes (nested) */}
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentOverview />} />
          <Route path="workouts" element={<MyWorkouts />} />
          <Route path="metrics" element={<MyMetrics />} />
          <Route path="diet" element={<MyDiet />} />
          <Route path="attendance" element={<MyAttendance />} />
          <Route path="bmi" element={<BMICalculatorPage />} />
          <Route path="announcements" element={<MyAnnouncements />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
};

export default App;
