export type ProductInfo = {
  id: string;
  name: string;
  description: string;
  basePrice?: number;
  discountedPrice?: number;
  totalDiscountRate?: number;
  brand: {
    id: string;
    name: string;
    nameEn: string;
  };
};

export class ProductResponseDto {
  items: ProductInfo[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}
