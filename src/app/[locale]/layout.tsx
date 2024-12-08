import type { Metadata } from "next";
import "../globals.css";
import { Sora } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import React from "react";

const sora = Sora({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Softgroup - Innovatsion IT xizmatlari",
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
    url: "https://softgroup.uz",
    siteName: "Softgroup",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Softgroup logo",
      },
    ],
    type: "website",
  },
};

type RootLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout({
  children,
  params,
}: Readonly<RootLayoutProps>) {
  const locale = (await params).locale;
  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={messages}>
      <html lang={locale}>
        <body className={`${sora.className} antialiased`}>
          {React.cloneElement(children as React.ReactElement, { locale })}
        </body>
      </html>
    </NextIntlClientProvider>
  );
}
