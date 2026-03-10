const adminCategoryService = require("../services/adminCategoryService");

async function list(req, res) {
  const categories = await adminCategoryService.listCategories();
  res.json(categories);
}

async function create(req, res) {
  const category = await adminCategoryService.createCategory(req.body);
  res.status(201).json(category);
}

async function update(req, res) {
  const category = await adminCategoryService.updateCategory(req.params.id, req.body);
  res.json(category);
}

async function remove(req, res) {
  const result = await adminCategoryService.deleteCategory(req.params.id);
  res.json(result);
}

module.exports = { list, create, update, remove };
