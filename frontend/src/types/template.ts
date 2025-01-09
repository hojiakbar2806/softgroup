export interface Feature {
  id: number;
  available: boolean;
  translations: {
    text: string;
    language: string;
  }[];
}

export interface Template {
  id: number;
  slug: string;
  current_price: number;
  original_price: number;
  downloads: number;
  avarage_rating: number;
  likes: number;
  views: number;
  ratings: number[];
  is_verified?: boolean;
  images: {
    id: number;
    url: string;
  }[];
  translations: {
    title: string;
    language: string;
    description: string;
  }[];
  features: Feature[];
}

export interface Templates {
  data: {
    id: number;
    slug: string;
    current_price: number;
    original_price: number;
    downloads: number;
    avarage_rating: number;
    likes: number;
    views: number;
    ratings: number[];
    is_verified?: boolean;
    images: {
      id: number;
      url: string;
    }[];
    translations: {
      title: string;
      language: string;
      description: string;
    }[];
    features: Feature[];
  }[];
  current_page: number;
  per_page: number;
  total_pages: number;
  total_templates: number;
  has_next: boolean;
  has_previous: boolean;
}
