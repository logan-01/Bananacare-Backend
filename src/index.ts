import express from "express";
import cors from "cors";
import scanRouter from "./routes/scan";
import uploadRouter from "./routes/upload";
import inquiriesRouter from "./routes/inquires";
import profileRouter from "./routes/profile";

// import authConfig from "./lib/auth";
// import { ExpressAuth } from "@auth/express";

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const HOST = "0.0.0.0";

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is working!");
});

//API Routes
app.use("/scan", scanRouter);
app.use("/upload", uploadRouter);
app.use("/inquiries", inquiriesRouter);
app.use("/profile", profileRouter);

// app.set("trust proxy", true);
// app.use("/auth", ExpressAuth(authConfig));

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
});
