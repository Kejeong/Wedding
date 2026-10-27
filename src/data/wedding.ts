// 청첩장에 들어가는 정적 콘텐츠. 문구·정보 수정은 이 파일에서만 한다.

export const couple = {
  groom: { en: "JESUNG", name: "송제성", father: "송영현", mother: "이정효", relation: "장남" },
  bride: { en: "EUNHYE", name: "김은혜", father: "김종우", mother: "박진희", relation: "장녀" },
} as const;

// 문단 단위 배열, 문단 안의 줄바꿈은 \n
export const greeting = [
  "서로를 마주하며 걸어온 5년의 시간,\n그 모든 계절이 오늘을 향해 있었습니다.",
  "추운 겨울 끝에 다가오는 봄처럼\n따스한 온기로 피어나는 저희의 시작을\n가장 아끼는 분들과 함께 나누고 싶습니다.",
  "그 소중한 시작의 자리에 함께하시어\n따뜻하게 빛내주시면 감사하겠습니다.",
] as const;

export const ceremony = {
  // KST 기준. 시간은 확정되면 수정
  date: new Date("2027-02-20T12:00:00+09:00"),
  dateDot: "2027.02.20",
  dateLabel: "2027년 2월 20일 토요일 오후 12시",
} as const;

export const venue = {
  name: "건대 스타시티 웨딩홀",
  address: "서울 광진구 능동로 110 스타시티영존 5F",
  // 검색 대신 좌표로 열어서 다른 웨딩홀이 잡히지 않게 한다 (카카오 주소 검색: 능동로 110 스타시티영존빌딩)
  kakaoMapUrl: "https://map.kakao.com/link/map/건대 스타시티 웨딩홀,37.540658,127.071412",
  transport: [
    {
      title: "주차",
      lines: ["건물 내 B1 - B5 : 2시간 무료", "건국대학교 병원 지상 · 지하 주차장 : 1시간 30분 무료"],
    },
    {
      title: "지하철",
      lines: ["2호선 건대입구역 2번출구 도보 3분", "7호선 건대입구역 3번출구 도보 1분"],
    },
    {
      title: "버스",
      lines: [
        "간선버스 : 240, 721, N61, N62",
        "지선버스 : 2016, 2222, 3217, 3220, 4212",
        "직행버스 : 102, 3500",
        "공항버스 : 6013",
      ],
    },
  ],
} as const;

export type Account = { label: string; bank: string; number: string };

export const accounts: { groom: Account[]; bride: Account[] } = {
  groom: [
    { label: "신랑 · 송제성", bank: "기업은행", number: "010-32243957" },
    { label: "아버지 · 송영현", bank: "국민은행", number: "618301-01-290848" },
    { label: "어머니 · 이정효", bank: "농협은행", number: "356-1191-7191-93" },
  ],
  bride: [
    { label: "신부 · 김은혜", bank: "하나은행", number: "115-910833-75807" },
    { label: "아버지 · 김종우", bank: "농협은행", number: "352-1536-3573-93" },
    { label: "어머니 · 박진희", bank: "우리은행", number: "683-087781-02-001" },
  ],
};

export const site = {
  title: "송제성 ♥ 김은혜 결혼합니다",
  description: "2027년 2월 20일 토요일, 건대 스타시티 웨딩홀",
  ogImage: "/images/og.jpg",
} as const;
