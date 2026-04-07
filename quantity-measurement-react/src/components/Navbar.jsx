import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { logout, isAuthenticated, user, loading } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/converter", label: "Converter" },
    { path: "/about", label: "About" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="text-xl font-bold text-blue-600">
              📏 UnitMaster
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`${
                    isActive(link.path) ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
                  } font-medium transition`}
                >
                  {link.label}
                </Link>
              ))}
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-gray-600">Loading...</span>
                </div>
              ) : isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition">Dashboard</Link>
                  <Link to="/history" className="text-gray-600 hover:text-blue-600 transition">History</Link>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Welcome, {user?.name || 'User'}</span>
                    <button onClick={logout} className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition">
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link to="/login" className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition">
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t">
              {navLinks.map((link) => (
                <Link key={link.path} to={link.path} onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-600 hover:text-blue-600">
                  {link.label}
                </Link>
              ))}
              {loading ? (
                <div className="flex items-center gap-2 py-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-gray-600">Loading...</span>
                </div>
              ) : isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-600 hover:text-blue-600">Dashboard</Link>
                  <Link to="/history" onClick={() => setIsMenuOpen(false)} className="block py-2 text-gray-600 hover:text-blue-600">History</Link>
                  <div className="py-2 text-sm text-gray-600">Welcome, {user?.name || 'User'}</div>
                  <button onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full bg-red-500 text-white px-4 py-2 rounded-lg">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block bg-blue-600 text-white px-4 py-2 rounded-lg text-center">
                  Login
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;