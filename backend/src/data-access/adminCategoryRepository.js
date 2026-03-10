const prisma = require("./prisma");

async function findAll() {
  return prisma.foodCategory.findMany({
    include: { _count: { select: { meals: true } } },
    orderBy: { nameEn: "asc" },
  });
}

async function findById(id) {
  return prisma.foodCategory.findUnique({ where: { id } });
}

async function create(data) {
  return prisma.foodCategory.create({ data });
}

async function update(id, data) {
  return prisma.foodCategory.update({ where: { id }, data });
}

async function remove(id) {
  return prisma.foodCategory.delete({ where: { id } });
}

async function hasMeals(id) {
  const count = await prisma.meal.count({ where: { categoryId: id } });
  return count > 0;
}

module.exports = { findAll, findById, create, update, remove, hasMeals };
