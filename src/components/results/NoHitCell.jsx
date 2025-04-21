// src/components/results/NoHitCell.jsx
import React from 'react';

const NoHitCell = ({ changeStatus }) => {
    // Set the background color based on the change status
    let bgColor = 'bg-white';
    if (changeStatus === 'improved') {
        bgColor = 'bg-green-100';
    } else if (changeStatus === 'worsened') {
        bgColor = 'bg-red-100';
    }

    return (
        <td className={`px-4 py-2 border text-center ${bgColor}`}>
            <span className="text-gray-500">NA</span>
        </td>
    );
};

export default NoHitCell;