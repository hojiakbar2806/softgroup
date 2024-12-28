export interface ISearchParams {
  category?: string;
  min_price?: string;
  max_price?: string;
  min_rating?: string;
  max_rating?: string;
  sort_by?: string;
  order_by?: "asc" | "desc";
  brand?: string;
  page_linit?: string;
  page?: string;
  color?: string;
  best_seller?: string;
}