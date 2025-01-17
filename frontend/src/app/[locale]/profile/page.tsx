"use client";

import { CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";
import TemplateCardWrapper from "@/components/common/templateCard/templateCardWrapper";
import TemplateCard from "@/components/common/templateCard/templateCard";
import { TemplateCardSkeleton } from "@/components/common/templateCard/templateCardSkeleton";
import OpenSidebar from "@/components/profile/sidebar/openSidebar";
import { useGetUserTemplatesQuery } from "@/services/userService";

export default function Profile() {
  const router = useRouter();
  const { data, isLoading } = useGetUserTemplatesQuery();

  return (
    <section className="flex-1">
      <div className="container flex-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex gap-2 text-2xl font-bold">
            <OpenSidebar />
            <h1>Templates</h1>
          </div>
          <Button onClick={() => router.push("/profile/add-template")}>
            Add template
          </Button>
        </CardHeader>
        {isLoading ? (
          <TemplateCardWrapper>
            {Array.from({ length: 10 }).map((_, index) => (
              <TemplateCardSkeleton key={index} />
            ))}
          </TemplateCardWrapper>
        ) : (data?.length || 0) > 0 ? (
          <TemplateCardWrapper>
            {data?.map((template) => (
              <TemplateCard key={template.id} product={template} />
            ))}
          </TemplateCardWrapper>
        ) : (
          <div className="mt-10 text-center text-xl">No templates</div>
        )}
      </div>
    </section>
  );
}
