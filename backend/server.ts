import cookieParser from "cookie-parser";
import cors from "cors";
// import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.ts";

// // Load env vars
// dotenv.config();

// Connect to DB
connectDB();

const app = express();

// --- CORS CONFIG ---
const allowedOrigins = [
    "http://localhost:3000",
    process.env.FRONTEND_URL!, // Render frontend URL
].filter(Boolean); // remove undefined

const corsOptions = {
    origin: (origin: string | undefined, callback: any) => {
        // Allow REST tools or server-side
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        console.log("❌ Blocked CORS origin:", origin);
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

// Apply CORS before routes
app.use(cors(corsOptions));
// app.options("./*", cors(corsOptions)); // FIX: Express v5 requires "/*"

// Body & Cookies
app.use(express.json());
app.use(cookieParser());

// Routes
import authRouter from "./routes/authRoutes.ts";
import cartRouter from "./routes/cartRoutes.ts";
import orderRouter from "./routes/orderRoutes.ts";
import productRouter from "./routes/productRoutes.ts";

app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);

// Default route
app.get("/", (req, res) => {
    res.send("API running...");
});

const PORT = process.env.PORT! || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
