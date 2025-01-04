"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronRightCircle } from "lucide-react";
import { GetAllTemplateService } from "@/services/template.service";
import { Template } from "@/types/template";
import TemplateCard from "@/components/common/templateCard/templateCard";
import { TemplateCardSkeleton } from "@/components/common/templateCard/templateCardSkeleton";
import TemplateCardWrapper from "@/components/common/templateCard/templateCardWrapper";

interface TemplateSectionProps {
  sectionTitle?: string;
}

const TemplateSection = ({ sectionTitle }: TemplateSectionProps) => {
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const categoryParam = `${category ? `category=${category}` : ""}`;

  const { data: templates, isLoading } = useQuery<Template[]>({
    queryKey: ["templates", categoryParam],
    queryFn: () => GetAllTemplateService(categoryParam),
  });

  return (
    <section className="flex-1 py-10 bg-blue-50">
      <div className="container px-4 mx-auto">
        {sectionTitle && (
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">{sectionTitle}</h1>
            <Link
              href="/"
              className="flex items-center gap-2 text-purple-500 hover:text-purple-600 transition-colors"
            >
              View all <ChevronRightCircle className="w-5 h-5" />
            </Link>
          </div>
        )}

        <TemplateCardWrapper>
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <TemplateCardSkeleton key={`skeleton-${index}`} />
            ))
          ) : templates && templates.length > 0 ? (
            templates.map((template) => (
              <TemplateCard key={template.id} product={template} />
            ))
          ) : (
            <h1 className="col-span-full font-semibold text-xl text-center py-8 text-gray-500">
              No templates found
            </h1>
          )}
        </TemplateCardWrapper>
      </div>
    </section>
  );
};

export default TemplateSection;
