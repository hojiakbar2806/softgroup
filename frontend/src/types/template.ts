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
