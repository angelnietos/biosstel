import type { ProductListResponse } from '@biosstel/shared-types';

export interface IProductosManagement {
  list(): Promise<ProductListResponse>;
}
