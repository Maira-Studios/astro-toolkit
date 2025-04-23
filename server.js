/* eslint‑env node */
/* global process */

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { getVedicChart, getKPCalculations } from "./src/server/AstroServices.js"

const app = express();

// 1. Enable CORS for React dev server origin
app.use(cors({ origin: 'http://localhost:5173' }));

// 2. Parse JSON bodies
app.use(bodyParser.json());

/**
 * POST /chart
 * Expects birth details in the body, returns Vedic and KP chart data.
 */
app.post('/chart', async (req, res) => {
    const bd = req.body;
    try {
        console.log(bd);
        const vedic = await getVedicChart(bd);
        const kp = getKPCalculations(bd);
        res.json({ vedic, kp });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// 3. Start the server
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Chart API listening on http://localhost:${PORT}`);
});
