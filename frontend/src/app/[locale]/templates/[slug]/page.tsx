import Header from "@/components/common/header";
import TemplateDetails from "@/components/templateDetail/templateDetail";
import Footer from "@/components/home/footerSection/footer";
import { Fragment } from "react";
import { getDictionary } from "@/features/localization/getDictionary";

type TemplateDetailProps = {
  params: Promise<{ slug: string }>;
};

export default async function TemplateDetailPage({
  params,
}: TemplateDetailProps) {
  const { slug } = await params;
  const dictionary = await getDictionary();

  return (
    <Fragment>
      <Header />
      <TemplateDetails slug={slug} dictionary={dictionary} />
      <Footer />
    </Fragment>
  );
}
