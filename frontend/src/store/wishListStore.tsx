import { Template } from "@/types/template";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishListState {
  wishListItems: Template[];
  toggleItem: (template?: Template) => void;
  hasInWishList: (templateId?: number) => boolean;
}

const useWishListStore = create<WishListState>()(
  persist(
    (set, get) => ({
      wishListItems: [],

      toggleItem: (template) =>
        set((state) => {
          const existingItemIndex = state.wishListItems.findIndex(
            (item) => item.id === template?.id
          );
          const updatedItems = [...state.wishListItems];

          if (existingItemIndex !== -1) {
            updatedItems.splice(existingItemIndex, 1);
          } else {
            if (template) {
              updatedItems.push(template);
            }
          }

          return { wishListItems: updatedItems };
        }),

      hasInWishList: (templateId) => {
        return get().wishListItems.some((item) => item.id === templateId);
      },
    }),
    {
      name: "wishlist-store",
      partialize: (state) => ({ wishListItems: state.wishListItems }),
    }
  )
);

export default useWishListStore;
