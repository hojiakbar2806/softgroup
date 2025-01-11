import Header from "@/components/common/header";
import TemplateDetails from "@/components/templateDetail/templateDetail";
import Footer from "@/components/home/footerSection/footer";
import { Fragment } from "react";

type TemplateDetailProps = {
  params: Promise<{ slug: string }>;
};

export default async function TemplateDetailPage({
  params,
}: TemplateDetailProps) {
  const { slug } = await params;

  return (
    <Fragment>
      <Header />
      <TemplateDetails slug={slug} />
      <Footer />
    </Fragment>
  );
}
