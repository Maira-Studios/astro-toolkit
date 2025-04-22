// src/components/common/LanguageSelector.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (event) => {
        i18n.changeLanguage(event.target.value);
    };

    return (
        <div className="relative inline-block text-left">
            <select
                className="bg-white border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={i18n.language}
                onChange={changeLanguage}
            >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
            </select>
        </div>
    );
};

export default LanguageSelector;