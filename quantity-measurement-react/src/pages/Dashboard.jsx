import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Welcome Header */}
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Welcome back, <span className="text-blue-600">{user?.name || 'User'}</span>!
        </h1>
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