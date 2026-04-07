import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <main className="max-w-6xl mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-20">
        <div className="inline-block px-4 py-1.5 mb-6 text-xs font-bold uppercase bg-blue-100 text-blue-600 rounded-full">
          Professional Measurement Tool
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Master Your Measurements
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Convert, compare, and calculate units with precision across length, weight, temperature, and volume.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/signup" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Get Started
          </Link>
          <Link to="/converter" className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition">
            Try Converter
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-20">
        {[
          { icon: "🔄", title: "Real-time Conversion", desc: "Instant precision as you type with dozens of global units" },
          { icon: "📊", title: "Advanced Analytics", desc: "Compare quantities and perform complex arithmetic operations" },
          { icon: "💾", title: "History Tracking", desc: "Save and access your measurements from any device" }
        ].map((feature, i) => (
          <div key={i} className="bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center hover:shadow-lg transition">
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to simplify your measurements?</h2>
        <p className="mb-6 text-blue-100">Join thousands of users who trust our tool for accurate conversions</p>
        <Link to="/signup" className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:shadow-lg transition">
          Create Free Account →
        </Link>
      </div>
    </main>
  );
};

export default Home;