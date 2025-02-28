import Funding from "../models/fundings.model.js";
import User from "../models/users.model.js";

export const initiateFunding = async (req, res) => {
    try {
      const { startupEmail, investorEmail, amount, equity, notes } = req.body;
  
      // Validate required fields
      if (!startupEmail || !investorEmail || !amount || !equity) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Find startup and investor by email
      const startup = await User.findOne({ email: startupEmail, userType: "startup" });
      const investor = await User.findOne({ email: investorEmail, userType: "investor" });
  
      if (!startup || !investor) {
        return res.status(404).json({ message: "Startup or Investor not found" });
      }
  
      // Create a new funding request
      const newFunding = new Funding({
        startupId: startup._id,
        investorId: investor._id,
        amount,
        equity,
        notes,
        status: "proposed", // Default status
      });
  
      // Save to database
      await newFunding.save();
  
      res.status(201).json({
        message: "Funding proposal initiated successfully",
        funding: newFunding,
      });
    } catch (error) {
      console.error("❌ Error initiating funding:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  };

export const getFundingByStartupEmail = async (req, res) => {
    try {
      const { email } = req.params;
  
      // Find the startup by email
      const startup = await User.findOne({ email, userType: "startup" });
  
      if (!startup) {
        return res.status(404).json({ message: "Startup not found" });
      }
  
      // Find all funding records for this startup
      const fundingRecords = await Funding.find({ startupId: startup._id })
        .populate("investorId", "name email");
  
      if (fundingRecords.length === 0) {
        return res.status(404).json({ message: "No funding records found for this startup" });
      }
  
      res.status(200).json(fundingRecords);
    } catch (error) {
      console.error("Error fetching funding details:", error);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  };

export const getFundingByInvestorEmail = async (req, res) => {
    try {
      const { email } = req.params;
  
      // Find the investor by email
      const investor = await User.findOne({ email, userType: "investor" });
  
      if (!investor) {
        return res.status(404).json({ message: "Investor not found." });
      }
  
      // Find all funding records where this investor has made investments
      const fundingRecords = await Funding.find({ investorId: investor._id })
        .populate("startupId", "name email")  // Populate startup details
        .populate("investorId", "name email"); // Populate investor details (optional)
  
      if (fundingRecords.length === 0) {
        return res.status(404).json({ message: "No funding records found for this investor." });
      }
  
      res.status(200).json(fundingRecords);
    } catch (error) {
      console.error("Error fetching funding details:", error);
      res.status(500).json({ message: "Server error. Please try again later." });
    }
  };
  

export const handleUpdateStatus= async (req, res) => {
  try {
    const { startupEmail, status } = req.body;

    // Validate input
    if (!startupEmail || !status) {
      return res.status(400).json({ message: "Startup email and status are required." });
    }

    // Find startup by email
    const startup = await User.findOne({ email: startupEmail });
    if (!startup) {
      return res.status(404).json({ message: "Startup not found." });
    }

    // Find and update the funding record for this startup
    const updatedFunding = await Funding.findOneAndUpdate(
      { startupId: startup._id }, // Find funding by startup ID
      { $set: { status } },       // Update status
      { new: true }               // Return updated document
    );

    if (!updatedFunding) {
      return res.status(404).json({ message: "Funding proposal not found for this startup." });
    }

    res.json({ message: "Funding status updated successfully.", funding: updatedFunding });
  } catch (error) {
    console.error("Error updating funding status:", error);
    res.status(500).json({ message: "Server error." });
  }
};