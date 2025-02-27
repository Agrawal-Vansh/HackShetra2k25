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

export const sendMeetingEmail = async (req, res) => {
  try {
    const { senderName, receiverEmail, meetingCode } = req.body;
    // console.log(senderName+" "+receiverEmail+" "+meetingCode);
    
    if (!senderName || !receiverEmail || !meetingCode) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a transporter using the platform's admin email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Admin email (platform's email)
        pass: process.env.EMAIL_PASS,  // Admin email's app password
      },
    });

    const mailOptions = {
      from: `"Admin - Meeting Platform" <${process.env.ADMIN_EMAIL}>`,
      to: receiverEmail,
      subject: `📅 Meeting Invitation - Code: ${meetingCode}`,
      html: `
        <h2>You Have a New Meeting Invitation!</h2>
        <p><strong>Meeting Code:</strong> ${meetingCode}</p>
        <p><strong>Sent By:</strong> ${senderName}</p>
        <p>If you have any questions, reply to this email.</p>
        <br>
        <p>Best regards,</p>
        <p><strong>Admin Team</strong></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📩 Meeting email sent from Admin to ${receiverEmail}`);

    res.status(200).json({ message: "Meeting email sent successfully" });

  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ message: "Failed to send email", error: error.message });
  }
};

export default sendEmailToInvestors;
