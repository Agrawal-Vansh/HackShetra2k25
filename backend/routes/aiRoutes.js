import express from 'express';
import {predictValuation} from "../controllers/ai.controller.js";
const router=express.Router();
router.post("/value", predictValuation);
export default router;