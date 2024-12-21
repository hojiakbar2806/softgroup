// "use client";

// import { Heart, Minus, Plus } from "lucide-react";
// import Image from "next/image";
// import useCartStore, { CartItem } from "@/store/cartStore";
// import useWishListStore from "src/store/wishListStore";

// const CartDialogItems = ({ item }: { item: CartItem }) => {
//   const { incrementCartItem, decrementCartItem } = useCartStore();
//   const { hasInWishList, toggleItem } = useWishListStore();

//   const hasWish = hasInWishList(item.product.id);

//   return (
//     <div className="w-full h-28 p-3 border rounded-sm flex justify-between gap-2">
//       <Image
//         className="w-1/3"
//         src={item.product.img}
//         alt="product image"
//         width={500}
//         height={350}
//       />
//       <div className="h-full flex-1 flex flex-col content-between justify-between">
//         <div className="flex justify-between items-center">
//           <h1 className="text-xl capitalize">{item.product.title}</h1>
//           <button onClick={() => toggleItem(item.product)}>
//             <Heart
//               strokeWidth={2.75}
//               stroke="red"
//               fill={hasWish ? "red" : "transparent"}
//             />
//           </button>
//         </div>

//         <div className="flex justify-between items-end">
//           <h1 className="text-xl text-primary">${item.product.price}</h1>
//           <div className="flex items-end border rounded-sm">
//             <button
//               className="p-1"
//               onClick={() => decrementCartItem(item.product.id)}
//             >
//               <Minus strokeWidth={2.75} />
//             </button>
//             <h1 className=" border-l border-r px-2 py-1">{item.quantity}</h1>
//             <button
//               className="p-1"
//               onClick={() => incrementCartItem(item.product.id)}
//             >
//               <Plus strokeWidth={2.75} />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CartDialogItems;
