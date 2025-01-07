"use client";

import TemplateCard from "@/components/common/templateCard/templateCard";
import TemplateCardWrapper from "@/components/common/templateCard/templateCardWrapper";
import TitleCard from "@/components/profile/titleCard";
import useWishListStore from "@/store/wishListStore";

export default function WishtlistPage() {
  const { wishListItems } = useWishListStore();

  return (
    <section className="flex-1">
      <div className="container w-full">
        <TitleCard title="Wishlist" />
        <TemplateCardWrapper>
          {wishListItems.map((item) => (
            <TemplateCard
              key={item.id}
              product={item}
              is_verified={item.is_verified}
            />
          ))}
        </TemplateCardWrapper>
      </div>
    </section>
  );
}
