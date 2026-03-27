// const { body, validationResult } = require("express-validator");
import { body, validationResult, ValidationChain } from "express-validator";
import { Request, Response, NextFunction } from "express";

/**
 * Validation rules for user registration.
 * Validates name, email, and password fields.
 * @type {ValidationChain[]}
 */

// Validation rules for register
// const registerValidation = [
const registerValidation: ValidationChain[] = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long")
    .matches(/^[A-Za-z\s]+$/)
    .withMessage("Name can only contain letters and spaces"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

/**
 * Validation rules for user login.
 * Validates email and password fields.
 * @type {ValidationChain[]}
 */

// const loginValidation = [
const loginValidation: ValidationChain[] = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Enter a valid email"),

  body("password").notEmpty().withMessage("Password is required"),
];

/**
 * Middleware to check validation errors
 * @param req - request
 * @param res - response
 * @param next - pass to next
 */

// const validate = (req, res, next) => {
const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
};

// module.exports = {
//   registerValidation,
//   loginValidation,
//   validate,
// };
export { registerValidation, loginValidation, validate };