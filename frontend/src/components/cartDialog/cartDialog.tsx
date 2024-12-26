"use client";

// import CartDialogItems from "./items";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { redirect } from "next/navigation";
import useCartStore from "@/store/cartStore";
import DialogHeader from "../common/dialogHeader";
import DialogWrapper from "../common/dialog";

const CartDialog = (): JSX.Element => {
  const { setCartDialog, cartDialog, items } = useCartStore();
  // const totalPrice = getTotalPrice();

  return (
    <DialogWrapper
      dialogState={cartDialog ? "open" : "close"}
      onClose={() => setCartDialog(false)}
    >
      <DialogHeader setCartDialog={setCartDialog} title="Your Cart" />
      <div className="w-full flex flex-col gap-2 items-center">
        <div className="w-full p-2 flex flex-col gap-2">
          {/* {items.map((item) => (
            <CartDialogItems key={item.product.id} item={item} />
          ))} */}
        </div>
        {items.length > 0 && (
          <div className="w-full flex justify-between items-center p-2">
            <button
              className="px-6 flex items-center gap-2 font-bold text-lg py-3 rounded transition-colors text-primary
              hover:bg-accent/50"
              onClick={() => {
                setCartDialog(false);
                redirect("/cart");
              }}
            >
              <span>Go to Cart</span> <ArrowRight strokeWidth={2.75} />
            </button>
            {/* <h2 className="text-xl font-bold">Total: ${totalPrice}</h2> */}
          </div>
        )}
        {items.length === 0 && (
          <div className="flex items-center justify-center gap-4 ">
            <ShoppingCart strokeWidth={2.75} />
            <h1 className="text-xl font-medium">Your cart is empty</h1>
          </div>
        )}
      </div>
    </DialogWrapper>
  );
};

export default CartDialog;
