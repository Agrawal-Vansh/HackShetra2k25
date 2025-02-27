import { GoogleGenerativeAI } from "@google/generative-ai";

export const predictValuation = async (req, res) => {
  try {
    const { funding, metrics } = req.body;

    if (!funding || !metrics) {
      return res.status(400).json({ error: "Funding and Metrics data are required" });
    }

    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Constructing a financial valuation prompt
    const prompt = `
      Predict the estimated valuation of a startup based on the following financial data:
      
      **Funding Details:**
      - Stage: ${funding.stage}
      - Amount Needed: $${funding.amountNeeded}
      - Equity Offering: ${funding.equityOffering}%

      **Company Metrics:**
      - Revenue: $${metrics.revenue}
      - Users: ${metrics.users}
      - Growth Rate: ${metrics.growth}%
        Just give me a predict number as response  in Rs 
    `;

    console.log("Sending prompt to Gemini...");

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    console.log("Gemini Response Received");

    return res.status(200).json({ ans: responseText });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
};
