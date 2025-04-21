// src/App.jsx
import React, { useState } from 'react';
import VastuCalculator from './pages/VastuCalculator';
import Sidebar from './components/layout/Sidebar.jsx';
import MainNavigation from './components/layout/MainNavigation.jsx';

// Mock data for navigation items - replace with your actual routes
const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', path: '/' },
  {
    id: 'astro-vastu',
    label: 'Astro Vastu',
    path: '/astro-vastu',
    submenu: [
      { id: 'hit-calculator', label: 'Hit Calculator', path: '/astro-vastu/hit-calculator' },
      { id: 'planet-insights', label: 'Planet Insights', path: '/astro-vastu/planet-insights' },
      { id: 'house-analysis', label: 'House Analysis', path: '/astro-vastu/house-analysis' },
    ]
  },
  { id: 'charts', label: 'Charts', path: '/charts' },
  { id: 'reports', label: 'Reports', path: '/reports' },
  { id: 'settings', label: 'Settings', path: '/settings' }
];

const App = () => {
  const [activePath, setActivePath] = useState('/astro-vastu/hit-calculator');
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [rightSidebarContent, setRightSidebarContent] = useState(null);

  const handleNavigation = (path) => {
    setActivePath(path);
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

  // Determine what content to show based on active path
  const renderMainContent = () => {
    // For now we just show the VastuCalculator component
    // Later you can expand this with a proper router
    if (activePath.startsWith('/astro-vastu/hit-calculator')) {
      return (
        <VastuCalculator
          openSidebar={openRightSidebar}
          sidebarOpen={rightSidebarOpen}
        />
      );
    }
    return <div className="p-6">Select a module from the navigation</div>;
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