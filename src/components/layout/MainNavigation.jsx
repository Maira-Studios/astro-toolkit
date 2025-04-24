// src/components/layout/MainNavigation.jsx
import React, { useState } from 'react';

const MainNavigation = ({ items, activePath, onNavigate, collapsed, toggleCollapse }) => {
    const [expandedMenus, setExpandedMenus] = useState({
        'systems': true, // Start with Systems expanded
        'astro-vastu': true // Start with Astro Vastu expanded
    });

    const toggleSubmenu = (itemId) => {
        setExpandedMenus(prev => ({
            ...prev,
            [itemId]: !prev[itemId]
        }));
    };

    // Recursive function to render menu items with any level of nesting
    const renderMenuItem = (item, level = 0) => {
        const isActive = activePath === item.path || activePath.startsWith(item.path + '/');
        const hasSubmenu = item.submenu && item.submenu.length > 0;
        const isExpanded = expandedMenus[item.id];

        return (
            <li key={item.id} className="mb-1">
                {/* Main menu item */}
                <div
                    className={`flex items-center ${isActive
                        ? 'bg-gray-700'
                        : 'hover:bg-gray-700'
                        } px-4 py-2 cursor-pointer`}
                    style={{ paddingLeft: `${level * 8 + 16}px` }}
                    onClick={() => {
                        if (hasSubmenu) {
                            toggleSubmenu(item.id);
                        } else {
                            onNavigate(item.path);
                        }
                    }}
                >
                    {/* Icon placeholder - replace with actual icons */}
                    <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center">
                        <span className="text-xs">{item.label.charAt(0)}</span>
                    </div>

                    {!collapsed && (
                        <>
                            <span className="ml-3">{item.label}</span>
                            {/* Dropdown indicator if item has submenu */}
                            {hasSubmenu && (
                                <svg
                                    className={`w-4 h-4 ml-auto transition-transform ${isExpanded ? 'transform rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
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
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg> :
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                        </svg>
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
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                            <span className="text-sm">U</span>
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