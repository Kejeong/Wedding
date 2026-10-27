import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Pinyon_Script } from "next/font/google";
import { site } from "@/data/wedding";
import "./globals.css";

// Adobe Fonts kit이 없을 때 쓰는 대체 폰트
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: "400" });
const pinyon = Pinyon_Script({ variable: "--font-pinyon", subsets: ["latin"], weight: "400" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const adobeFontsKitId = process.env.NEXT_PUBLIC_ADOBE_FONTS_KIT_ID;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: site.title,
  description: site.description,
  // 카카오톡·문자 공유 미리보기
  openGraph: {
    type: "website",
    title: site.title,
    description: site.description,
    images: [{ url: site.ogImage, width: 1200, height: 630 }],
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f7f5f2",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${cormorant.variable} ${pinyon.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        {adobeFontsKitId && <link rel="stylesheet" href={`https://use.typekit.net/${adobeFontsKitId}.css`} />}
      </head>
      <body>{children}</body>
    </html>
  );
}
