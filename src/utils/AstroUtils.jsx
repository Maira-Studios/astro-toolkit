// src/utils/AstroUtils.js

// Astrological calculation utilities
const AstroUtils = {
    // Aspect definitions with their orbs
    aspects: {
        positive: [
            { degree: 30, orb: 3 },
            { degree: 60, orb: 5 },
            { degree: 120, orb: 8 }
        ],
        negative: [
            { degree: 45, orb: 3 },
            { degree: 90, orb: 5 },
            { degree: 180, orb: 8 }
        ]
    },

    // Parse position from "DDD-MM" format to decimal degrees
    parsePosition: (position) => {
        if (!position || typeof position !== 'string') return 0;

        const parts = position.split('-');
        if (parts.length !== 2) return 0;

        const degrees = parseInt(parts[0], 10);
        const minutes = parseInt(parts[1], 10);

        return degrees + (minutes / 60);
    },

    // Format decimal degrees to "DDD-MM" format
    formatPosition: (decimalDegrees) => {
        // Ensure the value is between 0 and 360
        const normalizedDegrees = ((decimalDegrees % 360) + 360) % 360;

        const degrees = Math.floor(normalizedDegrees);
        const minutes = Math.round((normalizedDegrees - degrees) * 60);

        // Format with leading zeros
        const degreesStr = degrees.toString().padStart(3, '0');
        const minutesStr = minutes.toString().padStart(2, '0');

        return `${degreesStr}-${minutesStr}`;
    },

    // Check if two positions are effectively the same (within a very tight orb)
    isInSamePosition: (position1, position2) => {
        const pos1 = AstroUtils.parsePosition(position1);
        const pos2 = AstroUtils.parsePosition(position2);

        // Consider positions the same if within 1 degree
        return Math.abs(pos1 - pos2) <= 1;
    },

    // Check if a planet is sitting in a house (within a few degrees)
    isInHouse: (planetPosition, housePosition) => {
        const planetDeg = AstroUtils.parsePosition(planetPosition);
        const houseDeg = AstroUtils.parsePosition(housePosition);

        // Consider planet in house if it's within 5 degrees
        return Math.abs(planetDeg - houseDeg) <= 5;
    },

    // Calculate the angle difference between two positions
    calculateAngleDifference: (position1, position2) => {
        const pos1 = AstroUtils.parsePosition(position1);
        const pos2 = AstroUtils.parsePosition(position2);

        // Calculate the absolute difference
        let diff = Math.abs(pos1 - pos2);

        // If diff > 180, take complement to get the smaller angle
        if (diff > 180) {
            diff = 360 - diff;
        }

        // Return the normalized difference (between 0 and 180)
        return diff;
    },

    // Check if the houses are 9th, 10th, 11th or 12th from the planet
    isBeyondEighthHouse: (planetPosition, housePosition) => {
        const planetDeg = AstroUtils.parsePosition(planetPosition);
        const houseDeg = AstroUtils.parsePosition(housePosition);

        // Calculate the angle difference
        let diff = Math.abs(houseDeg - planetDeg);

        // If diff > 180, take complement to get the smaller angle
        if (diff > 180) diff = 360 - diff;

        // If diff is > 120 (i.e., more than 4 houses away), it's beyond 8th house
        // This is an approximation since houses aren't exactly 30 degrees each
        return diff > 120;
    },

    // Determine the type of hit
    determineHitType: (angleDiff) => {
        // No hit if difference is greater than 180
        if (angleDiff > 180) {
            return { type: "beyond180", aspect: 0, orb: 0 };
        }

        // Check for positive aspects
        for (const aspect of AstroUtils.aspects.positive) {
            if (Math.abs(angleDiff - aspect.degree) <= aspect.orb) {
                return {
                    type: "positive",
                    aspect: aspect.degree,
                    orb: parseFloat(Math.abs(angleDiff - aspect.degree).toFixed(2))
                };
            }
        }

        // Check for negative aspects
        for (const aspect of AstroUtils.aspects.negative) {
            if (Math.abs(angleDiff - aspect.degree) <= aspect.orb) {
                return {
                    type: "negative",
                    aspect: aspect.degree,
                    orb: parseFloat(Math.abs(angleDiff - aspect.degree).toFixed(2))
                };
            }
        }

        // No hit found
        return { type: "none", aspect: 0, orb: 0 };
    },

    // Check if a hit is vipreet
    isVipreetHit: (hitType, houseNumber) => {
        return hitType === "negative" && [6, 8, 12].includes(houseNumber);
    },

    // Format degree for display
    formatDegree: (position) => {
        if (!position || typeof position !== 'string') return "";

        const parts = position.split('-');
        if (parts.length !== 2) return position;

        return `${parseInt(parts[0], 10)}°${parts[1]}'`;
    }
};

export default AstroUtils;