import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// 📁 Read DB
const getDB = () => {
    const data = fs.readFileSync("./db.json");
    return JSON.parse(data);
};

// 💾 Write DB
const saveDB = (data) => {
    fs.writeFileSync("./db.json", JSON.stringify(data, null, 2));
};

// ✅ ROOT
app.get("/", (req, res) => {
    res.json({
        message: "🚀 BrainCMS API Running...",
        status: "success"
    });
});

// ✅ FULL DB VIEW (YEH TU CHAAH RAHA THA)
app.get("/api/db", (req, res) => {
    const db = getDB();
    res.json(db);
});

// ✅ REGISTER
app.post("/api/auth/register", (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json("All fields are required");
    }

    const db = getDB();

    const existingUser = db.auth.find((u) => u.email === email);
    if (existingUser) {
        return res.status(400).json("User already exists");
    }

    const newUser = {
        id: Date.now().toString(),
        fullName,
        email,
        password,
        status: "active",
        role: "user",
        createdAt: new Date().toISOString()
    };

    db.auth.push(newUser);
    saveDB(db);

    res.status(201).json("User registered successfully");
});

// ✅ LOGIN
app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;

    const db = getDB();

    const user = db.auth.find((u) => u.email === email);

    if (!user || user.password !== password) {
        return res.status(401).json("Invalid credentials");
    }

    res.json({
        message: "Login successful",
        user
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});