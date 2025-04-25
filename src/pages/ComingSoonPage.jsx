// src/pages/ComingSoonPage.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const ComingSoonPage = ({ path, title, message }) => {
    const { t } = useTranslation();

    return (
        <div className="flex items-center justify-center h-full p-6">
            <div className="bg-white rounded-lg shadow p-6 max-w-md text-center">
                <div className="text-amber-500 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-semibold mb-4">{title || t('Coming Soon')}</h2>
                <p className="text-gray-600 mb-4">{message || t('This section is under development.')}</p>
                {path && (
                    <p className="mt-2 text-sm text-gray-500">
                        {t('Path')}: {path}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ComingSoonPage;