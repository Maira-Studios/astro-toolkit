

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
        // If it’s already numeric, just use it
        if (typeof position === 'number') {
            return position;
        }
        // Otherwise try to coerce to a float (in case you ever pass a string like "123.45")
        const num = parseFloat(position);
        return isNaN(num) ? 0 : num;
    },

    // Format decimal degrees to "DDD-MM" format
    formatPosition: (decimalDegrees) => {
        const normalizedDegrees = ((decimalDegrees % 360) + 360) % 360;
        const degrees = Math.floor(normalizedDegrees);
        const minutes = Math.round((normalizedDegrees - degrees) * 60);

        const degreesStr = degrees.toString().padStart(3, '0');
        const minutesStr = minutes.toString().padStart(2, '0');

        return `${degreesStr}-${minutesStr}`;
    },

    // Check if two positions are effectively the same (within 1°)
    isInSamePosition: (position1, position2) => {
        const pos1 = AstroUtils.parsePosition(position1);
        const pos2 = AstroUtils.parsePosition(position2);
        return Math.abs(pos1 - pos2) <= 1;
    },

    // Check if a planet is sitting in a house (within 5°)
    isInHouse: (planetPosition, housePosition) => {
        const planetDeg = AstroUtils.parsePosition(planetPosition);
        const houseDeg = AstroUtils.parsePosition(housePosition);
        return Math.abs(planetDeg - houseDeg) <= 5;
    },

    // Calculate the angle difference between two positions
    calculateAngleDifference: (position1, position2) => {
        let diff = Math.abs(
            AstroUtils.parsePosition(position1) -
            AstroUtils.parsePosition(position2)
        );
        if (diff > 180) diff = 360 - diff;
        return diff;
    },

    // Check if the houses are beyond the 8th from the planet
    isBeyondEighthHouse: (planetPosition, housePosition) => {
        let diff = Math.abs(
            AstroUtils.parsePosition(housePosition) -
            AstroUtils.parsePosition(planetPosition)
        );
        if (diff > 180) diff = 360 - diff;
        return diff > 120;
    },

    // Determine the type of hit (positive/negative/none/beyond180)
    determineHitType: (angleDiff) => {
        if (angleDiff > 180) {
            return { type: "beyond180", aspect: 0, orb: 0 };
        }
        for (const aspect of AstroUtils.aspects.positive) {
            if (Math.abs(angleDiff - aspect.degree) <= aspect.orb) {
                return {
                    type: "positive",
                    aspect: aspect.degree,
                    orb: parseFloat(Math.abs(angleDiff - aspect.degree).toFixed(2))
                };
            }
        }
        for (const aspect of AstroUtils.aspects.negative) {
            if (Math.abs(angleDiff - aspect.degree) <= aspect.orb) {
                return {
                    type: "negative",
                    aspect: aspect.degree,
                    orb: parseFloat(Math.abs(angleDiff - aspect.degree).toFixed(2))
                };
            }
        }
        return { type: "none", aspect: 0, orb: 0 };
    },

    // Check if a hit is vipreet (vakrirya) on 6th, 8th or 12th
    isVipreetHit: (hitType, houseNumber) => {
        return hitType === "negative" && [6, 8, 12].includes(houseNumber);
    },



    // Format degree for display (for tooltips, etc.)
    formatDegree: (position) => {
        if (!position || typeof position !== 'string') return "";
        const parts = position.split('-');
        if (parts.length !== 2) return position;
        return `${parseInt(parts[0], 10)}°${parts[1]}'`;
    }
};

export default AstroUtils;
