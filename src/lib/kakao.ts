// Kakao JavaScript SDK 중 카카오톡 공유에 쓰는 부분만 선언
// https://developers.kakao.com/docs/latest/ko/kakaotalk-share/js-link

export const KAKAO_SDK_URL = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js";
export const KAKAO_SDK_INTEGRITY = "sha384-dok87au0gKqJdxs7msEdBPNnKSRT+/mhTVzq+qOhcL464zXwvcrpjeWvyj1kCdq6";

type Link = { mobileWebUrl: string; webUrl: string };

// 기본 피드 템플릿: 이미지·문구·버튼을 코드에서 넣는다.
// 메시지 템플릿 빌더(sendCustom)에 올린 이미지는 모바일 카카오톡에서 보이지 않아,
// 우리 사이트에 올린 https JPG를 직접 지정하는 이 방식을 쓴다
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

/** 카드 속 링크는 Kakao Developers > 앱 > 플랫폼 > Web 사이트 도메인에 등록된 주소여야 열린다 */
export function shareToKakao(template: FeedTemplate) {
  const kakao = window.Kakao;
  if (!kakao?.isInitialized()) return false;
  kakao.Share.sendDefault(template);
  return true;
}
