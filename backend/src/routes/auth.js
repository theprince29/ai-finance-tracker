import express from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import prisma from "../lib/prisma.js";
import { authRequired } from "../middleware/authmiddleware.js";
import { googleSignUp } from "../controllers/googleoauthController.js";

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


router.post("/google",googleSignUp);



router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

router.get("/profile", authRequired, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
  });
  res.json(user);
});

export default router;
