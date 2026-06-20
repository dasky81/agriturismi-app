"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const slides = [
  {
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80",
    alt: "Vigneto italiano al tramonto",
  },
  {
    url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80",
    alt: "Colline toscane dorate",
  },
  {
    url: "https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?w=1600&q=80",
    alt: "Frutteto in fiore campagna",
  },
  {
    url: "https://images.unsplash.com/photo-1471086569966-db3eebc25a59?w=1600&q=80",
    alt: "Lavanda in Provenza colline",
  },
  {
    url: "https://images.unsplash.com/photo-1543362906-acfc16c67564?w=1600&q=80",
    alt: "Uliveto mediterraneo tramonto",
  },
];

export default function HeroSlideshow() {
  const [slideAttivo, setSlideAttivo] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideAttivo((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[55vh] sm:h-[65vh] overflow-hidden">

      {/* ── Immagini ── */}
      {slides.map((slide, i) => (
        <div
          key={slide.url}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === slideAttivo ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.url}
            alt={slide.alt}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}

      {/* ── Overlay gradient ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

      {/* ── Testo centrato in basso ── */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center text-center px-4 pb-10 sm:pb-14 gap-4">

        {/* Eyebrow pill */}
        <span className="animate-fade-in-up inline-flex items-center px-3 py-1 rounded-full text-xs tracking-widest uppercase font-semibold text-white bg-[#2D6A4F]/80 border border-white/20">
          Motore di ricerca AI · Agriturismi italiani
        </span>

        {/* H1 */}
        <h1 className="animate-fade-in-up delay-100 text-4xl sm:text-6xl font-bold text-white drop-shadow-lg leading-tight max-w-3xl">
          Trova il tuo angolo d&apos;Italia
        </h1>

        {/* Sottotitolo */}
        <p className="animate-fade-in-up delay-200 text-base sm:text-xl text-white/80 max-w-xl drop-shadow">
          Descrivi la vacanza che sogni, l&apos;AI trova l&apos;agriturismo perfetto per te
        </p>
      </div>

      {/* ── Dots navigazione ── */}
      <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setSlideAttivo(i)}
            aria-label={`Vai alla slide ${i + 1}`}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === slideAttivo ? "bg-white scale-110" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
