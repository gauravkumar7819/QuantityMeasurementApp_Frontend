import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGoogleAuth } from '../context/GoogleAuthContext';

const Dashboard = () => {
  // Check both auth systems
  const googleAuth = useGoogleAuth();
  const oldAuth = useAuth();
  
  // Use Google auth if available, otherwise use old auth
  const auth = googleAuth.isAuthenticated ? googleAuth : oldAuth;
  const { user, logout } = auth;

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* User Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name || 'User'}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-blue-100 shadow-md"
              />
            ) : (
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-4xl sm:text-5xl text-white font-bold border-4 border-blue-100 shadow-md">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {user?.name || 'User'}
            </h1>
            <p className="text-gray-600 mb-4">{user?.email || 'No email provided'}</p>
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>

          {/* Account Status */}
          <div className="flex-shrink-0 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Authenticated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Welcome to Your Dashboard
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">Your measurement dashboard</p>
      </div>

      {/* Quick Actions - Responsive Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12">
        {[
          { icon: "🔄", title: "Convert", path: "/converter" },
          { icon: "📊", title: "History", path: "/history" },
          { icon: "👤", title: "Profile", path: "/profile" },
          { icon: "📚", title: "About", path: "/about" }
        ].map((action, i) => (
          <Link key={i} to={action.path} 
            className="bg-white p-4 sm:p-6 rounded-lg shadow-md text-center hover:shadow-lg transition border border-gray-100">
            <div className="text-2xl sm:text-4xl mb-2 sm:mb-3">{action.icon}</div>
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">{action.title}</h3>
          </Link>
        ))}
      </div>

      {/* Stats Section - Responsive */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 pb-4 border-b">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Your Activity</h2>
          <Link to="/history" className="text-blue-600 hover:underline text-sm">View History →</Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {[
            { label: "Total Conversions", value: "0", icon: "🔄" },
            { label: "Categories Used", value: "4", icon: "📊" },
            { label: "Saved Results", value: "0", icon: "💾" }
          ].map((stat, i) => (
            <div key={i} className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{stat.icon}</div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-xs sm:text-sm text-gray-600 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;