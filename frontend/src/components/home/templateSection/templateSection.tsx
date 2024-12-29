"use client";

import TemplateCard from "@/components/common/templateCard/templateCard";
import { TemplateCardSkeleton } from "@/components/common/templateCard/templateCardSkeleton";
import TemplateCardWrapper from "@/components/common/templateCard/templateCardWrapper";
import { GetAllTemplateService } from "@/services/template.service";
import { Template } from "@/types/template";
import { useQuery } from "@tanstack/react-query";
import { ChevronRightCircle } from "lucide-react";
import Link from "next/link";
import React, { FC } from "react";

type TemplateSectionProps = {
  sectionTitle: string;
};

const TemplateSection: FC<TemplateSectionProps> = ({ sectionTitle }) => {
  const { data = null, isLoading } = useQuery<Template[]>({
    queryKey: ["templates"],
    queryFn: GetAllTemplateService,
  });

  return (
    <section className="py-10 flex flex-col gap-6 bg-blue-50">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{sectionTitle}</h1>
        <Link href={"/"} className="flex items-center gap-2 text-purple-500">
          View all <ChevronRightCircle />
        </Link>
      </div>
      <TemplateCardWrapper>
        {isLoading
          ? Array.from({ length: 10 }).map((_, index) => (
              <TemplateCardSkeleton key={index} />
            ))
          : data?.map((product) => (
              <TemplateCard key={product.id} product={product} />
            ))}
      </TemplateCardWrapper>
    </section>
  );
};

export default TemplateSection;
