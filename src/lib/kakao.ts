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
  Share: {
    sendDefault: (template: FeedTemplate) => void;
    // 외부 이미지를 카카오 서버로 가져와 카카오 CDN 주소를 돌려준다
    scrapImage: (settings: { imageUrl: string }) => Promise<{ infos: { original: { url: string } } }>;
  };
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

// 공유 카드 이미지의 카카오 CDN 주소 (원본 주소별로 한 번만 가져온다)
const kakaoImageCache = new Map<string, Promise<string>>();

/**
 * 공유 이미지를 카카오 서버에 미리 올려 둔다.
 * 우리 사이트(vercel.app) 주소를 그대로 넘기면 모바일 카카오톡에서 이미지를 못 가져와 빈 카드가 되는 경우가 있어,
 * 카카오 CDN(kakaocdn.net) 주소로 바꿔서 보낸다. 실패하면 원래 주소를 그대로 쓴다.
 * 모바일은 버튼을 누른 그 순간에 바로 공유창을 열어야 해서, 페이지가 열릴 때 미리 호출해 둔다
 */
export function prepareKakaoImage(imageUrl: string): Promise<string> {
  const kakao = window.Kakao;
  if (!kakao?.isInitialized()) return Promise.resolve(imageUrl);
  let cached = kakaoImageCache.get(imageUrl);
  if (!cached) {
    cached = kakao.Share.scrapImage({ imageUrl })
      // 카카오가 http 주소를 돌려줘서 https로 바꾼다 (모바일에서 http 이미지가 막히지 않게)
      .then((res) => res.infos.original.url?.replace(/^http:/, "https:") || imageUrl)
      .catch(() => {
        kakaoImageCache.delete(imageUrl);
        return imageUrl;
      });
    kakaoImageCache.set(imageUrl, cached);
  }
  return cached;
}

/** 카드 속 링크는 Kakao Developers > 앱 > 플랫폼 > Web 사이트 도메인에 등록된 주소여야 열린다 */
export function shareToKakao(template: FeedTemplate) {
  const kakao = window.Kakao;
  if (!kakao?.isInitialized()) return false;
  kakao.Share.sendDefault(template);
  return true;
}
