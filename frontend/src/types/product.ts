export interface Product {
  id: number;
  img: string;
  title: string;
  price: number;
  oldPrice: number;
  rating: number;
  ratingCount: number;
  category: string;
  description: string;
  brand: string;
  discount: number;
}

export interface Product {
  id: number;
  img: string;
  title: string;
  price: number;
  oldPrice: number;
  rating: number;
  ratingCount: number;
  category: string;
  description: string;
  brand: string;
  discount: number;
}

export interface ICartProduct extends Product {
  quantity: number;
  totalPrice: number;
}

export interface ICart {
  products: ICartProduct[];
  totalPrice: number;
}

export interface Products {
  products: Product[];
}

export interface IAdsContent {
  title: string;
  discount: string;
  title_color: string;
  img: string;
  products: Product[];
}

export interface IBrandNews {
  brandName: string;
  product: Product;
  background: string;
}
