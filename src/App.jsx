// src/App.jsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Sidebar from './components/layout/Sidebar.jsx';
import MainNavigation from './components/layout/MainNavigation.jsx';
import './i18n.js';
import { useChartContext } from './context/ChartContext.jsx';

// Import page components
import ChartSidebar from './components/layout/ChartSidebar.jsx';
import VastuCalculator from './pages/VastuCalculator';
import ParashariTables from './pages/tables/ParashariTables.jsx'; // You would need to create this component
import ComingSoonPage from './pages/ComingSoonPage.jsx'; // Create a reusable "Coming Soon" component
import KpTables from './pages/tables/KPTables.jsx';
import HitCalculator from './pages/astro-vastu/HitCalculator.jsx';

// Define navigation items with the reorganized structure
const navigationItems = [
  {
    id: 'new-chart',
    label: 'Charts Database',
    path: '/new-chart'
  },
  {
    id: 'tables',
    label: 'Tables',
    path: '/tables',
    submenu: [
      { id: 'parashari', label: 'Parashari', path: '/tables/parashari' },
      { id: 'kp', label: 'KP', path: '/tables/kp' },
    ]
  },
  {
    id: 'astro-vastu',
    label: 'Astro Vastu',
    path: '/astro-vastu',
    submenu: [
      { id: 'hit-calculator', label: 'Hit Calculator', path: '/astro-vastu/hit-calculator' },
    ]
  },
  {
    id: 'bnn',
    label: 'BNN',
    path: '/bnn',
    submenu: [
      { id: 'directions', label: 'Directions', path: '/bnn/directions' },
      { id: 'strings', label: 'Strings', path: '/bnn/strings' },
    ]
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
    id: 'settings',
    label: 'Settings',
    path: '/settings'
  }
];

const App = () => {
  const { t } = useTranslation();
  const [activePath, setActivePath] = useState('/new-chart');
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [rightSidebarContent, setRightSidebarContent] = useState(null);

  // Use chart context
  const { currentChart } = useChartContext();

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

  // Map paths to their corresponding components
  const pageComponentMap = {
    // New Chart
    '/new-chart': {
      title: 'New Chart',
      component: (
        <ChartSidebar
        //onChartCreated={() => setActivePath('/tables/parasharib')}
        />
      )
    },
    /* 
        // Astro Vastu - Hit Calculator
        '/astro-vastu/hit-calculator': {
          title: 'Hit Calculator',
          component: (
            <VastuCalculator
              openSidebar={openRightSidebar}
              hideButtons={true}
              navigateToNewChart={() => setActivePath('/new-chart')}
            />
          )
        }, */

    '/astro-vastu/hit-calculator': {
      title: 'Hit Calculator',
      component: <HitCalculator openChartSidebar={() =>
        openRightSidebar({
          title: "New Chart",
          content: <ChartSidebar inSidebar={true} onChartCreated={closeRightSidebar} />
        }

        )
      } />
    },

    // Tables - Parashari
    '/tables/parashari': {
      title: 'Parashari Tables',
      component: (
        <ParashariTables
          openChartSidebar={() =>
            openRightSidebar({
              title: "New Chart",
              content: <ChartSidebar inSidebar={true} onChartCreated={closeRightSidebar} />
            }

            )
          }
        />
      )
    },

    '/tables/kp': {
      title: 'KP Tables',
      component: <KpTables openChartSidebar={() =>
        openRightSidebar({
          title: "New Chart",
          content: <ChartSidebar inSidebar={true} onChartCreated={closeRightSidebar} />
        }

        )
      } />
    },

    // Add more path mappings as components are developed
  };

  // Determine what content to show based on active path
  const renderMainContent = () => {
    // If we have a mapping for this path, render the component
    if (pageComponentMap[activePath]) {
      const { title, component } = pageComponentMap[activePath];

      // For most components, wrap them with a title
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">{t(title)}</h1>
          {component}
        </div>
      );
    }

    // For any unmapped path, show the coming soon page
    return (
      <ComingSoonPage
        path={activePath}
      />
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