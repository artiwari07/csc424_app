import express from 'express';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();



import { OAuth2Client } from 'google-auth-library';
const secretKey = process.env.TOKEN_SECRET;

function generateAccessToken(username) {
  return jwt.sign({ username }, secretKey, { expiresIn: "180s" });
}

async function getUserData(access_token) {

    const response = await fetch(
  
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
  
    );
  
    const data = await response.json();
  
    console.log("data", data);
    return data
  
  }
  
  router.get("/", async function (req, res, next) {
  
    const code = req.query.code;
  
    try {
  
      const redirectUrl = "https://127.0.0.1:8000/oath";
      const oAuth2Client = new OAuth2Client(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
       redirectUrl
      );
  
      const result = await oAuth2Client.getToken(code);
      await oAuth2Client.setCredentials(result.tokens);
      const user = oAuth2Client.credentials;
      // show data that is returned from the Google call
      // console.log("user", user);
      const info = await getUserData(user.access_token);
  
          
     // call your code to generate a new JWT from your backend, don't reuse Googles
  
     const token = generateAccessToken(info.name);
      // res.redirect(303, `https://localhost:3000/token=${token}`);
      res.redirect(303, `https://localhost:3000/landing/token=${token}`);
  
      } catch (err) {
             console.log("Error with signin with Google", err);
             res.redirect(303, "https://localhost:3000/");
    }
  
  });

export default router;