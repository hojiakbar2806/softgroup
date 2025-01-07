"use client";

import { CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/i18n/routing";
import TemplateCardWrapper from "@/components/common/templateCard/templateCardWrapper";
import TemplateCard from "@/components/common/templateCard/templateCard";
import { useQuery } from "@tanstack/react-query";
import { MyTemplatesService } from "@/services/user.service";
import { TemplateCardSkeleton } from "@/components/common/templateCard/templateCardSkeleton";
import { Template } from "@/types/template";
import OpenSidebar from "@/components/profile/sidebar/openSidebar";

export default function Profile() {
  const router = useRouter();
  const { data, isLoading } = useQuery<Template[]>({
    queryKey: ["template"],
    queryFn: MyTemplatesService,
  });

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
        <TemplateCardWrapper>
          {isLoading
            ? Array.from({ length: 10 }).map((_, index) => (
                <TemplateCardSkeleton key={index} />
              ))
            : data?.map((template) => (
                <TemplateCard
                  key={template.id}
                  product={template}
                  is_verified={template.is_verified}
                />
              ))}
        </TemplateCardWrapper>
      </div>
    </section>
  );
}
