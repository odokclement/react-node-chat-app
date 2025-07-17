import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { compare } from "bcrypt";

const maxAge = 3 * 24 * 60 * 60 ; // 3 days 

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: maxAge , 
  });
};

export const signup = async (request, response, next) => {
  try {
    const { firstname, lastname, email, password } = request.body;
    // Validate input
    if (!firstname || !lastname || !email || !password) {
      return response.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const user = await User.create({
      firstname,
      lastname,
      email,
      password, // Password will be hashed in the User model pre-save hook
    });

    response.cookie("jwt", createToken(email, user._id), {
      maxAge: maxAge,
      secure: true, // Use secure cookies in production
      sameSite: "None",
    });

    return response.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in signup:", error);
    response.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (request, response, next) => {
  try {
    const { email, password } = request.body;

    // Validate input
    if (!email || !password) {
      return response.status(400).json({ message: "Email and password are required" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return response.status(400).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return response.status(400).json({ message: "Invalid email or password" });
    }

    response.cookie("jwt", createToken(email, user._id), {
      maxAge: maxAge,
      secure: true, // Use secure cookies in production
      sameSite: "None",
    });

    return response.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in login:", error);
    response.status(500).json({ message: "Internal server error" });
  }
};
