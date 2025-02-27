import express from 'express';
import { matchStartupsWithInvestors } from '../controllers/match.controller.js';

const router = express.Router();
router.get('/', matchStartupsWithInvestors);

export default router;
