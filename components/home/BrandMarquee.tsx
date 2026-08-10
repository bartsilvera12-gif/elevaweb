"use client";
import MarqueeAlongSvgPath from "@/components/ui/marquee-along-svg-path";

const path =
  "M1 209.434C58.5872 255.935 387.926 325.938 482.583 209.434C600.905 63.8051 525.516 -43.2211 427.332 19.9613C329.149 83.1436 352.902 242.723 515.041 267.302C644.752 286.966 943.56 181.94 995 156.5";

const brands = [
  { slug: "samsung", name: "Samsung" },
  { slug: "apple", name: "Apple" },
  { slug: "nike", name: "Nike" },
  { slug: "adidas", name: "Adidas" },
  { slug: "sony", name: "Sony" },
  { slug: "lg", name: "LG" },
  { slug: "xiaomi", name: "Xiaomi" },
  { slug: "hp", name: "HP" },
  { slug: "dell", name: "Dell" },
  { slug: "philips", name: "Philips" },
  { slug: "huawei", name: "Huawei" },
  { slug: "panasonic", name: "Panasonic" },
  { slug: "lenovo", name: "Lenovo" },
  { slug: "asus", name: "Asus" },
];

export default function BrandMarquee() {
  return (
    <section className="bg-white border-y border-[color:var(--color-line-soft)]">
      <div className="container-eleva py-10">
        <div className="text-center text-xs font-bold tracking-[0.14em] uppercase text-[color:var(--color-muted)] mb-4">
          Marcas que ya están en ELEVA
        </div>
        <div className="h-[220px] md:h-[280px]">
          <MarqueeAlongSvgPath
            path={path}
            viewBox="0 0 996 330"
            baseVelocity={7}
            slowdownOnHover
            draggable
            repeat={2}
            dragSensitivity={0.1}
            className="w-full h-full"
            responsive
            grabCursor
          >
            {brands.map((b) => (
              <div key={b.slug} className="w-16 h-16 flex items-center justify-center hover:scale-125 transition-transform duration-300 ease-in-out">
                {}
                <img
                  src={`https://cdn.simpleicons.org/${b.slug}/240453`}
                  alt={b.name}
                  className="w-full h-full object-contain"
                  draggable={false}
                />
              </div>
            ))}
          </MarqueeAlongSvgPath>
        </div>
      </div>
    </section>
  );
}
