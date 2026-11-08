import { GalleryCarousel } from "@/components/GalleryCarousel";
import { Reveal } from "@/components/Reveal";
import { SectionTitle } from "@/components/SectionTitle";
import { gallery } from "@/data/wedding";

// 사진이 아직 없을 때 보여줄 자리표시 장수 (피그마 카운터 01 / 30 기준)
const PLACEHOLDER_COUNT = 30;

export function Gallery() {
  return (
    <section className="mt-30">
      <SectionTitle title="GALLERY" spaced={false} />
      <Reveal className="mt-[34px]">
        <GalleryCarousel photos={gallery} placeholderCount={PLACEHOLDER_COUNT} />
      </Reveal>
    </section>
  );
}
