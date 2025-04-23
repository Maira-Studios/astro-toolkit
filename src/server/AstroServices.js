// src/server/AstroServices.js

import swe from 'swisseph';
import moment from 'moment-timezone';

/**
 * Compute a Parashari (Vedic) chart: planetary positions and house cusps
 */
export async function getVedicChart(bd) {
    try {
        // 1. Set ephemeris path
        swe.swe_set_ephe_path('/ephe/');

        // 2. Parse birth details as local time, convert to UTC correctly
        const { year, month, day, hour, minute, latitude, longitude, timezone } = bd;

        // Use the provided timezone or try to get it from coordinates
        const tz = timezone || getTimezoneFromCoordinates(latitude, longitude);
        console.log(`Using timezone: ${tz}`);

        // Create local date and convert to UTC properly
        const localDate = moment.tz([year, month - 1, day, hour, minute], tz);
        const utcDate = localDate.clone().utc();

        console.log(`Local time: ${localDate.format('YYYY-MM-DD HH:mm')}`);
        console.log(`UTC time: ${utcDate.format('YYYY-MM-DD HH:mm')}`);

        // 3. Calculate Julian Day Number (JDN) for UTC time
        const jd = swe.swe_julday(
            utcDate.year(),
            utcDate.month() + 1,
            utcDate.date(),
            utcDate.hour() + utcDate.minute() / 60.0,
            swe.SE_GREG_CAL
        );
        console.log(`Julian Day: ${jd}`);

        // 4. Calculate tropical ascendant and houses first
        swe.swe_set_sid_mode(swe.SE_SIDM_NONE, 0, 0); // Ensure tropical mode
        const houses = swe.swe_houses(jd, latitude, longitude, 'E'); // Equal house system

        // Get tropical ascendant
        const tropicalAsc = houses.ascendant;
        console.log(`Tropical Ascendant: ${tropicalAsc.toFixed(2)}°`);

        // 5. Get Lahiri ayanamsa value for this date
        const ayanamsa = swe.swe_get_ayanamsa_ut(jd);
        console.log(`Ayanamsa: ${ayanamsa.toFixed(2)}°`);

        // 6. Calculate sidereal ascendant
        const siderealAsc = (tropicalAsc - ayanamsa + 360) % 360;
        console.log(`Sidereal Ascendant: ${siderealAsc.toFixed(2)}°`);

        // Get ascendant sign and degree within sign
        const ascSignIndex = Math.floor(siderealAsc / 30);
        const ascSignDegree = siderealAsc % 30;
        console.log(`Ascendant Sign Index: ${ascSignIndex} (${['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'][ascSignIndex]})`);

        // 7. Calculate house cusps in sidereal zodiac
        const houseCusps = [];
        const cuspsArray = houses.house; // Array of 12 cusps

        for (let i = 0; i < 12; i++) {
            // Convert each cusp from tropical to sidereal
            const siderealCusp = (cuspsArray[i] - ayanamsa + 360) % 360;
            houseCusps.push({
                cusp: i + 1,
                degree: siderealCusp
            });
        }

        // 8. Set sidereal mode for planetary calculations
        swe.swe_set_sid_mode(swe.SE_SIDM_LAHIRI, 0, 0);

        // 9. Calculate sidereal planetary positions
        const planets = [
            { name: 'Sun', idx: swe.SE_SUN },
            { name: 'Moon', idx: swe.SE_MOON },
            { name: 'Mars', idx: swe.SE_MARS },
            { name: 'Mercury', idx: swe.SE_MERCURY },
            { name: 'Jupiter', idx: swe.SE_JUPITER },
            { name: 'Venus', idx: swe.SE_VENUS },
            { name: 'Saturn', idx: swe.SE_SATURN },
            { name: 'Rahu', idx: swe.SE_TRUE_NODE },
            { name: 'Ketu', idx: swe.SE_TRUE_NODE }
        ];

        const planetaryPositions = planets.map(p => {
            // Calculate planet position with sidereal mode
            const res = swe.swe_calc_ut(jd, p.idx, swe.SEFLG_SIDEREAL);
            let lon = res.longitude;

            // Special case for Ketu (South Node): opposite to Rahu
            if (p.name === 'Ketu') {
                lon = (lon + 180) % 360;
            }

            // Calculate zodiac sign for this position
            const signIndex = Math.floor(lon / 30) % 12;

            // Calculate house by counting from ascendant sign
            // This is the standard way to determine houses in Vedic astrology
            let house = ((signIndex - ascSignIndex + 12) % 12) + 1;

            console.log(`${p.name}: ${lon.toFixed(2)}° (Sign: ${signIndex + 1}, House: ${house})`);

            return {
                planet: p.name,
                degree: lon,
                house: house
            };
        });

        return {
            planetaryPositions,
            houseCusps,
            ascendant: {
                degree: siderealAsc,
                sign: ascSignIndex,
                signDegree: ascSignDegree
            }
        };
    } catch (err) {
        console.error("Error calculating Vedic chart:", err);
        throw err;
    }
}

