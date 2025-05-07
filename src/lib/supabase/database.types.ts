
export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          icon: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          icon?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          icon?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      subcategories: {
        Row: {
          id: string;
          name: string;
          category_id: string;
          icon: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category_id: string;
          icon?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category_id?: string;
          icon?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          subcategory_id: string;
          stock: number;
          images: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          subcategory_id: string;
          stock: number;
          images?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          subcategory_id?: string;
          stock?: number;
          images?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      product_images: {
        Row: {
          id: string;
          url: string;
          public_id: string;
          filename: string;
          format: string;
          resource_type: string;
          created_at: string;
          product_id: string;
        };
        Insert: {
          id?: string;
          url: string;
          public_id?: string;
          filename?: string;
          format?: string;
          resource_type?: string;
          created_at?: string;
          product_id: string;
        };
        Update: {
          id?: string;
          url?: string;
          public_id?: string;
          filename?: string;
          format?: string;
          resource_type?: string;
          created_at?: string;
          product_id?: string;
        };
      };
      product_feedbacks: {
        Row: {
          id: string;
          product_id: string;
          user_id: string | null;
          rating: number;
          feedback_tags: string[];
          message: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          user_id?: string | null;
          rating: number;
          feedback_tags?: string[];
          message?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          user_id?: string | null;
          rating?: number;
          feedback_tags?: string[];
          message?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
