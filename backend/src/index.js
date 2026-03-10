const express = require("express");
const cors = require("cors");
const { ensureBucket } = require("./s3");
const { notFoundHandler, errorHandler } = require("./middleware");

const subscriptionsRouter = require("./routes/subscriptions");
const mealsRouter = require("./routes/meals");
const ordersRouter = require("./routes/orders");
const adminRouter = require("./routes/admin");
const categoriesRouter = require("./routes/categories");

const app = express();
const PORT = process.env.API_PORT || 4000;

app.use(cors());
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────
app.use("/api/subscriptions", subscriptionsRouter);
app.use("/api/meals", mealsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/admin", adminRouter);

// Health check
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

// ── Error handling ──────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

// ── Start ───────────────────────────────────────────────────
async function start() {
  try {
    await ensureBucket();
    console.log("RustFS bucket initialized.");
  } catch (err) {
    console.warn("Warning: Could not initialize RustFS bucket:", err.message);
    console.warn("Will retry on first upload.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Tholth Way API running on port ${PORT}`);
  });
}

start();
