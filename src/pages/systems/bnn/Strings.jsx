// src/pages/systems/bnn/Strings.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const BNNStrings = () => {
    const { t } = useTranslation();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">{t('BNN Strings')}</h1>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
                    <p className="font-medium">{t('Coming Soon')}</p>
                    <p className="mt-2">{t('BNN Strings functionality will be available in a future update.')}</p>
                </div>

                {/* Placeholder for future content */}
                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-4">{t('About BNN Strings')}</h2>
                    <p className="text-gray-700">
                        This module will provide BNN String analysis based on your natal chart.
                        String analysis in BNN system will help identify connections between different
                        planetary positions and house cusps.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BNNStrings;