import express from "express";
import { initiateFunding,getFundingByStartupEmail ,getFundingByInvestorEmail,handleUpdateStatus} from "../controllers/funding.controller.js";

const router = express.Router();

// Route to initiate funding
router.post("/initiate", initiateFunding);
router.get("/detail/:email", getFundingByStartupEmail);
router.get("/detail/investor/:email", getFundingByInvestorEmail);
router.patch("/update-status",handleUpdateStatus);
export default router;