/**
 * Helper function to guess timezone from coordinates
 */
function getTimezoneFromCoordinates(lat, lng) {
    // For India (rough approximation)
    if (lat >= 8 && lat <= 37 && lng >= 68 && lng <= 97) {
        return "Asia/Kolkata"; // Indian Standard Time
    }

    // Default to using moment's guess (less reliable)
    return moment.tz.guess();
}

/**
 * Compute KP system data: tropical zodiac with Placidus houses
 */
export function getKPCalculations(bd) {
    // 1. Set ephemeris path and tropical mode
    swe.swe_set_ephe_path('/ephe/');
    swe.swe_set_sid_mode(swe.SE_SIDM_NONE, 0, 0); // Ensure tropical mode

    // 2. Parse birth details as local time, convert to UTC correctly
    const { year, month, day, hour, minute, latitude, longitude, timezone } = bd;

    // Use the provided timezone or try to get it from coordinates
    const tz = timezone || getTimezoneFromCoordinates(latitude, longitude);

    // Create local date and convert to UTC properly
    const localDate = moment.tz([year, month - 1, day, hour, minute], tz);
    const utcDate = localDate.clone().utc();

    // 3. Calculate Julian Day
    const jd = swe.swe_julday(
        utcDate.year(),
        utcDate.month() + 1,
        utcDate.date(),
        utcDate.hour() + utcDate.minute() / 60.0,
        swe.SE_GREG_CAL
    );

    // 4. Calculate tropical planetary positions
    const planets = [
        { name: 'Sun', idx: swe.SE_SUN },
        { name: 'Moon', idx: swe.SE_MOON },
        { name: 'Mars', idx: swe.SE_MARS },
        { name: 'Mercury', idx: swe.SE_MERCURY },
        { name: 'Jupiter', idx: swe.SE_JUPITER },
        { name: 'Venus', idx: swe.SE_VENUS },
        { name: 'Saturn', idx: swe.SE_SATURN },
        { name: 'Rahu', idx: swe.SE_TRUE_NODE },
        { name: 'Ketu', idx: swe.SE_TRUE_NODE }
    ];

    const tropicalPositions = planets.map(p => {
        const res = swe.swe_calc_ut(jd, p.idx, swe.SEFLG_SPEED);
        let lon = res.longitude;
        if (p.name === 'Ketu') lon = (lon + 180) % 360;
        return { planet: p.name, degree: lon };
    });

    // 5. Calculate Placidus house cusps
    const houses = swe.swe_houses(jd, latitude, longitude, 'P');
    const cuspsArray = houses.house;
    const houseCuspsK = cuspsArray.map((deg, i) => ({ cusp: i + 1, degree: deg }));

    // 6. KP sub-lord tables
    const nak = 13 + 20 / 60;
    const subSz = nak / 9;
    const STAR_LORDS = [
        'Ke', 'Ve', 'Su', 'Mo', 'Ma', 'Ra', 'Ju', 'Sa', 'Me',
        'Ke', 'Ve', 'Su', 'Mo', 'Ma', 'Ra', 'Ju', 'Sa', 'Me',
        'Ke', 'Ve', 'Su', 'Mo', 'Ma', 'Ra', 'Ju', 'Sa', 'Me'
    ];
    const SUB_LORDS = STAR_LORDS.map((_, i) =>
        STAR_LORDS.slice(i).concat(STAR_LORDS.slice(0, i))
    );

    const kpPositions = tropicalPositions.map(p => {
        const comp = p.degree % 360;
        const starIndex = Math.floor(comp / nak);
        const intra = comp % nak;
        const subIndex = Math.floor(intra / subSz);
        return {
            planet: p.planet,
            compoundDegree: comp.toFixed(2),
            starLord: STAR_LORDS[starIndex],
            subLord: SUB_LORDS[starIndex][subIndex]
        };
    });

    return {
        kpPositions,
        houseCusps: houseCuspsK,
        ascendant: {
            degree: houses.ascendant,
            sign: Math.floor(houses.ascendant / 30) % 12
        }
    };
}