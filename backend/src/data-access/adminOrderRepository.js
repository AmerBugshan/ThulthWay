const prisma = require("./prisma");

async function findAll({ page = 1, limit = 20, subscriptionTypeId, dateFrom, dateTo, sortOrder = "desc" }) {
  const where = {};

  if (subscriptionTypeId) {
    where.subscriptionTypeId = subscriptionTypeId;
  }

  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom) where.createdAt.gte = new Date(dateFrom);
    if (dateTo) where.createdAt.lte = new Date(dateTo);
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        subscriptionType: true,
        plan: true,
        meals: {
          include: { meal: true },
          orderBy: [{ day: "asc" }, { slot: "asc" }],
        },
      },
      orderBy: { createdAt: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

async function remove(id) {
  return prisma.order.delete({ where: { id } });
}

module.exports = { findAll, remove };
