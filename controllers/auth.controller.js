import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query } from "../database/db.js";
import { jwt_secret } from "../config/index.js";

// SignUp
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const result = await query(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [name, email, hashed, role],
    );

    res.json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// SingIn
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const users = await query("SELECT * FROM users WHERE email = ?", [email]);

    if (users.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    // Compare password
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, role: user.role }, jwt_secret, {
      expiresIn: "1d",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
