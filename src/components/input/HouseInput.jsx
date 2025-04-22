// src/components/input/HouseInput.js
import React, { useState, useEffect } from 'react';

const HouseInput = ({ house, onChange }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [inputValue, setInputValue] = useState(house.position);

    // Update local state when prop changes
    useEffect(() => {
        setInputValue(house.position);
    }, [house.position]);

    // Handle input change with validation
    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        // Update parent immediately for real-time calculation
        // Only basic validation to allow typing
        if (value === '' || /^\d{1,3}(-\d{0,2})?$/.test(value)) {
            // Format value for parent if it's complete
            if (/^\d{1,3}-\d{2}$/.test(value)) {
                const [degrees, minutes] = value.split('-');
                const formatted = `${degrees.padStart(3, '0')}-${minutes.padStart(2, '0')}`;
                onChange(house.number, formatted);
            } else {
                // Send raw value for intermediate states
                onChange(house.number, value);
            }
        }
    };

    // Handle blur event to format the value if needed
    const handleBlur = () => {
        // Apply formatting if possible
        let formatted = inputValue;

        // Check if it's just a number (degrees only)
        if (/^\d{1,3}$/.test(inputValue)) {
            formatted = `${inputValue.padStart(3, '0')}-00`;
            setInputValue(formatted);
            onChange(house.number, formatted);
        }
        // Check if it has the right format but needs padding
        else if (/^\d{1,3}-\d{1,2}$/.test(inputValue)) {
            const [degrees, minutes] = inputValue.split('-');
            formatted = `${degrees.padStart(3, '0')}-${minutes.padStart(2, '0')}`;
            setInputValue(formatted);
            onChange(house.number, formatted);
        }
        // Incomplete input - revert to last valid value
        else if (!/^\d{3}-\d{2}$/.test(inputValue)) {
            setInputValue(house.position);
        }
    };

    return (
        <div className="flex items-center mb-3">
            <label className="w-32 text-sm font-medium">House {house.number}:</label>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className="border border-gray-300 rounded px-3 py-1 w-32"
                placeholder="DDD-MM"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            />
            {showTooltip && (
                <div className="absolute left-0 top-8 bg-black text-white text-xs rounded p-2 w-48 z-10">
                    Enter position for House {house.number} in DDD-MM format (e.g., 115-51 means 115°51')
                </div>
            )}
        </div>
    );
};

export default HouseInput;