const prisma = require("./prisma");

async function findAll(filter) {
  const where = {};
  if (filter && filter.type) {
    where.type = filter.type;
  }
  if (filter && filter.categoryId) {
    where.categoryId = filter.categoryId;
  }
  return prisma.meal.findMany({
    where,
    include: { category: true },
    orderBy: { nameEn: "asc" },
  });
}

async function findById(id) {
  return prisma.meal.findUnique({ where: { id }, include: { category: true } });
}

async function findByIds(ids) {
  return prisma.meal.findMany({ where: { id: { in: ids } } });
}

async function create(data) {
  return prisma.meal.create({ data });
}

async function update(id, data) {
  return prisma.meal.update({ where: { id }, data });
}

async function remove(id) {
  return prisma.meal.delete({ where: { id } });
}

async function hasOrders(id) {
  const count = await prisma.orderMeal.count({ where: { mealId: id } });
  return count > 0;
}

module.exports = { findAll, findById, findByIds, create, update, remove, hasOrders };
