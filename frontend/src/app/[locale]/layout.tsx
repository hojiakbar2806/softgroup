import type { Metadata } from "next";
import "../globals.css";
import { Sora } from "next/font/google";
import React from "react";
import { Toaster } from "sonner";
import CartDialog from "@/components/cartDialog/cartDialog";
import ReactQueryProvider from "@/lib/reactQueryProvider";
import { RTKProviders } from "@/lib/provider";
import LoginMessageModal from "@/components/common/loginMessageModal";
import { getDictionary } from "@/features/localization/getDictionary";

const sora = Sora({
  subsets: ["latin"],
});

type RootLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({
  children,
  params,
}: Readonly<RootLayoutProps>) {
  const locale = (await params).locale;
  const dictionary = await getDictionary();

  return (
    <html lang={locale}>
      <body className={sora.className}>
        <RTKProviders>
          <ReactQueryProvider>
            <main>{children}</main>
            <Toaster position="bottom-right" richColors />
            <CartDialog />
            <LoginMessageModal dictionary={dictionary} />
          </ReactQueryProvider>
        </RTKProviders>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL("http://templates.softgroup.uz"),
  title: "Softgroup - Innovatsion IT xizmatlari",
  icons: {
    icon: "/icons/favicon.svg",
  },
  description:
    "Sizning IT sohasidagi ehtiyojlaringiz uchun ishonchli hamkor! Bu innovatsion dasturiy ta'minot ishlab chiqarish va joriy etish bo'yicha mahsulot yaratuvchi,O'zbekistonda yangi va ilg'or uslubda xizmat ko'rsatish,ishlab chiqarish jarayonlarini avtomatlashtirish va biznesni yaratishga yordam beruvchi kompaniyadir.Biz bilan birgalikda biznesingizni global bozorda yuksaltirish osonroq!",
  keywords:
    "IT xizmatlari, veb-sayt, raqamli yechimlar, Softgroup, dasturiy ta'minot, biznes rivojlantirish, ishlab chiqarish avtomatlashtirish, raqamli transformatsiya, biznes yechimlari, ishlab chiqarish optimallashtirish, global biznes, xizmat ko'rsatish, ilg'or texnologiyalar, biznesni yuksaltirish, IT hamkorlik, innovatsion texnologiyalar, raqamli yechim, biznes yaratish, O'zbekiston IT, ilg'or xizmatlar, biznes texnologiyalari, veb dizayn, IT kompaniya, texnologik yechimlar, bulutli texnologiyalar, raqamli xizmatlar, veb-innovatsiyalar, smart yechimlar, raqamli marketing, o'zbekiston xizmatlari, raqamli iqtisodiyot, dasturiy xizmatlar, biznes jarayonlari, texnologik rivojlanish, avtomatlashtirish",
  authors: [{ name: "Softgroup", url: "https://softgroup.uz" }],
  robots: "index, follow",
  openGraph: {
    title: "Softgroup - Innovatsion IT xizmatlari",
    description:
      "Sizning IT sohasidagi ehtiyojlaringiz uchun ishonchli hamkor! Bu innovatsion dasturiy ta'minot ishlab chiqarish va joriy etish bo'yicha mahsulot yaratuvchi,O'zbekistonda yangi va ilg'or uslubda xizmat ko'rsatish,ishlab chiqarish jarayonlarini avtomatlashtirish va biznesni yaratishga yordam beruvchi kompaniyadir.Biz bilan birgalikda biznesingizni global bozorda yuksaltirish osonroq!",
    url: "http://templora.uz",
    siteName: "Softgroup",
    images: [
      {
        url: "http://templates.softgroup.uz/images/templates-og-image.png",
        width: 1200,
        height: 630,
        alt: "Softgroup Templates",
      },
    ],
    type: "website",
  },
  verification: {
    google: "emV-EXU3GWO_GujFkGMCi9DABaqmKifhSCErsDPgpsM",
  },
};
