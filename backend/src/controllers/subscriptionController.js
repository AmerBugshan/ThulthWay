const subscriptionService = require("../services/subscriptionService");

async function list(_req, res) {
  const subscriptions = await subscriptionService.getAllSubscriptions();
  res.json(subscriptions);
}

module.exports = { list };
