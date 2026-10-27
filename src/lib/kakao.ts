// Kakao JavaScript SDK 중 카카오톡 공유에 쓰는 부분만 선언
// https://developers.kakao.com/docs/latest/ko/kakaotalk-share/js-link

export const KAKAO_SDK_URL = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js";
export const KAKAO_SDK_INTEGRITY = "sha384-dok87au0gKqJdxs7msEdBPNnKSRT+/mhTVzq+qOhcL464zXwvcrpjeWvyj1kCdq6";

// 메시지 템플릿 빌더(Kakao Developers > 도구 > 메시지 템플릿)에서 만든 템플릿으로 보낸다
// templateArgs: 템플릿에 ${이름} 으로 넣은 사용자 인자 값
type CustomTemplate = { templateId: number; templateArgs?: Record<string, string> };

type KakaoSdk = {
  init: (appKey: string) => void;
  isInitialized: () => boolean;
  Share: { sendCustom: (template: CustomTemplate) => void };
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

/** 템플릿 속 링크는 Kakao Developers > 앱 > 플랫폼 > Web 사이트 도메인에 등록된 주소여야 열린다 */
export function shareToKakao(template: CustomTemplate) {
  const kakao = window.Kakao;
  if (!kakao?.isInitialized()) return false;
  kakao.Share.sendCustom(template);
  return true;
}
