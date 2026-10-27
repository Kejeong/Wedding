import { GalleryStack } from "@/components/GalleryStack";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";
import { gallery } from "@/data/wedding";

// 사진이 아직 없을 때 보여줄 자리표시 장수 (피그마 카운터 01 / 30 기준)
const PLACEHOLDER_COUNT = 30;

export function Gallery() {
  return (
    <section className="mt-30">
      <SectionTitle title="GALLERY" />
      <Reveal delay={0.32} className="mt-[60px]">
        <GalleryStack photos={gallery} placeholderCount={PLACEHOLDER_COUNT} />
      </Reveal>
    </section>
  );
}
