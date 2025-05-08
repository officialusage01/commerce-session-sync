
/**
 * Validates inputs for adding to cart
 */
export function validateAddToCartInput(userId: string, productId: string): void {
  // Basic validation
  if (!userId) {
    console.error('Cart Operations - No user ID provided');
    throw new Error('User ID is required');
  }
  
  if (!productId) {
    console.error('Cart Operations - No product ID provided');
    throw new Error('Product ID is required');
  }
}
