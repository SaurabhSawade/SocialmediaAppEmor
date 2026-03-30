import express, { Request, Response } from "express";
import { signup, login, logout, refreshAccessToken ,verifySignupOTP, resendSignupOTP} from "../controllers/authController";
import { getAllUsers } from "../models/userModel"; 
import {
  registerValidation,
  loginValidation,
  validate,
} from "../middleware/validationMiddleware";
import protect from "../middleware/authMiddleware";
import { sendOTP } from "../utils/sendOtp";

// const router = express.Router();
const router = express.Router();



// STEP 1 Request OTP
router.post("/signup", registerValidation, validate, signup);

// STEP 2 Verify OTP & create user
router.post("/verify-otp", verifySignupOTP);

// STEP 3 Resend OTP
router.post("/resend-otp", resendSignupOTP);


router.post("/login", loginValidation, validate, login);

router.post("/refresh", refreshAccessToken);
router.post("/logout", protect, logout);

// Get all users
// here i can make a separate module for it

router.get("/users", async (req: Request, res: Response) => {
  try {
    // const [rows] = await pool.query<IUser[]>(
    //   "SELECT id, name, email FROM users"
    // );

    console.log("user is featching");

    // fetch all users via model
    const rows = await getAllUsers();

    res.status(200).json(rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


// module.exports = router;
export default router;
