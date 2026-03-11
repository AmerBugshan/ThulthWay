const adminOrderRepo = require("../data-access/adminOrderRepository");

async function listOrders(query) {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 20;
  const { subscriptionTypeId, dateFrom, dateTo, sortOrder } = query;

  return adminOrderRepo.findAll({
    page,
    limit,
    subscriptionTypeId,
    dateFrom,
    dateTo,
    sortOrder: sortOrder || "desc",
  });
}

async function deleteOrder(id) {
  return adminOrderRepo.remove(id);
}

module.exports = { listOrders, deleteOrder };
