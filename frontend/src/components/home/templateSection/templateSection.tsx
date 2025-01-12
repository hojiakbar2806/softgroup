"use client";

import React, { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ChevronRightCircle } from "lucide-react";
import TemplateCard from "@/components/common/templateCard/templateCard";
import { TemplateCardSkeleton } from "@/components/common/templateCard/templateCardSkeleton";
import TemplateCardWrapper from "@/components/common/templateCard/templateCardWrapper";
import CustomPagination from "@/components/common/pagination";
import { useGetAllTemplatesQuery } from "@/services/templateService";
import { closeModal } from "@/features/modal/loginMessageModalSlice";
import { useDispatch } from "react-redux";

interface TemplateSectionProps {
  sectionTitle?: string;
}

const TemplateSection = ({ sectionTitle }: TemplateSectionProps) => {
  const searchParams = useSearchParams();
  const tier = searchParams.get("tier") || "free";
  const page = searchParams.get("page") || "1";

  const param = `tier=${tier}&page=${page}&per_page=12`;

  const { data: templates, isLoading } = useGetAllTemplatesQuery(param);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(closeModal());
  }, [dispatch]);

  return (
    <section className="flex-1 py-10 bg-blue-50">
      <div className="container px-4 mx-auto flex flex-col gap-4">
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
            Array.from({ length: 12 }).map((_, index) => (
              <TemplateCardSkeleton key={`skeleton-${index}`} />
            ))
          ) : templates?.data && templates.data.length > 0 ? (
            templates.data.map((template) => (
              <TemplateCard key={template.id} product={template} />
            ))
          ) : (
            <h1 className="col-span-full font-semibold text-xl text-center py-8 text-gray-500">
              No templates found
            </h1>
          )}
        </TemplateCardWrapper>
        {(templates?.total_pages || 1) > 1 && (
          <CustomPagination totalPages={templates?.total_pages || 1} />
        )}
      </div>
    </section>
  );
};

export default TemplateSection;
