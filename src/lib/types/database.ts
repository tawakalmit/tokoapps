export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          short_description: string;
          price: number;
          icon_url: string;
          screenshots: string[];
          apk_url: string;
          version: string;
          category: string;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      navigation_items: {
        Row: {
          id: string;
          label: string;
          href: string;
          position: 'navbar' | 'footer';
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['navigation_items']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['navigation_items']['Insert']>;
      };
      device_bindings: {
        Row: {
          id: string;
          product_id: string;
          device_id: string;
          binding_key: string;
          customer_email: string;
          is_active: boolean;
          created_at: string;
          expires_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['device_bindings']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['device_bindings']['Insert']>;
      };
      orders: {
        Row: {
          id: string;
          customer_email: string;
          product_id: string;
          device_id: string;
          status: 'pending' | 'paid' | 'completed' | 'cancelled';
          amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['orders']['Insert']>;
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['site_settings']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['site_settings']['Insert']>;
      };
    };
  };
}

export type Product = Database['public']['Tables']['products']['Row'];
export type NavigationItem = Database['public']['Tables']['navigation_items']['Row'];
export type DeviceBinding = Database['public']['Tables']['device_bindings']['Row'];
export type Order = Database['public']['Tables']['orders']['Row'];
