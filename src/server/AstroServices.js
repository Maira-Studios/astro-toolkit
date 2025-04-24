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
 * Compute KP system data with sidereal zodiac display
 * This function calculates KP positions in tropical zodiac but displays them in sidereal
 */
export function getKPCalculations(bd) {
    // 1. Set ephemeris path
    swe.swe_set_ephe_path('/ephe/');

    // 2. Parse birth details
    const { year, month, day, hour, minute, latitude, longitude, timezone } = bd;
    const tz = timezone || getTimezoneFromCoordinates(latitude, longitude);
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

    // 4. Calculate Lahiri ayanamsa
    swe.swe_set_sid_mode(swe.SE_SIDM_LAHIRI, 0, 0);
    const ayanamsa = swe.swe_get_ayanamsa_ut(jd);
    console.log(`Lahiri ayanamsa: ${ayanamsa.toFixed(2)}°`);

    // 5. Set to tropical mode for calculations
    swe.swe_set_sid_mode(swe.SE_SIDM_NONE, 0, 0);

    // 6. Define planets
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

    // 7. Get planetary positions (tropical) and convert to sidereal
    const planetPositions = [];

    for (const planet of planets) {
        // Calculate tropical position
        const res = swe.swe_calc_ut(jd, planet.idx, swe.SEFLG_SPEED);
        let tropicalDegree = res.longitude;

        // Special case for Ketu
        if (planet.name === 'Ketu') {
            tropicalDegree = (tropicalDegree + 180) % 360;
        }

        // Convert to sidereal
        const siderealDegree = (tropicalDegree - ayanamsa + 360) % 360;

        planetPositions.push({
            planet: planet.name,
            tropicalDegree,
            siderealDegree
        });
    }

    // 8. Calculate house cusps (Placidus)
    const houses = swe.swe_houses(jd, latitude, longitude, 'P');
    const houseCusps = [];

    for (let i = 0; i < 12; i++) {
        const tropicalDegree = houses.house[i];
        const siderealDegree = (tropicalDegree - ayanamsa + 360) % 360;

        houseCusps.push({
            cusp: i + 1,
            tropicalDegree,
            siderealDegree
        });
    }

    // 9. KP calculations
    const nakshatra_span = 13 + (20 / 60); // 13°20'
    const sub_division = 9;
    const sub_span = nakshatra_span / sub_division;

    const STAR_LORDS = [
        "Ke", "Ve", "Su", "Mo", "Ma", "Ra", "Ju", "Sa", "Me",
        "Ke", "Ve", "Su", "Mo", "Ma", "Ra", "Ju", "Sa", "Me",
        "Ke", "Ve", "Su", "Mo", "Ma", "Ra", "Ju", "Sa", "Me"
    ];

    const SUB_LORD_ORDER = ["Ke", "Ve", "Su", "Mo", "Ma", "Ra", "Ju", "Sa", "Me"];

    const kpPositions = [];

    for (const p of planetPositions) {
        // Use TROPICAL degrees for KP calculations
        const tropicalDegree = p.tropicalDegree;

        // Calculate nakshatra
        const nakshatra_no = Math.floor(tropicalDegree / nakshatra_span);
        const star_lord = STAR_LORDS[nakshatra_no];

        // Calculate sub-division
        const position_in_nakshatra = tropicalDegree % nakshatra_span;
        const sub_no = Math.floor(position_in_nakshatra / sub_span);

        // Find sub-lord
        const start_idx = SUB_LORD_ORDER.indexOf(star_lord);
        const sub_lord = SUB_LORD_ORDER[(start_idx + sub_no) % 9];

        kpPositions.push({
            planet: p.planet,
            compoundDegree: p.siderealDegree, // SIDEREAL for display
            starLord: star_lord,
            subLord: sub_lord
        });
    }

    // 10. Format final result
    return {
        kpPositions,
        houseCusps: houseCusps.map(c => ({
            cusp: c.cusp,
            degree: c.siderealDegree // SIDEREAL for display
        })),
        ascendant: {
            degree: (houses.ascendant - ayanamsa + 360) % 360, // SIDEREAL
            sign: Math.floor(((houses.ascendant - ayanamsa + 360) % 360) / 30)
        }
    };
}