// src/components/layout/MainNavigation.jsx
import React, { useState } from 'react';
import {
    PlusCircle,
    Calendar,
    Table2,
    Settings,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Star,
    AlertCircle,
    User,
    Compass
} from 'lucide-react';

const MainNavigation = ({ items, activePath, onNavigate, collapsed, toggleCollapse }) => {
    const [expandedMenus, setExpandedMenus] = useState({
        'astro-vastu': true, // Start with Astro Vastu expanded
        'tables': true
    });

    const toggleSubmenu = (itemId) => {
        setExpandedMenus(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    // Helper function to determine if a path is a "coming soon" section
    const isComingSoon = (path) => {
        // Only these items are "coming soon"
        const comingSoonPaths = [
            '/bnn',
            '/horoscope',
            '/settings',
            '/bnn/directions',
            '/bnn/strings',
            '/horoscope/parashari',
            '/horoscope/kp'
        ];

        return comingSoonPaths.some(comingSoonPath =>
            path === comingSoonPath || path.startsWith(comingSoonPath + '/')
        );
    };

    // Function to get the appropriate icon for a menu item
    const getItemIcon = (item) => {
        // Define icons based on item ID
        switch (item.id) {
            case 'new-chart':
                return <PlusCircle size={20} />;
            case 'horoscope':
                return <Calendar size={20} />;
            case 'tables':
                return <Table2 size={20} />;
            case 'parashari':
                return <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center">
                    <span className="text-xs">P</span>
                </div>;
            case 'kp':
                return <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center">
                    <span className="text-xs">K</span>
                </div>;
            case 'astro-vastu':
                return <Star size={20} />;
            case 'hit-calculator':
                return <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center">
                    <span className="text-xs">H</span>
                </div>;
            case 'bnn':
                return <Compass size={20} />;
            case 'settings':
                return <Settings size={20} />;
            default:
                return (
                    <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center">
                        <span className="text-xs">{item.label.charAt(0)}</span>
                    </div>
                );
        }
    };

    // Recursive function to render menu items with any level of nesting
    const renderMenuItem = (item, level = 0) => {
        const isActive = activePath === item.path || activePath.startsWith(item.path + '/');
        const hasSubmenu = item.submenu && item.submenu.length > 0;
        const isExpanded = expandedMenus[item.id];
        const comingSoonItem = isComingSoon(item.path);

        return (
            <li key={item.id} className="mb-1">
                {/* Main menu item */}
                <div
                    className={`flex items-center ${isActive
                        ? 'bg-gray-700'
                        : 'hover:bg-gray-700'
                        } px-4 py-2 cursor-pointer rounded-md`}
                    style={{ paddingLeft: `${level * 8 + 16}px` }}
                    onClick={() => {
                        if (hasSubmenu) {
                            toggleSubmenu(item.id);
                        } else {
                            onNavigate(item.path);
                        }
                    }}
                >
                    {/* Icon */}
                    <div className="text-gray-300">
                        {getItemIcon(item)}
                    </div>

                    {/* Coming soon indicator */}
                    {comingSoonItem && (
                        <div className="text-amber-500 ml-2">
                            <AlertCircle size={16} />
                        </div>
                    )}

                    {!collapsed && (
                        <>
                            <span className={`ml-3 ${comingSoonItem ? 'text-gray-400' : 'text-gray-200'}`}>
                                {item.label}
                            </span>

                            {/* Dropdown indicator if item has submenu */}
                            {hasSubmenu && (
                                <ChevronDown
                                    className={`w-4 h-4 ml-auto transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
                                />
                            )}
                        </>
                    )}
                </div>

                {/* Recursively render submenu items */}
                {!collapsed && hasSubmenu && isExpanded && (
                    <ul className="mt-1">
                        {item.submenu.map(subItem => renderMenuItem(subItem, level + 1))}
                    </ul>
                )}
            </li>
        );
    };

    return (
        <nav className={`bg-gray-800 text-white ${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 flex flex-col`}>
            {/* App branding */}
            <div className="flex items-center h-16 px-4 border-b border-gray-700">
                {!collapsed && <h1 className="text-xl font-bold">Astro Portal</h1>}
                <button
                    className={`ml-auto text-gray-400 hover:text-white ${collapsed ? 'mx-auto' : ''}`}
                    onClick={toggleCollapse}
                >
                    {collapsed ?
                        <ChevronRight className="w-6 h-6" /> :
                        <ChevronLeft className="w-6 h-6" />
                    }
                </button>
            </div>

            {/* Navigation items */}
            <div className="flex-1 overflow-y-auto py-4">
                <ul>
                    {items.map(item => renderMenuItem(item))}
                </ul>
            </div>

            {/* User profile at bottom */}
            {!collapsed && (
                <div className="border-t border-gray-700 p-4">
                    <div className="flex items-center">
                        <div className="text-blue-500">
                            <User size={24} />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium">User Name</p>
                            <p className="text-xs text-gray-400">View Profile</p>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default MainNavigation;