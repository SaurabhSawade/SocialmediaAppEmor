import { Request, Response } from "express";
import { prisma } from "../prisma";
import { generateOTP } from "./createOtp";
import Twilio from "twilio";
import { sendEmail } from "./sendEmail";

const client = Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export const sendOTP = async (req: Request, res: Response) => {
  const { phone, email, test } = req.body;

  if (!phone && !email) {
    return res.status(400).json({ success: false, message: "Phone or email required" });
  }

  // Check if user exists
  if (phone) {
    const existingUser = await prisma.users.findUnique({ where: { phone } });
    if (existingUser) return res.status(400).json({ success: false, message: "Phone already registered" });
  }

  if (email) {
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ success: false, message: "Email already registered" });
  }

  const otp = generateOTP();

  // Save OTP
  await prisma.otp_verifications.create({
    data: {
      phone: phone || null,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      test: test || false,
    },
  });

  // Send OTP
  if (phone && !test) {
    try {
      await client.messages.create({
        body: `Your OTP is: ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
    } catch (err) {
      console.error("Twilio error:", err);
      return res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
  }

  if (email && !test) {
    await sendEmail(email, "Your OTP for Chat App", `Your OTP is: ${otp}`);
  }

const recipient = phone || email;
console.log(`OTP sent to ${recipient}: ${otp}`);


  res.json({ success: true, message: "OTP sent successfully", otp: test ? otp : undefined });
};