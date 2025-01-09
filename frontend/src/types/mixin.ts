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

export interface ICategory {
  id: number;
  image_url: string;
  slug: string;
  translations: {
    title: string;
    language: string;
  }[];
}

export interface IUser {
  id: number;
  full_name: string;
  username: string;
  email: string;
  phone_number: string;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;

  showFirstLast?: boolean;
  showPageNumbers?: boolean;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;

  prevLabel?: string;
  nextLabel?: string;
  firstLabel?: string;
  lastLabel?: string;
}
