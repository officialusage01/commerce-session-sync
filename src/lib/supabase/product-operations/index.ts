
// Re-export all product operations
export { getProductById, getProduct } from './get-product';
export { getProducts, getFeaturedProducts } from './get-products';
export { createProduct, updateProduct, deleteProduct } from './crud-operations';
export type { ProductWithRelations } from './types';
