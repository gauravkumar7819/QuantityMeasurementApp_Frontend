import React from 'react';

const About = () => {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">About UnitMaster</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
        <p className="text-gray-600 leading-relaxed">
          UnitMaster makes unit conversions simple, accurate, and accessible for students, professionals, 
          and everyday users. Convert, compare, and calculate measurements across multiple categories with ease.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: "🔄", title: "Real-time Conversion", desc: "Instant results as you type" },
            { icon: "📊", title: "Compare & Calculate", desc: "Advanced arithmetic operations" },
            { icon: "💾", title: "History Tracking", desc: "Save and review conversions" }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Supported Units</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg"><span className="font-semibold">📏 Length:</span> m, km, mile, foot, inch</div>
          <div className="bg-gray-50 p-4 rounded-lg"><span className="font-semibold">⚖️ Weight:</span> kg, g, lb, oz, ton</div>
          <div className="bg-gray-50 p-4 rounded-lg"><span className="font-semibold">🌡️ Temp:</span> °C, °F, K</div>
          <div className="bg-gray-50 p-4 rounded-lg"><span className="font-semibold">🧪 Volume:</span> L, mL, gallon, cup</div>
        </div>
      </section>

      <section className="bg-blue-50 p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Ready to get started?</h2>
        <p className="text-gray-600 mb-4">Try our converter tool now - it's free and easy to use</p>
        <a href="/converter" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          Go to Converter →
        </a>
      </section>
    </main>
  );
};

export default About;