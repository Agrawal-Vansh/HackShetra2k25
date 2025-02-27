import express from "express";
import { signupValidation, loginValidation } from "../middleware/auth.middleware.js";
import { handleRegisterUser, handleLoginUser, googleAuthCallback } from "../controllers/auth.controller.js";

const router = express.Router();

// **User Registration**
router.post("/register",handleRegisterUser);

// **User Login**
router.post("/login", loginValidation, handleLoginUser);

// **Google OAuth Callback**
router.get("/google/callback", googleAuthCallback);

export default router;
