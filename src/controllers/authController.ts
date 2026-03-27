import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import * as UserModel from "../models/userModel";
import { prisma } from "../prisma";
import { sendEmail } from "../utils/sendEmail";
/**
 * call when post req will hit for register routes
 * @param req - Request object
 * @param res - Response object
 * @async
 */

export const registerWithOTP = async (req: Request, res: Response) => {
  const { name, phone, email, password, otp } = req.body;

  if (!name || !password || (!phone && !email)) {
    return res.status(400).json({ success: false, message: "Name, password and phone/email required" });
  }
  
  // Find OTP
  const otpEntry = await prisma.otp_verifications.findFirst({
    where: {
      otp,
      verified: false,
      expiresAt: { gte: new Date() },
      OR: [{ phone: phone || null }, { email: email || null }],
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otpEntry) return res.status(400).json({ success: false, message: "Invalid or expired OTP" });

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.users.create({
      data: {
        name,
        password: hashedPassword,
        phone: phone || null,
        email: email || null,
        is_verified: true,
      },
    });

    await prisma.otp_verifications.update({
      where: { id: otpEntry.id },
      data: { verified: true },
    });

    // Send success email if user registered via email
    if (email) {
      await sendEmail(email, "Registration Successful", `Hello ${name},\n\nYour registration was successful!`);
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
    });
  } catch (err: any) {
    if (err.code === "P2002") {
      return res.status(400).json({ success: false, message: "Email or phone already registered" });
    }
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


/**
 * call when get req will hit for login routes
 * @param req - Request object
 * @param res - Response object
 * @async
 */

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

    const accessToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "60m" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "7d" }
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

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const refreshAccessToken = async (req: Request, res: Response) => {
  // const { refreshToken } = req.body;
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

    const newAccessToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as string,
      { expiresIn: "60m" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};