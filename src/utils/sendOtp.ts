import { Request, Response } from "express";
import { prisma } from "../prisma";
import { generateOTP } from "./createOtp";
import Twilio from "twilio";
import { sendEmail } from "./sendEmail";
import bcrypt from "bcrypt";

const client = Twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { phone, email, test } = req.body;

    console.log("Incoming request:", { phone, email, test });

    if (!phone && !email) {
      console.log("Validation failed: no phone or email");
      return res.status(400).json({
        success: false,
        message: "Phone or email required",
      });
    }

    if (phone) {
      console.log("Checking phone:", phone);

      const existingUser = await prisma.users.findUnique({
        where: { phone },
      });

      console.log("Phone user exists:", !!existingUser);

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Phone already registered",
        });
      }
    }

    if (email) {
      console.log("Checking email:", email);

      const existingUser = await prisma.users.findUnique({
        where: { email },
      });

      console.log("Email user exists:", !!existingUser);

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email already registered",
        });
      }
    }

    const otp = generateOTP();
    console.log("Generated OTP:", otp);

    const hashedOtp = await bcrypt.hash(otp, 10);

    await prisma.otp_verifications.deleteMany({
      where: {
        OR: [
          phone ? { phone } : undefined,
          email ? { email } : undefined,
        ].filter(Boolean) as any,
      },
    });

    console.log("Old OTPs deleted (if any)");

    await prisma.otp_verifications.create({
      data: {
        phone: phone || null,
        email: email || null,
        otp: hashedOtp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        test: test || false,
      },
    });

    console.log("OTP saved in DB");

    if (phone && !test) {
      try {
        console.log("Sending SMS via Twilio to:", phone);

        const response = await client.messages.create({
          body: `Your OTP is: ${otp}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phone,
        });

        console.log("Twilio response SID:", response.sid);
      } catch (err) {
        console.error("Twilio error:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to send OTP",
        });
      }
    }

    if (email && !test) {
      console.log("Sending Email to:", email);

      await sendEmail(
        email,
        "Your OTP for Chat App",
        `Your OTP is: ${otp}`
      );

      console.log("Email sent successfully");
    }

    const recipient = phone || email;
    console.log("OTP sent to:", recipient);

    return res.json({
      success: true,
      message: "OTP sent successfully",
      otp: test ? otp : undefined,
    });
  } catch (err) {
    console.error("Unexpected error:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};