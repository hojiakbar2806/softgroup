import TemplateCard from "@/components/common/templateCard/templateCard";
import TemplateCardWrapper from "@/components/common/templateCard/templateCardWrapper";
import { products } from "@/utils/const";
import { ChevronRightCircle } from "lucide-react";
import Link from "next/link";
import React, { FC } from "react";

type TemplateSectionProps = {
  sectionTitle: string;
};

const TemplateSection: FC<TemplateSectionProps> = ({ sectionTitle }) => {
  return (
    <section className="py-10 flex flex-col gap-6 bg-blue-50">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{sectionTitle}</h1>
        <Link href={"/"} className="flex items-center gap-2 text-purple-500">
          View all <ChevronRightCircle />
        </Link>
      </div>
      <TemplateCardWrapper>
        {products.map((product) => (
          <TemplateCard key={product.id} product={product} />
        ))}
        {products.map((product) => (
          <TemplateCard key={product.id} product={product} />
        ))}
        {products.map((product) => (
          <TemplateCard key={product.id} product={product} />
        ))}
        {products.map((product) => (
          <TemplateCard key={product.id} product={product} />
        ))}
      </TemplateCardWrapper>
    </section>
  );
};

export default TemplateSection;
