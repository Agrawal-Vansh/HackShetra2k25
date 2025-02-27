import express from 'express';
import {getOppositeUserTypeDetails} from "../controllers/user.controller.js";

const router = express.Router();

router.get('/opposite/:userType', getOppositeUserTypeDetails);
// router.get('/opposite/:userType', (req, res) => {
//     console.log("User Type:", req.params.userType);
    
//     res.status(200).json({"message":"backend working"});});

export default router;
