import { Fragment } from "react";
import Header from "@/components/common/header";
import HeroSection from "@/components/home/heroSection/heroSection";
import TemplateSection from "@/components/home/templateSection/templateSection";

export default async function Home() {
  return (
    <Fragment>
      <Header />
      <HeroSection />
      <TemplateSection sectionTitle="Recommendeds templates" />
      <TemplateSection sectionTitle="Trending templates" />
    </Fragment>
  );
}
