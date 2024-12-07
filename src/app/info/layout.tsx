import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Softgroup haqida - Missiya, qadriyatlar va kompaniya tarixi",
  description:
    "Softgroup kompaniyasining tarixini, missiyasini va qadriyatlarini bilib oling. Biz biznesingizni rivojlantirish uchun innovatsion yechimlar yaratishga intilamiz.",
  keywords:
    "Softgroup haqida, kompaniya tarixi, missiya, qadriyatlar, IT kompaniya O'zbekiston",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
