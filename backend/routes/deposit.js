import express from 'express';
import Deposit from '../models/Deposit.js';

const router = express.Router();

router.get('/deposits', async (req, res) => {
    try {
        res.send("Deposits!");
        const deposits = await Deposit.find();
        res.json(deposits);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching deposits' });
    }
});

export default router;
