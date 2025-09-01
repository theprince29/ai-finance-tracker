import { oauth2Client } from "../utils/googleConfig.js";
import axios from "axios";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

const googleSignUp = async (req, res) => {
    try {
        const {code} = req.body;
        const googleRes = await oauth2Client.getToken(code);
        //console.log(oauth2Client.redirectUri);
        oauth2Client.setCredentials(googleRes.tokens);
        const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`)

        const { email, name, id: googleId, picture} = userRes.data;
        //console.log(userRes);
        const user = await prisma.user.upsert({
          where: { email: email },
          update: {
            name: name,
            imageUrl: picture,
          },
          create: {
            email: email,
            name: name || "",
            imageUrl: picture || "",
            googleId: googleId || "",
          },
        });

    // Issue your own JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Store JWT in HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.json({
      message: "Logged in successfully",
      user,
      token, // optional return
    });
    } catch (err) {
        console.error("Google Sign-Up Error:", err);
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
            user: null,  // ensure key exists
            token: null
        });
    }   
}

export {
    googleSignUp
}