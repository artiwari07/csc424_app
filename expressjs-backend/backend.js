import mongoose from "mongoose";
import express from "express";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import cors from "cors";
import dotenv from "dotenv";
import userServices from "./models/user-services.js";
import authenticateToken from "./authMiddleware.js";
import https from "https";
import fs from "fs";

dotenv.config();
const app = express();
const port = 8000;

app.use(express.json());
app.use(cors());

const secretKey = process.env.TOKEN_SECRET;

const users = [{ username: "bj", password: "pass424" }];

function generateAccessToken(username) {
  return jwt.sign({ username }, secretKey, { expiresIn: "1800s" });
}

const isStrongPassword = (password) => {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

const startServer = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/users", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    app.get("/", (req, res) => {
      res.send("Hello World!");
    });

    app.post("/account/register", async (req, res) => {
      const { username, password } = req.body;

      try {
        // Check if the username is already taken
        const existingUser = await userServices.findUserByName(username);

        if (existingUser.length > 0) {
          return res
            .status(400)
            .json({ success: false, error: "Username already taken" });
        }

        // Validate the password
        if (!isStrongPassword(password)) {
          return res.status(400).json({
            success: false,
            error:
              "Password must have at least one capital letter, one number, and one symbol",
          });
        }

        // Create a new user in the database (password stored in plain text)
        const newUser = { username, password };
        const savedUser = await userServices.addUser(newUser);
        res.json({ success: true, user: savedUser });
      } catch (error) {
        console.error("Error during user registration:", error);
        res
          .status(500)
          .json({ success: false, error: "Internal Server Error" });
      }
    });

    app.post("/api/createNewUser", async (req, res) => {
      const { username } = req.body;

      try {
        // Find the user by username
        const user = await userServices.findUserByName(username);

        if (user.length > 0) {
          // Generate a token using the username
          const token = generateAccessToken(username);

          // Set the token as an HttpOnly cookie
          res.cookie("token", token, { httpOnly: true });

          res.json({ success: true, token });
        } else {
          return res
            .status(404)
            .json({ success: false, error: "User not found" });
        }
      } catch (error) {
        console.error("Error during token generation:", error);
        res
          .status(500)
          .json({ success: false, error: "Internal Server Error" });
      }
    });

    app.post("/account/login", async (req, res) => {
      const { userid, password } = req.body;

      try {
        const user = await userServices.findUserByName(userid);

        console.log("User:", user);

        if (user.length > 0 && user[0].password === password) {
          const token = generateAccessToken(userid);
          return res.json({ success: true, token });
        } else {
          return res
            .status(401)
            .json({ success: false, error: "Invalid username or password" });
        }
      } catch (error) {
        console.error("Error during login:", error);
        return res
          .status(500)
          .json({ success: false, error: "Internal Server Error" });
      }
    });

    app.get("/account/users", (req, res) => {
      res.json({ success: true, users });
    });

    // New route to get an individual user by username
    app.get("/account/users/:username", (req, res) => {
      const { username } = req.params;
      const user = users.find((u) => u.username === username);

      if (user) {
        res.json({ success: true, user });
      } else {
        res.status(404).json({ success: false, error: "User not found" });
      }
    });

    app.get("/api/userOrders", authenticateToken, (req, res) => {
      res.json({ success: true, message: "Authenticated successfully" });
    });

    app.get("/api/contacts", authenticateToken, async (req, res) => {
      try {
        // Retrieve contacts from the database using the new function
        const contacts = await userServices.getAllContacts();

        res.json({ success: true, contacts });
      } catch (error) {
        console.error("Error fetching contacts:", error);
        res
          .status(500)
          .json({ success: false, error: "Internal Server Error" });
      }
    });

    https
      .createServer(
        {
          key: fs.readFileSync("key.pem"),
          cert: fs.readFileSync("cert.pem"),
        },
        app
      )
      .listen(8000, () => {
        console.log("server is runing at port 8000");
      });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

startServer();
