const subscriptionRepository = require("../data-access/subscriptionRepository");

async function getAllSubscriptions() {
  return subscriptionRepository.findAllWithPlans();
}

module.exports = { getAllSubscriptions };
