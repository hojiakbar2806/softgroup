// import { Product } from "@/types/product";
// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// interface WishListState {
//   wishListItems: Product[];
//   toggleItem: (product: Product) => void;
//   hasInWishList: (productId: number) => boolean;
// }

// const useWishListStore = create<WishListState>()(
//   persist(
//     (set, get) => ({
//       wishListItems: [],

//       toggleItem: (product) =>
//         set((state) => {
//           const existingItemIndex = state.wishListItems.findIndex(
//             (item) => item.id === product.id
//           );
//           const updatedItems = [...state.wishListItems];

//           if (existingItemIndex !== -1) {
//             updatedItems.splice(existingItemIndex, 1);
//           } else {
//             updatedItems.push(product);
//           }

//           return { wishListItems: updatedItems };
//         }),

//       hasInWishList: (productId) => {
//         return get().wishListItems.some((item) => item.id === productId);
//       },
//     }),
//     {
//       name: "wishlist-store",
//       partialize: (state) => ({ wishListItems: state.wishListItems }),
//     }
//   )
// );

// export default useWishListStore;
