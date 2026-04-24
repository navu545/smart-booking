import express from "express";
import cors from "cors";
import dotenv from "dotenv";

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

app.use("/workers", workerRoutes);
app.use("/booking", bookingRoutes);
app.use("/admin", adminRoutes);
app.use("/users", userRoutes);

app.use(errorHandler);
connectWS();

app.listen(3001, () => {
  console.log("HTTP server running on port 3001");
});
