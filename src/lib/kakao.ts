// Kakao JavaScript SDK 중 카카오톡 공유에 쓰는 부분만 선언
// https://developers.kakao.com/docs/latest/ko/message/js-link

export const KAKAO_SDK_URL = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js";
export const KAKAO_SDK_INTEGRITY = "sha384-dok87au0gKqJdxs7msEdBPNnKSRT+/mhTVzq+qOhcL464zXwvcrpjeWvyj1kCdq6";

type Link = { mobileWebUrl: string; webUrl: string };

type FeedTemplate = {
  objectType: "feed";
  content: { title: string; description: string; imageUrl: string; imageWidth?: number; imageHeight?: number; link: Link };
  buttons?: { title: string; link: Link }[];
};

type KakaoSdk = {
  init: (appKey: string) => void;
  isInitialized: () => boolean;
  Share: { sendDefault: (template: FeedTemplate) => void };
};

declare global {
  interface Window {
    Kakao?: KakaoSdk;
  }
}

export function initKakao() {
  const appKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
  const kakao = window.Kakao;
  if (!appKey || !kakao) return;
  if (!kakao.isInitialized()) kakao.init(appKey);
}

/** 공유 링크는 Kakao Developers > 플랫폼 > Web 사이트 도메인에 등록된 주소여야 열린다 */
export function shareToKakao(template: FeedTemplate) {
  const kakao = window.Kakao;
  if (!kakao?.isInitialized()) return false;
  kakao.Share.sendDefault(template);
  return true;
}
