const dashboardService = require("../services/dashboardService");

async function getStats(req, res) {
  const { period } = req.query;
  const stats = await dashboardService.getStats(period || "30d");
  res.json(stats);
}

module.exports = { getStats };
