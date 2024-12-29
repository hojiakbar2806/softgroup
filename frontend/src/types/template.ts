export interface Feature {
  text: string;
  available: boolean;
}

export interface TemplatePayload {
  title: string;
  current_price: number;
  original_price: number;
  description: string;
  features: Feature[];
  images: File[];
  template_file: File | null;
}

export interface Template {
  id: number;
  title: string;
  slug: string;
  description: string;
  original_price: number;
  current_price: number;
  rating: number;
  avarage_rating: number;
  ratingCount: number;
  views: number;
  images: {
    id: number;
    url: string;
  }[];
  features: {
    text: string;
    available: boolean;
  }[];
}
