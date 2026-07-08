const nodemailer = require("nodemailer");

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const getEmailHTML = ({ name, otp, type }) => `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#F8F5F0;font-family:Arial,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F5F0;padding:40px 0;"><tr><td align="center"><table width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;"><tr><td style="background:#4F6F52;padding:28px;text-align:center;"><p style="margin:0;color:#C8A96B;font-size:22px;font-weight:700;letter-spacing:3px;">SAVIRA</p><p style="margin:2px 0 0;color:rgba(200,169,107,0.7);font-size:9px;letter-spacing:6px;">ATTIRES</p></td></tr><tr><td style="padding:36px 40px 28px;"><h2 style="margin:0 0 8px;color:#2E2E2E;font-size:18px;">${type === "verify" ? "Email Verification" : "Password Reset"}</h2><p style="margin:0 0 24px;color:#666;font-size:14px;line-height:1.6;">Hi ${name},<br>${type === "verify" ? "Use the OTP below to verify your email. It expires in <strong>5 minutes</strong>." : "Use the OTP below to reset your password. It expires in <strong>5 minutes</strong>."}</p><div style="background:#F8F5F0;border-radius:12px;padding:24px;text-align:center;margin:0 0 24px;"><p style="margin:0 0 6px;color:#888;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Your OTP</p><p style="margin:0;color:#4F6F52;font-size:38px;font-weight:700;letter-spacing:10px;">${otp}</p></div><p style="margin:0;color:#999;font-size:12px;line-height:1.6;">Valid for 5 minutes only. Do not share this OTP with anyone.</p></td></tr><tr><td style="background:#F8F5F0;padding:16px 40px;text-align:center;border-top:1px solid #eee;"><p style="margin:0;color:#bbb;font-size:11px;">© ${new Date().getFullYear()} SAVIRA ATTIRES. All rights reserved.</p></td></tr></table></td></tr></table></body></html>`;

const sendOTPEmail = async ({ to, name, otp, type = "verify" }) => {
  const subjects = {
    verify: "Verify your SAVIRA ATTIRES account",
    reset: "Reset your SAVIRA ATTIRES password",
  };

  // Option 1: SendGrid API (HTTPS port 443 — works on all networks)
  if (process.env.SENDGRID_API_KEY) {
    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    await sgMail.send({
      to,
      from: { email: process.env.EMAIL_USER, name: "SAVIRA ATTIRES" },
      subject: subjects[type],
      html: getEmailHTML({ name, otp, type }),
    });
    console.log(`✅ OTP sent via SendGrid to ${to}`);
    return;
  }

  // Option 2: Gmail SMTP
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    await transporter.sendMail({
      from: `"SAVIRA ATTIRES" <${process.env.EMAIL_USER}>`,
      to,
      subject: subjects[type],
      html: getEmailHTML({ name, otp, type }),
    });
    console.log(`✅ OTP sent via Gmail to ${to}`);
    return;
  }

  throw new Error("No email provider configured.");
};

module.exports = { generateOTP, sendOTPEmail };
