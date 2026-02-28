const productService = require('../services/productService');
const { success } = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getProducts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const categoryId = req.query.categoryId ? parseInt(req.query.categoryId, 10) : undefined;
  const minPrice = req.query.minPrice != null ? parseFloat(req.query.minPrice) : undefined;
  const maxPrice = req.query.maxPrice != null ? parseFloat(req.query.maxPrice) : undefined;
  const result = await productService.getList(page, limit, { categoryId, minPrice, maxPrice });
  return success(res, 200, result, 'Products fetched');
});

const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getById(parseInt(req.params.id, 10));
  return success(res, 200, product, 'Product fetched');
});

const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.create(req.body);
  return success(res, 201, product, 'Product created');
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.update(parseInt(req.params.id, 10), req.body);
  return success(res, 200, product, 'Product updated');
});

const deleteProduct = asyncHandler(async (req, res) => {
  await productService.remove(parseInt(req.params.id, 10));
  return success(res, 200, null, 'Product deleted');
});

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
