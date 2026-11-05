import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Pinyon_Script } from "next/font/google";
import { site } from "@/data/wedding";
import "./globals.css";

// Adobe Fonts kit이 없을 때 쓰는 대체 폰트
const cormorant = Cormorant_Garamond({ variable: "--font-cormorant", subsets: ["latin"], weight: "400" });
const pinyon = Pinyon_Script({ variable: "--font-pinyon", subsets: ["latin"], weight: "400" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
// IvyOra Display · Altesse Std 웹 프로젝트 (Adobe Fonts > 웹 프로젝트에서 이 사이트 도메인을 허용해야 보인다)
const adobeFontsKitId = process.env.NEXT_PUBLIC_ADOBE_FONTS_KIT_ID || "pew6wbl";

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
  // 아이폰 Safari는 16px보다 작은 입력칸(방명록 14px)을 누르면 화면을 확대하고 되돌리지 않는다.
  // 최대 배율을 1로 막아 자동 확대를 없앤다 (iOS는 이 값과 상관없이 손가락 확대는 계속 허용한다)
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#f7f5f2",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  // suppressHydrationWarning: 브라우저 확장(예: 한컴 HWP 뷰어 data-hwp-extension)이 <html>에 속성을 붙여 생기는
  // hydration 경고만 무시한다. 이 태그 한 단계에만 적용되고 안쪽 내용의 불일치는 그대로 알려준다
  return (
    <html lang="ko" className={`${cormorant.variable} ${pinyon.variable}`} suppressHydrationWarning>
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
