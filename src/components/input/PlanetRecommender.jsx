// ✅ NEW FILE: src/components/input/PlanetRecommender.jsx
import React, { useState } from 'react';
import AstroUtils from '../../utils/AstroUtils';

const PlanetRecommender = ({ planets, houses, onRecommendationApplied }) => {
    const [selectedPlanetId, setSelectedPlanetId] = useState('');
    const [targetType, setTargetType] = useState('cusp');
    const [targetId, setTargetId] = useState('');
    const [desiredHitType, setDesiredHitType] = useState('positive');
    const [suggestedPosition, setSuggestedPosition] = useState(null);

    const recommendPosition = () => {
        const targetPosition =
            targetType === 'cusp'
                ? houses.find(h => h.number.toString() === targetId)?.position
                : planets.find(p => p.id === targetId)?.position;

        if (!targetPosition) return;

        const targetDegrees = AstroUtils.parsePosition(targetPosition);
        const offset = desiredHitType === 'positive' ? 60 : 150; // placeholder logic
        const newDegrees = (targetDegrees + offset) % 360;
        const formatted = AstroUtils.formatPosition(newDegrees);
        setSuggestedPosition(formatted);
    };

    const applyRecommendation = () => {
        if (!selectedPlanetId || !suggestedPosition) return;
        onRecommendationApplied(selectedPlanetId, suggestedPosition);
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm">I would like to move</label>
                <select
                    value={selectedPlanetId}
                    onChange={e => setSelectedPlanetId(e.target.value)}
                    className="w-full border rounded p-2"
                >
                    <option value="">-- Select Planet --</option>
                    {planets.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm">so that it makes a</label>
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
                <label className="block text-sm">hit with</label>
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

                <div className="text-sm space-x-2">
                    <label>
                        <input
                            type="radio"
                            checked={targetType === 'cusp'}
                            onChange={() => setTargetType('cusp')}
                        />{' '}
                        Cusp
                    </label>
                    <label>
                        <input
                            type="radio"
                            checked={targetType === 'planet'}
                            onChange={() => setTargetType('planet')}
                        />{' '}
                        Planet
                    </label>
                </div>
            </div>

            <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={recommendPosition}
                disabled={!selectedPlanetId || !targetId}
            >
                Suggest Position
            </button>

            {suggestedPosition && (
                <div className="p-4 bg-gray-100 rounded text-sm">
                    Suggested position for <strong>{selectedPlanetId}</strong> is{' '}
                    <strong>{suggestedPosition}</strong>
                    <div className="mt-2">
                        <button
                            onClick={applyRecommendation}
                            className="px-3 py-1 bg-green-600 text-white rounded"
                        >
                            Try It Out
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlanetRecommender;
