import { Router, Request, Response } from "express";
import { login, register } from "../controllers/authController";
const router = Router();

router.get("/login", (req: Request, res: Response) => {
  res.render("login", { error: null });
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const result = await login(req);

    if (result && result.token) {
      res.render("chat", { username: result.user.name, messages: [] });
    }
    const errorMessage = result?.error || "Invalid email or password";
    res.render("login", { error: errorMessage });

  } catch (err) {
    console.error(err);
    res.render("login", { error: "Server error. Try again later." });
  }
});

router.get("/register", (req: Request, res: Response) => {
  res.render("register", { error: null });
});

router.post("/register", async (req: Request, res: Response) => {
  try {
    const result = await register(req);

    if (result && result.token) {
      res.render("chat", { username: result.user.name, messages: [] });
    } else {
      const errorMessage = result?.error || "Registration failed";
      res.render("register", { error: errorMessage });
    }
  } catch (err) {
    console.error(err);
    res.render("register", { error: "Server error. Try again later." });
  }
});

export default router;