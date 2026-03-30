import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import * as UserModel from "../models/userModel";
import { prisma } from "../prisma";
import { sendEmail } from "../utils/sendEmail";
import { generateOTP } from "../utils/createOtp";
import { log } from "console";
const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES) || 5 ;



export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password } = req.body;
    let data={}
    const existingUser = await prisma.users.findFirst({
      where: { OR: [{ email }, { phone }] },
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const hashedPassword = await bcrypt.hash(password, 10);

    const otpExpiryMinutes = Number(process.env.OTP_EXPIRY_MINUTES) || 5;
    
    await prisma.pendingUser.create({
      data: {
        name,
        email: email || null,
        phone: phone || null,
        password: hashedPassword,
        otp: hashedOtp,
        expiresAt: new Date(Date.now() + otpExpiryMinutes * 60 * 1000),
      },
    });

    if (email) {
      await sendEmail(email, "OTP Verification", `Your OTP is ${otp}`);
    }

   return res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending OTP" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findUserByEmail(email);

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const accessExpiry = process.env.JWT_ACCESS_EXPIRY || "60m";
    const refreshExpiry = process.env.JWT_REFRESH_EXPIRY || "7d";

    const accessToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: accessExpiry }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: refreshExpiry }
    );

    await UserModel.updateRefreshToken(user.id, refreshToken);

    const { password: _, ...userWithoutPassword } = user;

    res.json({
      accessToken,
      refreshToken,
      user: userWithoutPassword,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;

    await UserModel.updateRefreshToken(userId, null);

    return res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as { id: number };

    const user = await UserModel.findUserById(decoded.id);

    if (!user || user.refresh_token !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const accessExpiry = process.env.JWT_ACCESS_EXPIRY || "60m";

    const newAccessToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: accessExpiry }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

export const verifySignupOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
  console.log("Verifying OTP for email:", email);
    const pendingUser = await prisma.pendingUser.findFirst({
      where: {
        email,
        expiresAt: { gte: new Date() },
      },
    });
    console.log("Found pending user:", pendingUser);
    if (!pendingUser) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const isOtpValid = await bcrypt.compare(otp, pendingUser.otp);

    if (!isOtpValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = await prisma.users.create({
      data: {
        name: pendingUser.name,
        email: pendingUser.email,
        phone: pendingUser.phone,
        password: pendingUser.password,
        is_verified: true,
      },
    });

    await prisma.pendingUser.delete({
      where: { id: pendingUser.id },
    });

    return res.status(201).json({
      message: "User verified and created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const resendSignupOTP = async (req: Request, res: Response) => {
  try {
    const { email,mobile } = req.body;

    const pendingUser = await prisma.pendingUser.findFirst({
      where: { email },

    });

    if (!pendingUser) {
      return res.status(400).json({ message: "No pending signup found" });
    }

    const now = Date.now();
    const lastSent = new Date(pendingUser.createdAt).getTime();

    const cooldownSec = Number(process.env.RESEND_OTP_COOLDOWN) || 30;

    if ((now - lastSent) / 1000 < cooldownSec) {
      return res.status(429).json({
        message: `Please wait ${cooldownSec} seconds before resending OTP`,
      });
    }

    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10);

    const otpExpiryMinutes = Number(process.env.OTP_EXPIRY_MINUTES) || 5;

    await prisma.pendingUser.update({
      where: { id: pendingUser.id },
      data: {
        otp: hashedOtp,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + otpExpiryMinutes * 60 * 1000),
      },
    });

    await sendEmail(email, "Resend OTP", `Your new OTP is ${otp}`);

    return res.json({ message: "OTP resent successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error resending OTP" });
  }
};
