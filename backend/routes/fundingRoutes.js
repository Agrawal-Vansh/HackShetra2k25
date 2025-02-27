import express from "express";
import { initiateFunding,getFundingByStartupEmail } from "../controllers/funding.controller.js";

const router = express.Router();

// Route to initiate funding
router.post("/initiate", initiateFunding);
router.get("/detail/:email", getFundingByStartupEmail);

export default router;
