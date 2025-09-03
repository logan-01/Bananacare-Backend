import express from "express";
import cors from "cors";
import scanRouter from "./routes/scan";
import uploadRouter from "./routes/upload";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//API Routes
app.use("/scan", scanRouter);
app.use("/upload", uploadRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
