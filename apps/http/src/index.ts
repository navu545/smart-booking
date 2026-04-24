import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

import workerRoutes from "./routes/worker.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/user.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { connectWS } from "./lib/wsClient.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 100,
  }),
);
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    console.log(`${req.method} ${req.url} - ${Date.now() - start}ms`);
  });

  next();
});

app.use("/workers", workerRoutes);
app.use("/booking", bookingRoutes);
app.use("/admin", adminRoutes);
app.use("/users", userRoutes);

app.use(errorHandler);
connectWS();

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`HTTP server running on port ${PORT}`);
});