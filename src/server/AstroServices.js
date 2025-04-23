// src/server/AstroServices.js

import swe from 'swisseph';
import moment from 'moment-timezone';

/**
 * Compute a Parashari (Vedic) chart: planetary positions and house cusps
 */
export async function getVedicChart(bd) {
    swe.swe_set_ephe_path('/ephe/');
    const { year, month, day, hour, minute, latitude, longitude } = bd;

    const utc = moment.tz(
        `${year}-${month}-${day} ${hour}:${minute}`,
        'UTC'
    );
    const jd = swe.swe_julday(
        utc.year(),
        utc.month() + 1,
        utc.date(),
        utc.hour() + utc.minute() / 60,
        swe.SE_GREG_CAL
    );

    // 1) Planetary positions
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
        const res = swe.swe_calc_ut(jd, p.idx);
        let lon = res.longitude;
        if (p.name === 'Ketu') lon = (lon + 180) % 360;
        return { planet: p.name, degree: lon, house: null };
    });
    // 2) House cusps – handle array, object.cusps or object.house
    const rawHouses = swe.swe_houses(jd, latitude, longitude, 'P');
    let cuspsArray;
    if (Array.isArray(rawHouses)) {
        // JS binding sometimes returns [cuspsArray, ascmcArray]
        cuspsArray = rawHouses[0];
    } else if (rawHouses && Array.isArray(rawHouses.house)) {
        // Other times it returns { house: [...], ascendant: ..., ... }
        cuspsArray = rawHouses.house;
    } else {
        throw new Error('swe_houses returned unexpected structure');
    }

    const houseCusps = cuspsArray.map((deg, i) => ({
        cusp: i + 1,
        degree: deg
    }));


    return { planetaryPositions, houseCusps };
}

/**
 * Compute KP system data
 */


export function getKPCalculations(chart) {
    const nak = 13 + 20 / 60;             // 13°20′
    const subSz = nak / 9;                // each sub-lord span

    // 27 nakṣatra lords in order
    const STAR_LORDS = [
        'Ke', 'Ve', 'Su', 'Mo', 'Ma', 'Ra', 'Ju', 'Sa', 'Me',
        'Ke', 'Ve', 'Su', 'Mo', 'Ma', 'Ra', 'Ju', 'Sa', 'Me',
        'Ke', 'Ve', 'Su', 'Mo', 'Ma', 'Ra', 'Ju', 'Sa', 'Me'
    ];

    // build 27×9 sub-lord table
    const SUB_LORDS = STAR_LORDS.map((_, i) =>
        STAR_LORDS.slice(i).concat(STAR_LORDS.slice(0, i))
    );

    const kpPositions = chart.planetaryPositions.map(p => {
        const comp = p.degree % 360;
        const starIndex = Math.floor(comp / nak);
        const intra = comp % nak;
        const subIndex = Math.floor(intra / subSz);

        return {
            planet: p.planet,
            compoundDegree: comp.toFixed(2),
            starLord: STAR_LORDS[starIndex],            // e.g. 'Ve'
            subLord: SUB_LORDS[starIndex][subIndex]     // e.g. 'Ju'
        };
    });

    return { kpPositions };
}

