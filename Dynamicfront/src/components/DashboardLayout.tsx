import { useState, type ReactNode } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthProvider";
import {
  BarChart3,
  Users,
  ClipboardList,
  Dumbbell,
  TrendingUp,
  FolderDown,
  Megaphone,
  UserCircle,
  Apple,
  Scale,
  Menu,
  X,
  LogOut,
  Zap,
  Trophy,
  Brain,
} from "lucide-react";
import AIChatWidget from "./AIChatWidget";

interface NavItem {
  label: string;
  to: string;
  icon: ReactNode;
}

const adminNav: NavItem[] = [
  { label: "Overview", to: "/admin", icon: <BarChart3 className="w-4 h-4" /> },
  {
    label: "AI Assistant",
    to: "/admin/ai-assistant",
    icon: <Brain className="w-4 h-4" />,
  },
  {
    label: "Students",
    to: "/admin/students",
    icon: <Users className="w-4 h-4" />,
  },
  {
    label: "Attendance",
    to: "/admin/attendance",
    icon: <ClipboardList className="w-4 h-4" />,
  },
  {
    label: "Assign Workout",
    to: "/admin/workouts",
    icon: <Dumbbell className="w-4 h-4" />,
  },
  {
    label: "Workout Status",
    to: "/admin/monitoring",
    icon: <TrendingUp className="w-4 h-4" />,
  },
  {
    label: "Import/Export",
    to: "/admin/import-export",
    icon: <FolderDown className="w-4 h-4" />,
  },
  {
    label: "Announcements",
    to: "/admin/announcements",
    icon: <Megaphone className="w-4 h-4" />,
  },
  {
    label: "Achievements",
    to: "/admin/achievements",
    icon: <Trophy className="w-4 h-4" />,
  },
  {
    label: "Testimonials",
    to: "/admin/testimonials",
    icon: <Megaphone className="w-4 h-4" />,
  },
  {
    label: "Profile",
    to: "/admin/profile",
    icon: <UserCircle className="w-4 h-4" />,
  },
];

const studentNav: NavItem[] = [
  {
    label: "Overview",
    to: "/student",
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    label: "My Workouts",
    to: "/student/workouts",
    icon: <Dumbbell className="w-4 h-4" />,
  },
  {
    label: "Body Metrics",
    to: "/student/metrics",
    icon: <TrendingUp className="w-4 h-4" />,
  },
  { label: "Diet", to: "/student/diet", icon: <Apple className="w-4 h-4" /> },
  {
    label: "Attendance",
    to: "/student/attendance",
    icon: <ClipboardList className="w-4 h-4" />,
  },
  {
    label: "BMI Calculator",
    to: "/student/bmi",
    icon: <Scale className="w-4 h-4" />,
  },
  {
    label: "Announcements",
    to: "/student/announcements",
    icon: <Megaphone className="w-4 h-4" />,
  },
  {
    label: "My Profile",
    to: "/student/profile",
    icon: <UserCircle className="w-4 h-4" />,
  },
];

const DashboardLayout = ({ role }: { role: "admin" | "student" }) => {
  const { user, logout } = useAuth();
  const navItems = role === "admin" ? adminNav : studentNav;
  const portalLabel = role === "admin" ? "Admin Panel" : "Student Portal";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change (mobile)
  const handleNavClick = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-background text-white flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-64 bg-gray-900 border-r border-gray-800 flex flex-col fixed h-full z-40
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Brand */}
        <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Dynamic<span className="text-primary">Gym</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">{portalLabel}</p>
          </div>
          {/* Close button (mobile only) */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white p-1"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin" || item.to === "/student"}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User Info + Logout */}
        <div className="px-4 py-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-primary/30"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold shrink-0 text-background">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full px-4 py-2 text-sm bg-red-600/20 text-red-400 hover:bg-red-600/30 rounded-lg transition text-center flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-w-0">
        {/* Mobile Top Bar */}
        <div className="lg:hidden sticky top-0 z-20 bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white p-1"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            Dynamic<span className="text-primary">Gym</span>
          </h1>
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover border border-primary/30"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-background">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
      
      {/* AI Chat Widget (Students Only) */}
      {role === "student" && <AIChatWidget />}
    </div>
  );
};

export default DashboardLayout;
