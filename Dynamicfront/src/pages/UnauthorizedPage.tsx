import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="text-center">
        <p className="text-6xl font-bold text-red-500 mb-4">403</p>
        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-gray-400 mb-8">
          You don't have permission to access this page.
        </p>
        <Link
          to="/login"
          className="inline-block px-6 py-3 bg-primary hover:bg-primary-dark text-background font-semibold rounded-lg transition"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
