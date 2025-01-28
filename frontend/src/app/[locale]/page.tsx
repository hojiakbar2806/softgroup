import { Fragment } from "react";
import Header from "@/components/common/header";
import HeroSection from "@/components/home/heroSection/heroSection";
import TemplateSection from "@/components/home/templateSection/templateSection";
import Footer from "@/components/home/footerSection/footer";
import { getDictionary } from "@/features/localization/getDictionary";

export default async function Home() {
  const dictionary = await getDictionary();
  return (
    <Fragment>
      <Header />
      <HeroSection dictionary={dictionary} />
      <TemplateSection />
      <Footer />
    </Fragment>
  );
}
