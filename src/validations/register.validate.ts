import { body } from "express-validator";

export const registerValidator = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("name").notEmpty().withMessage("Name is required"),
];

export const verifyOtpValidator = [
  body("email").isEmail(),
  body("otp").isLength({ min: 6, max: 6 }),
];