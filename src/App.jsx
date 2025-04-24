// src/App.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from './components/layout/Sidebar.jsx';
import MainNavigation from './components/layout/MainNavigation.jsx';
import './i189.js'; // Import the i18n configuration

// Import your existing page components
import VastuCalculator from './pages/VastuCalculator';
import ChartSidebar from './components/layout/ChartSidebar.jsx';

// Define navigation items with the new structure
const navigationItems = [
  {
    id: 'new-chart',
    label: 'New Chart',
    path: '/new-chart'
  },
  {
    id: 'horoscope',
    label: 'Horoscope',
    path: '/horoscope',
    submenu: [
      { id: 'parashari', label: 'Parashari', path: '/horoscope/parashari' },
      { id: 'kp', label: 'KP', path: '/horoscope/kp' },
    ]
  },
  {
    id: 'tables',
    label: 'Tables',
    path: '/tables',
    submenu: [
      { id: 'parashari-tables', label: 'Parashari', path: '/tables/parashari' },
      { id: 'kp-tables', label: 'KP', path: '/tables/kp' },
    ]
  },
  {
    id: 'systems',
    label: 'Systems',
    path: '/systems',
    submenu: [
      {
        id: 'astro-vastu',
        label: 'Astro Vastu',
        path: '/systems/astro-vastu',
        submenu: [
          { id: 'hit-calculator', label: 'Hit Calculator', path: '/systems/astro-vastu/hit-calculator' },
        ]
      },
      {
        id: 'bnn',
        label: 'BNN',
        path: '/systems/bnn',
        submenu: [
          { id: 'directions', label: 'Directions', path: '/systems/bnn/directions' },
          { id: 'strings', label: 'Strings', path: '/systems/bnn/strings' },
        ]
      }
    ]
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/settings'
  }
];

const App = () => {
  const { t } = useTranslation();
  const [activePath, setActivePath] = useState('/systems/astro-vastu/hit-calculator'); // Default to Hit Calculator
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [rightSidebarContent, setRightSidebarContent] = useState(null);

  // Current chart state
  const [currentChart, setCurrentChart] = useState({
    name: "John Doe",
    date: "2025-04-15",
    time: "14:30",
    location: "New York, USA"
  });

  const handleNavigation = (path) => {
    setActivePath(path);

    // If navigating to New Chart, close any open sidebar
    if (path === '/new-chart') {
      setRightSidebarOpen(false);
    }
  };

  const toggleLeftSidebar = () => {
    setLeftSidebarOpen(!leftSidebarOpen);
  };

  const openRightSidebar = (content) => {
    setRightSidebarContent(content);
    setRightSidebarOpen(true);
  };

  const closeRightSidebar = () => {
    setRightSidebarOpen(false);
  };

  const openNewChartSidebar = () => {
    openRightSidebar({
      title: t('New Chart'),
      content: <ChartSidebar inSidebar={true} />
    });
  };

  // For Parashari Tables
  const renderParashariTables = () => {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">{t('Parashari Tables')}</h1>
        <div className="bg-white rounded-lg shadow p-6">
          {/* This would render your existing Vedic table logic */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('Planet')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('Sign')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('Degrees')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('House')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {/* This would be populated from your calculations */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Determine what content to show based on active path
  const renderMainContent = () => {
    // For New Chart, use the existing ChartSidebar directly in the main content area
    if (activePath === '/new-chart') {
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">{t('New Chart')}</h1>
          <ChartSidebar />
        </div>
      );
    }
    // For Hit Calculator, show the existing VastuCalculator component
    else if (activePath === '/systems/astro-vastu/hit-calculator') {
      return (
        <div>
          {/* Current Chart Banner */}
          <div className="bg-white border-b p-4 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">{currentChart.name}</h2>
              <p className="text-sm text-gray-600">
                {currentChart.date} {currentChart.time} | {currentChart.location}
              </p>
            </div>
            <div className="flex space-x-2">
              <select className="border rounded px-3 py-1">
                <option value="">{t('Select Chart')}</option>
                <option value="1">John Doe</option>
                <option value="2">Jane Smith</option>
              </select>
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={openNewChartSidebar}
              >
                {t('New Chart')}
              </button>
            </div>
          </div>

          {/* Modified VastuCalculator with buttons removed */}
          <VastuCalculator
            openSidebar={openRightSidebar}
            hideButtons={true}
          />
        </div>
      );
    }
    // For Parashari Tables
    else if (activePath === '/tables/parashari') {
      return renderParashariTables();
    }

    // For other paths, show a placeholder
    return (
      <div className="flex items-center justify-center h-full p-6">
        <div className="bg-white rounded-lg shadow p-6 max-w-md">
          <h2 className="text-xl font-semibold mb-4">{t('Coming Soon')}</h2>
          <p>{t('This section is under development.')}</p>
          <p className="mt-2">
            {t('Path')}: {activePath}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Fixed left navigation */}
      <MainNavigation
        items={navigationItems}
        activePath={activePath}
        onNavigate={handleNavigation}
        collapsed={leftSidebarOpen}
        toggleCollapse={toggleLeftSidebar}
      />

      {/* Main content area */}
      <main className="flex-1 overflow-auto">
        {renderMainContent()}
      </main>

      {/* Right sidebar for input forms and adjusters */}
      {rightSidebarOpen && (
        <Sidebar
          position="right"
          onClose={closeRightSidebar}
          title={rightSidebarContent?.title || "Options"}
        >
          {rightSidebarContent?.content}
        </Sidebar>
      )}
    </div>
  );
};

export default App;