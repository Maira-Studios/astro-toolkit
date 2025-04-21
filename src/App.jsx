// App.jsx
import React from 'react';
import VastuCalculator from './pages/VastuCalculator.jsx';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <VastuCalculator />
      </div>
    </div>
  );
}

export default App;