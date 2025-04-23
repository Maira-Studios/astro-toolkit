// src/server/AstroServices.js

import swe from 'swisseph';
import moment from 'moment-timezone';

/**
 * Compute a Parashari (Vedic) chart: planetary positions and house cusps
 */
export async function getVedicChart(bd) {
    swe.swe_set_ephe_path('/ephe/');
    swe.swe_set_sid_mode(swe.SE_SIDM_LAHIRI, 0, 0);

    const { year, month, day, hour, minute, latitude, longitude } = bd;
    const local = moment.tz(
        [year, month - 1, day, hour, minute],
        moment.tz.guess()
    );
    const utc = local.clone().tz('UTC');
    const jd = swe.swe_julday(
        utc.year(),
        utc.month() + 1,
        utc.date(),
        utc.hour() + utc.minute() / 60,
        swe.SE_GREG_CAL
    );

    // Sidereal planetary positions
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
        const res = swe.swe_calc_ut(jd, p.idx, swe.SEFLG_SIDEREAL);
        let lon = res.longitude;
        if (p.name === 'Ketu') lon = (lon + 180) % 360;
        return { planet: p.name, degree: lon, house: null };
    });

    // Equal-house cusps (sidereal mode)
    const rawV = swe.swe_houses(jd, latitude, longitude, 'E');
    const cuspsArrayV = Array.isArray(rawV) ? rawV[0] : rawV.house;
    const houseCusps = cuspsArrayV.map((deg, i) => ({
        cusp: i + 1,
        degree: deg
    }));

    // Map each planet to its house
    planetaryPositions.forEach(p => {
        let found = houseCusps
            .slice()
            .reverse()
            .find(c => p.degree >= c.degree);
        if (!found) {
            found = houseCusps.find(c => c.cusp === 1);
        }
        p.house = found.cusp;
    });

    return { planetaryPositions, houseCusps };
}

/**
 * Compute KP system data: tropical zodiac with Placidus houses
 */
export function getKPCalculations(bd) {
    swe.swe_set_ephe_path('/ephe/');
    swe.swe_set_sid_mode(swe.SE_SIDM_OFF, 0, 0);

    const { year, month, day, hour, minute, latitude, longitude } = bd;
    const local = moment.tz(
        [year, month - 1, day, hour, minute],
        moment.tz.guess()
    );
    const utc = local.clone().tz('UTC');
    const jd = swe.swe_julday(
        utc.year(),
        utc.month() + 1,
        utc.date(),
        utc.hour() + utc.minute() / 60,
        swe.SE_GREG_CAL
    );

    // Tropical planetary positions
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
        const res = swe.swe_calc_ut(jd, p.idx);
        let lon = res.longitude;
        if (p.name === 'Ketu') lon = (lon + 180) % 360;
        return { planet: p.name, degree: lon };
    });

    // Placidus house cusps for KP
    const rawK = swe.swe_houses(jd, latitude, longitude, 'P');
    const cuspsArrayK = Array.isArray(rawK) ? rawK[0] : rawK.house;
    const houseCuspsK = cuspsArrayK.map((deg, i) => ({
        cusp: i + 1,
        degree: deg
    }));

    // KP sub-lord tables
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

    return { kpPositions, houseCusps: houseCuspsK };
}
