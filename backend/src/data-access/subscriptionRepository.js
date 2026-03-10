const prisma = require("./prisma");

async function findAllWithPlans() {
  return prisma.subscriptionType.findMany({
    include: {
      plans: {
        orderBy: { price: "asc" },
      },
    },
    orderBy: { nameEn: "asc" },
  });
}

module.exports = { findAllWithPlans };
