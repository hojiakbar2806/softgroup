import { getMessages } from "next-intl/server";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="scrollbar-none">{children}</div>;
}

export const metadata = async () => {
  const messages = (await getMessages()) as any;

  return {
    metadataBase: new URL("http://softgroup.uz"),
    title: messages.InfoPage.Meta.title,
    description: messages.InfoPage.Meta.description,
    keywords: messages.InfoPage.Meta.keywords,
    robots: "index, follow",
    openGraph: {
      title: messages.InfoPage.Meta.openGraph.title,
      description: messages.InfoPage.Meta.openGraph.description,
      url: "http://softgroup.uz",
      siteName: "Softgroup Info",
      images: [
        {
          url: "http://templates.softgroup.uz/images/info-og-image.png",
          width: 1200,
          height: 630,
          alt: "Softgroup Info",
        },
      ],
      type: "website",
    },
  };
};
