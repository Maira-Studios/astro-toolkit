// src/components/input/PlanetRecommender.jsx
import React, { useState } from 'react';
import AstroUtils from '../../utils/AstroUtils.js';

const PlanetRecommender = ({ planets, houses, onRecommendationApplied }) => {
    const [selectedPlanetId, setSelectedPlanetId] = useState('');
    const [targetType, setTargetType] = useState('cusp');
    const [targetId, setTargetId] = useState('');
    const [desiredHitType, setDesiredHitType] = useState('positive');
    const [suggestedPosition, setSuggestedPosition] = useState(null);

    // Reset selected target when target type changes
    const handleTargetTypeChange = (newType) => {
        setTargetType(newType);
        setTargetId(''); // Reset selection
    };

    const recommendPosition = () => {
        const targetPosition =
            targetType === 'cusp'
                ? houses.find(h => h.number.toString() === targetId)?.position
                : planets.find(p => p.id === targetId)?.position;

        if (!targetPosition) return;

        // Get target degrees
        const targetDegrees = AstroUtils.parsePosition(targetPosition);

        // Choose an aspect angle based on desired hit type
        // For positive hits, we'll use either 60° (sextile) or 120° (trine)
        // For negative hits, we'll use either 90° (square) or 150° (quincunx)
        let aspectOptions = [];

        if (desiredHitType === 'positive') {
            aspectOptions = [
                { name: '60° (Sextile)', angle: 60 },
                { name: '120° (Trine)', angle: 120 }
            ];
        } else {
            aspectOptions = [
                { name: '90° (Square)', angle: 90 },
                { name: '150° (Quincunx)', angle: 150 }
            ];
        }

        // Calculate a position for each aspect option
        const recommendations = aspectOptions.map(option => {
            const newDegrees = (targetDegrees + option.angle) % 360;
            return {
                name: option.name,
                position: AstroUtils.formatPosition(newDegrees)
            };
        });

        // Choose the first recommendation for now
        // In a more advanced version, we could analyze which one creates fewer negative hits
        setSuggestedPosition(recommendations[0].position);
    };

    const applyRecommendation = () => {
        if (!selectedPlanetId || !suggestedPosition) return;
        onRecommendationApplied(selectedPlanetId, suggestedPosition);
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">I would like to move</label>
                <select
                    value={selectedPlanetId}
                    onChange={e => setSelectedPlanetId(e.target.value)}
                    className="w-full border rounded p-2"
                >
                    <option value="">-- Select Planet --</option>
                    {planets.filter(p => p.canHit).map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">so that it makes a</label>
                <select
                    value={desiredHitType}
                    onChange={e => setDesiredHitType(e.target.value)}
                    className="w-full border rounded p-2"
                >
                    <option value="positive">Positive</option>
                    <option value="negative">Negative</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">hit with</label>
                <div className="flex space-x-4 mb-2">
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            className="form-radio"
                            checked={targetType === 'cusp'}
                            onChange={() => handleTargetTypeChange('cusp')}
                        />
                        <span className="ml-2">Cusp</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            className="form-radio"
                            checked={targetType === 'planet'}
                            onChange={() => handleTargetTypeChange('planet')}
                        />
                        <span className="ml-2">Planet</span>
                    </label>
                </div>

                <select
                    value={targetId}
                    onChange={e => setTargetId(e.target.value)}
                    className="w-full border rounded p-2 mb-1"
                >
                    <option value="">-- Select Target --</option>
                    {(targetType === 'cusp' ? houses : planets).map(t => (
                        <option
                            key={targetType === 'cusp' ? t.number : t.id}
                            value={targetType === 'cusp' ? t.number : t.id}
                        >
                            {targetType === 'cusp' ? `Cusp ${t.number}` : t.name}
                        </option>
                    ))}
                </select>
            </div>

            <button
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={recommendPosition}
                disabled={!selectedPlanetId || !targetId}
            >
                Suggest Position
            </button>

            {suggestedPosition && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Recommendation</h3>
                            <p className="text-sm text-gray-600">Based on selected parameters</p>
                        </div>
                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {desiredHitType === 'positive' ? 'Positive Hit' : 'Negative Hit'}
                        </div>
                    </div>

                    <div className="mt-4 border-t border-gray-200 pt-4">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <p className="text-sm text-gray-500">Planet to move</p>
                                <p className="font-medium">{planets.find(p => p.id === selectedPlanetId)?.name}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Target</p>
                                <p className="font-medium">{targetType === 'cusp' ? `Cusp ${targetId}` : planets.find(p => p.id === targetId)?.name}</p>
                            </div>
                        </div>

                        <div className="bg-gray-100 px-4 py-3 rounded-md mb-4">
                            <p className="text-sm text-gray-500">Suggested position</p>
                            <p className="text-lg font-bold text-blue-600">{suggestedPosition}</p>
                            <p className="text-xs text-gray-500 mt-1">({AstroUtils.formatDegree(suggestedPosition)})</p>
                        </div>

                        <button
                            onClick={applyRecommendation}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                            </svg>
                            Try It Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlanetRecommender;