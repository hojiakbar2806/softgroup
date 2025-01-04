import Header from "@/components/common/header";
import TemplateDetails from "@/components/templateDetail/templateDetail";
import Footer from "@/components/home/footer/footer";

type TemplateDetailProps = {
  params: Promise<{ slug: string }>;
};

export default async function TemplateDetailPage({
  params,
}: TemplateDetailProps) {
  const { slug } = await params;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <TemplateDetails slug={slug} />
      <Footer />
    </div>
  );
}
