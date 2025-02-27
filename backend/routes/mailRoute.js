import express from 'express';
import {sendMeetingEmail} from "../utils/sendmail.js";
const router=express.Router();
router.post("/meeting", sendMeetingEmail);
export default router;