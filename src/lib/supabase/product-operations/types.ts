
import { Category, Subcategory, Product } from '../types';

export interface ProductWithRelations extends Product {
  subcategory: Subcategory;
  category: Category;
}
