import { Intro } from "@/components/Intro";
import { ToastProvider } from "@/components/Toast";
import { Accounts } from "@/components/sections/Accounts";
import { Ending } from "@/components/sections/Ending";
import { Gallery } from "@/components/sections/Gallery";
import { Guestbook } from "@/components/sections/Guestbook";
import { Hero } from "@/components/sections/Hero";
import { Invitation } from "@/components/sections/Invitation";
import { Location } from "@/components/sections/Location";
import { SaveTheDate } from "@/components/sections/SaveTheDate";

// 섹션 순서는 피그마 '청첩장_MO' 기준
export default function Home() {
  return (
    <ToastProvider>
      <Intro />
      <main className="bg-paper-texture mx-auto min-h-dvh max-w-[430px] overflow-x-hidden">
        <Hero />
        <SaveTheDate />
        <Invitation />
        <Location />
        <Accounts />
        <Guestbook />
        <Gallery />
        <Ending />
      </main>
    </ToastProvider>
  );
}
