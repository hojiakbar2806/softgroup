import type {Metadata} from "next";
import "./globals.css";
import {Sora} from "next/font/google"

const sora = Sora({
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: "Softgroup info",
    description: "",
};

export default function RootLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`${sora.className} antialiased`}>
        {children}
        </body>
        </html>
    );
}
