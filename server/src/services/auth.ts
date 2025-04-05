// import { Request } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// interface JwtPayload {
//   _id: unknown;
//   username: string;
//   email: string;
// }

// //this function is causing the login error
// export const getUserFromToken = (req: Request): JwtPayload | null => {
//   const authHeader = req.headers.authorization;
//   if (!authHeader) return null;

//   const token = authHeader.split(" ")[1];
//   const secretKey = process.env.JWT_SECRET_KEY || "";

//   try {
//     const decoded = jwt.verify(token, secretKey) as JwtPayload;
//     return decoded;
//   } catch (error) {
//     console.error("Token verification failed:", error);
//     return null;
//   }
// };
export const getUserFromToken = ({ req }: any) => {
  let token = req.body.token || req.query.token || req.headers.authorization;

  if (req.headers.authorization) {
    token = token.split(" ").pop().trim();
  }

  console.log(token);

  if (!token) {
    return req;
  }

  try {
    const data: any = jwt.verify(token, process.env.JWT_SECRET_KEY || "", {
      maxAge: "2hr",
    });

    console.log(data);
    req.user = data;
  } catch (err) {
    console.log("Invalid token");
  }

  return req;
};

export const signToken = (username: string, email: string, _id: unknown) => {
  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY || "";
  return jwt.sign(payload, secretKey, { expiresIn: "1h" });
};

// import type { Request, Response, NextFunction } from 'express';
// import jwt from 'jsonwebtoken';

// import dotenv from 'dotenv';
// dotenv.config();

// interface JwtPayload {
//   _id: unknown;
//   username: string;
//   email: string,
// }

// export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
//   const authHeader = req.headers.authorization;

//   if (authHeader) {
//     const token = authHeader.split(' ')[1];

//     const secretKey = process.env.JWT_SECRET_KEY || '';

//     jwt.verify(token, secretKey, (err, user) => {
//       if (err) {
//         return res.sendStatus(403); // Forbidden
//       }

//       req.user = user as JwtPayload;
//       return next();
//     });
//   } else {
//     res.sendStatus(401); // Unauthorized
//   }
// };

// export const signToken = (username: string, email: string, _id: unknown) => {
//   const payload = { username, email, _id };
//   const secretKey = process.env.JWT_SECRET_KEY || '';

//   return jwt.sign(payload, secretKey, { expiresIn: '1h' });
// };
