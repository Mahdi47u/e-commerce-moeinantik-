export type CartItem = {
  id: number;
  productId: number;
  productName: string;
  productSlug: string;
  productVariantId: number;
  variantTitle: string;
  sku?: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  imageUrl?: string | null;
};

export type Cart = {
  id: number;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
};
