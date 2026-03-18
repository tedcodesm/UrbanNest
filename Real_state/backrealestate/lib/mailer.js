import nodeMailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const emailpass = process.env.EMAIL_PASSWORD;
const verifyemail = process.env.VERIFY_EMAIL;

const transporter = nodeMailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: verifyemail,
    pass: emailpass,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!to) {
      console.warn("No recipient email specified, skipping email send.");
      return;
    }

    console.log(`Attempting to send email to: ${to} with subject: ${subject}`);
    
    await transporter.verify();
    
    const info = await transporter.sendMail({
      from: verifyemail,
      to,
      subject,
      html,
    });
    
    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("Mailer Error:", error.message);
    // Don't re-throw for non-critical emails or handle at caller level
    throw error;
  }
};
