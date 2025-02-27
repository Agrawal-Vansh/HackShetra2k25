import nodemailer from "nodemailer";

const sendEmailToInvestors = async (startupData, investorEmails) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // Using Gmail (You can change this to another provider)
      auth: 
      {
        user: process.env.EMAIL_USER, // Your platform email
        pass: process.env.EMAIL_PASS, // Your app password
      },
    });

    const mailOptions = {
      from: `"${startupData.name}" <${process.env.EMAIL_USER}>`, // Shows startup's name but sent from platform
      replyTo: startupData.email, // Replies go directly to the startup
      to: investorEmails.join(","), // Send to multiple investors
      subject: `🚀 New Startup Alert: ${startupData.companyInfo.name}`,
      html: `
        <h2>Exciting Investment Opportunity!</h2>
        <p>A new startup has just registered on our platform. Here are the details:</p>
        <ul>
          <li><strong>Startup Name:</strong> ${startupData.companyInfo.name}</li>
          <li><strong>Industry:</strong> ${startupData.companyInfo.industry}</li>
          <li><strong>Funding Stage:</strong> ${startupData.funding.stage}</li>
          <li><strong>Amount Needed:</strong> $${startupData.funding.amountNeeded}</li>
          <li><strong>Equity Offering:</strong> ${startupData.funding.equityOffering}%</li>
          <li><strong>Website:</strong> <a href="${startupData.companyInfo.website}">${startupData.companyInfo.website}</a></li>
        </ul>
        <p>If you're interested, reply directly to <a href="mailto:${startupData.email}">${startupData.email}</a>.</p>
        <p>Best regards,</p>
        <p><strong>Your Platform Team</strong></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📩 Email sent to investors from ${startupData.email}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

export default sendEmailToInvestors;
