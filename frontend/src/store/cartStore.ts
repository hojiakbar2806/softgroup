// import { Product } from "src/types/product";
import { create } from "zustand";
import { persist } from "zustand/middleware";
// import { toast } from "sonner";

export interface CartItem {
  // product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  cartDialog: boolean;
  setCartDialog: (isOpen: boolean) => void;
  // addItem: (product: Product) => void;
  // removeItem: (productId: number) => void;
  // clearCart: () => void;
  // getTotalPrice: () => number;
  // getItemCount: () => number;
  // incrementCartItem: (productId: number) => void;
  // decrementCartItem: (productId: number) => void;
}

const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      cartDialog: false,

      setCartDialog: (isOpen) => set({ cartDialog: isOpen }),

      // addItem: (product) =>
      //   set((state) => {
      //     const existingItemIndex = state.items.findIndex(
      //       (item) => item.product.id === product.id
      //     );
      //     if (existingItemIndex !== -1) {
      //       toast.success("Increased the number of products");
      //       const updatedItems = [...state.items];

      //       updatedItems[existingItemIndex] = {
      //         ...updatedItems[existingItemIndex],
      //         quantity: updatedItems[existingItemIndex].quantity + 1,
      //       };
      //       return { items: updatedItems };
      //     } else {
      //       toast.success("Product has been added to your cart");
      //       return { items: [...state.items, { product, quantity: 1 }] };
      //     }
      //   }),

      // removeItem: (productId) =>
      //   set((state) => ({
      //     items: state.items.filter((item) => item.product.id !== productId),
      //   })),

      // clearCart: () => set({ items: [] }),

      // getTotalPrice: () =>
      //   get().items.reduce(
      //     (total, item) => total + item.product.price * item.quantity,
      //     0
      //   ),

      // getItemCount: () =>
      //   get().items.reduce((count, item) => count + item.quantity, 0),

      // incrementCartItem: (productId) =>
      //   set((state) => {
      //     const updatedItems = state.items.map((item) =>
      //       item.product.id == productId
      //         ? { ...item, quantity: item.quantity + 1 }
      //         : item
      //     );
      //     return { items: updatedItems };
      //   }),

      // decrementCartItem: (productId) =>
      //   set((state) => {
      //     const updatedItems = state.items
      //       .map((item) => {
      //         if (item.product.id === productId) {
      //           if (item.quantity > 1) {
      //             return { ...item, quantity: item.quantity - 1 };
      //           } else {
      //             return null;
      //           }
      //         }
      //         return item;
      //       })
      //       .filter((item) => item !== null);

      //     return { items: updatedItems };
      //   }),
    }),
    {
      name: "cart-store",
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export default useCartStore;
