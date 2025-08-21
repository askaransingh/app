// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";

// dotenv.config();
// const app = express();
// app.use(express.json());
// app.use(cors());

// // MongoDB connect
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("✅ MongoDB Connected"))
//   .catch((err) => console.error(err));

// // User Schema
// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true }
// });
// const User = mongoose.model("User", userSchema);

// // Signup API
// // app.post("/signup", async (req, res) => {
// //   try {
// //     const { email, password } = req.body;
// //     const user = new User({ email, password });
// //     await user.save();
// //     res.json({ message: "Signup successful" });
// //   } catch (err) {
// //     res.status(400).json({ error: err.message });
// //   }
// // });
// app.post("/signup", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     const user = new User({ name, email, password });
//     await user.save();
//     res.json({ message: "Signup successful" });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });
// // Login API
// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email, password });
//     if (!user) return res.status(401).json({ error: "Invalid credentials" });
//     res.json({ message: "Login successful" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Start server
// // app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
// // app.listen(5000, "0.0.0.0", () => {
// //   console.log("🚀 Server running on http://0.0.0.0:5000");
// // });

// app.listen(5000, "0.0.0.0", () => {
//   console.log("🚀 Server running on http://0.0.0.0:5000");
// });
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI)
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ Mongo error:", err));

// ✅ User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// ✅ Signup API
app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.json({ message: "Signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Start server
const PORT = 7003;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`)
);