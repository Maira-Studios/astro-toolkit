// src/pages/systems/bnn/Directions.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const BNNDirections = () => {
    const { t } = useTranslation();

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">{t('BNN Directions')}</h1>

            <div className="bg-white rounded-lg shadow p-6">
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
                    <p className="font-medium">{t('Coming Soon')}</p>
                    <p className="mt-2">{t('BNN Directions functionality will be available in a future update.')}</p>
                </div>

                {/* Placeholder for future content */}
                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-4">{t('About BNN Directions')}</h2>
                    <p className="text-gray-700">
                        This module will provide astrological directional analysis based on the BNN system.
                        The implementation will integrate with your existing chart calculations and provide detailed
                        directional insights.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BNNDirections;