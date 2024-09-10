import express from 'express';
import Deposit from '../models/Deposit.js';

const router = express.Router();

router.get('/deposits', async (req, res) => {
    try {
        console.log("data sending!");
        const deposits = await Deposit.find();
        res.json(deposits);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching deposits' });
    }
});

export default router;
