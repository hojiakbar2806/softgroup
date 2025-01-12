"use client";

import TemplateCard from "@/components/common/templateCard/templateCard";
import TemplateCardWrapper from "@/components/common/templateCard/templateCardWrapper";
import TitleCard from "@/components/profile/titleCard";
import { useGetMeQuery } from "@/services/userService";
import useWishListStore from "@/store/wishListStore";

export default function WishtlistPage() {
  const { wishListItems } = useWishListStore();
  const {} = useGetMeQuery();

  return (
    <section className="flex-1">
      <div className="container w-full">
        <TitleCard title="Wishlist" />
        {wishListItems.length > 0 ? (
          <TemplateCardWrapper>
            {wishListItems.map((item) => (
              <TemplateCard key={item.id} product={item} />
            ))}
          </TemplateCardWrapper>
        ) : (
          <div className="mt-10 text-center text-xl">No templates</div>
        )}
      </div>
    </section>
  );
}
