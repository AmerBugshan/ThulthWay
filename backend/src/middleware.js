const multer = require("multer");

// ── Custom error class for operational errors ────────────────
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

// ── Multer upload config ─────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// ── Async handler wrapper (Express 4 doesn't catch async rejections) ──
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// ── 404 handler for undefined routes ─────────────────────────
function notFoundHandler(req, res, _next) {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
}

// ── Global error handler ─────────────────────────────────────
function errorHandler(err, req, res, _next) {
  // Log every error with full context for debugging
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, {
    message: err.message,
    statusCode: err.statusCode || 500,
    stack: err.stack,
  });

  // Operational errors (AppError) — send the message to the client
  if (err.isOperational) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Unexpected / programmer errors — hide internals from the client
  res.status(500).json({ error: "Something went wrong. Please try again later." });
}

module.exports = { AppError, upload, asyncHandler, notFoundHandler, errorHandler };
