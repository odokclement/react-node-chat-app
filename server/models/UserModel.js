import { genSalt } from "bcrypt";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
    const salt = await genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
  }
);



const User = mongoose.model("Users", userSchema);
export default User;
export { userSchema }; // Export the schema if needed elsewhere
