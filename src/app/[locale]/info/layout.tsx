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
    metadataBase: new URL("https://softgroup.uz"),
    title: messages.InfoPage.Meta.title,
    description: messages.InfoPage.Meta.description,
    keywords: messages.InfoPage.Meta.keywords,
    robots: "index, follow",
    openGraph: {
      title: messages.InfoPage.Meta.openGraph.title,
      description: messages.InfoPage.Meta.openGraph.description,
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
};
