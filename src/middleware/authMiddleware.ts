import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
      };
    }
  }
}

const protect = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: number };

    req.user = { id: decoded.id };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default protect;



// // const jwt = require("jsonwebtoken");
// import jwt from "jsonwebtoken";
// import { Request, Response, NextFunction } from "express";

// // Extend Express Request to include user
// declare global {
//   namespace Express {
//     interface Request {
//       user?: string;
//     }
//   }
// }

// /**
//  * Middleware to protect routes by verifying JWT token.
//  * @param req - Request object
//  * @param res - Response object
//  * @param next - Next middleware function
//  */

// // const protect = (req, res, next) => {
// const protect = (req: Request, res: Response, next: NextFunction) => {
//   const token = req.headers.authorization;

//   if (!token) {
//     return res.status(401).json({ message: "No token" });
//   }

//   try {
//     const decoded = jwt.verify(
//       token.split(" ")[1],
//       process.env.JWT_SECRET as string
//     ) as { id: string };

//     req.user = decoded.id;

//     next();
//   } catch (err) {
//     res.status(401).json(err);
//   }
// };

// // module.exports = protect;
// export default protect;