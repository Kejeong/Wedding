import { SectionTitle } from "@/components/SectionTitle";

// TODO: 사진을 public/images/gallery/ 에 넣고 next/image 로 피그마 콜라주(약 25장) 배치
const PLACEHOLDERS = Array.from({ length: 6 }, (_, i) => i);

export function Gallery() {
  return (
    <section className="mt-30">
      <SectionTitle title="GALLERY" />
      <p className="mt-2.5 px-5 text-center font-display text-xs leading-tight text-muted">
        Thank you for celebrating with us. Our day begins right here.
      </p>
      <div className="mt-10 grid grid-cols-2 gap-2.5 px-5">
        {PLACEHOLDERS.map((i) => (
          <div key={i} className="flex aspect-[2/3] items-center justify-center bg-line text-xs text-muted">
            사진 {i + 1}
          </div>
        ))}
      </div>
    </section>
  );
}
