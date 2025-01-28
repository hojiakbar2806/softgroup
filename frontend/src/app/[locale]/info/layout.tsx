import { getDictionary } from "@/features/localization/getDictionary";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="scrollbar-none">{children}</div>;
}

export const metadata = async () => {
  const dict = await getDictionary();

  return {
    metadataBase: new URL("http://softgroup.uz"),
    title: dict.InfoPage.Meta.title,
    icons: {
      icon: "/icons/favicon.svg",
    },
    description: dict.InfoPage.Meta.description,
    keywords: dict.InfoPage.Meta.keywords,
    robots: "index, follow",
    openGraph: {
      title: dict.InfoPage.Meta.openGraph.title,
      description: dict.InfoPage.Meta.openGraph.description,
      url: "http://softgroup.uz",
      siteName: "Softgroup Info",
      images: [
        {
          url: "http://templora.uz/images/info-og-image.png",
          width: 1200,
          height: 630,
          alt: "Softgroup Info",
        },
      ],
      type: "website",
    },
  };
};
