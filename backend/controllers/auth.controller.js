import User from "../models/users.model.js";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// **User Registration**
export async function handleRegisterUser(req, res) {
    try {
        const { name, email, password, userType, companyInfo, funding, metrics, investorInfo, investmentCriteria, pastInvestments } = req.body;

        // Validate userType
        if (!["startup", "investor"].includes(userType)) {
            return res.status(400).json({ message: "Invalid user type" });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create user object
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            userType,
            ...(userType === "startup" ? { companyInfo, funding, metrics } : {}),
            ...(userType === "investor" ? { investorInfo, investmentCriteria, pastInvestments } : {})
        });

        // Save to the database
        await newUser.save();

        res.status(201).json({ message: "User registered successfully", success: true });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Server error" });
    }
}


// **User Login**
export async function handleLoginUser(req, res) {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(403).json({ message: "Invalid credentials" });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Create a JWT token
        const token = jwt.sign(
            { email: user.email, _id: user._id, userType: user.userType },
            process.env.JWT_SECRET,
            { expiresIn: "5h" }
        );

        // Respond with the token
        return res.status(200).json({
            message: "Login successful",
            token,
            email: user.email,
            name: user.name,
            userType: user.userType,
            success: true,
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server error" });
    }
}

// **Google Authentication**
export const googleAuthCallback = async (req, res) => {
    try {
        console.log("Starting Google Auth Callback");

        const { token } = req.query;
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            // If user doesn't exist, create a new one with a placeholder password
            const hashedPassword = await bcrypt.hash("GoogleLogin", 10);
            user = await User.create({ name, email, password: hashedPassword, userType: "startup",profilePhoto:picture });
        }

        const jwt_token = jwt.sign(
            { email: user.email, _id: user._id, userType: user.userType ,profilePhoto:user.profilePhoto},
            process.env.JWT_SECRET,
            { expiresIn: "5h" }
        );

        return res.status(200).json({
            message: "Login successful",
            token: jwt_token,
            email: user.email,
            name: user.name,
            userType: user.userType,
            success: true,
        });
    } catch (error) {
        console.error("Google authentication failed:", error);
        res.status(500).json({ message: "Authentication failed", error });
    }
};
