import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Softgroup haqida - Missiya, qadriyatlar va kompaniya tarixi",
  description:
    "Softgroup kompaniyasining tarixini, missiyasini va qadriyatlarini bilib oling. Biz biznesingizni rivojlantirish uchun innovatsion yechimlar yaratishga intilamiz.",
  keywords:
    "Softgroup haqida, kompaniya tarixi, missiya, qadriyatlar, IT kompaniya O'zbekiston",
  robots: "index, follow",
  openGraph: {
    title: "Softgroup haqida - Missiya, qadriyatlar va kompaniya tarixi",
    description:
      "Softgroup kompaniyasining tarixini, missiyasini va qadriyatlarini bilib oling. Biz biznesingizni rivojlantirish uchun innovatsion yechimlar yaratishga intilamiz.",
    url: "https://info.softgroup.uz",
    siteName: "Softgroup Info",
    images: [
      {
        url: "https://softgroup-info.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Softgroup preview",
      },
    ],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
