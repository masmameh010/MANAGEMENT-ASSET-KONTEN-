
export interface Asset {
  id: string;
  sku: string; // Kode unik produk / ID manual
  name: string;
  imageUrl?: string;
  prompt: string;
  tagline: string;
  productInfo: string;
  caption: string;
  price: string;
  category: string;
  createdAt: number;
}

export type AssetField = keyof Omit<Asset, 'id' | 'createdAt' | 'imageUrl' | 'category' | 'name' | 'sku'>;

export interface ToastMessage {
  id: string;
  text: string;
  type: 'success' | 'info' | 'error';
}
