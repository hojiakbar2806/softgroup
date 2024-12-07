import { ParallexBackground } from "@/components/info/parallexBackground";
import { MissionLine } from "@/components/info/missionLine";
import { Header } from "@/components/info/header";
import Service from "@/components/info/service";
import { InfoFooter } from "@/components/info/footer";
import React from "react";
import ContactForm from "@/components/info/contactForm";

export default function InfoPage() {
  return (
    <React.Fragment>
      <ContactForm />
      <ParallexBackground />
      <div className="w-full flex flex-col z-10 px-2 sm:px-5 md:px-2 lg:px-6">
        <Header />
        <MissionLine />
        <Service />
        <InfoFooter />
      </div>
    </React.Fragment>
  );
}
