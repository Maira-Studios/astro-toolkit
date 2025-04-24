// src/pages/Settings.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const Settings = () => {
    const { t } = useTranslation();

    return (
        <div className="p-6 flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold mb-4">{t('Settings')}</h1>
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded max-w-lg">
                <p className="text-lg font-medium">{t('Coming Soon')}</p>
                <p className="mt-2">{t('This feature is currently under development and will be available in a future update.')}</p>
            </div>
        </div>
    );
};

export default Settings;