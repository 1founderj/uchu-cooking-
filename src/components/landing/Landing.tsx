import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { SITE } from "@/config/site";
import { BrushDefs } from "./primitives";
import { Nav } from "./Nav";
import { ClassInfo, Good, Hero, Marquee, Vibe } from "./SectionsTop";
import {
  Booking,
  ChiliCursor,
  Faq,
  FinalCta,
  Footer,
  Gallery,
  Proof,
  QuoteBand,
  Splash,
  StickyMobileCta,
  WhatsAppButton,
} from "./SectionsBottom";

function JsonLd() {
  const { t } = useTranslation(["seo", "faq"]);
  const faqs = t("faq:items", { returnObjects: true }) as { q: string; a: string }[];
  const data = [
    {
      "@context": "https://schema.org",
      "@type": "TouristTrip",
      name: t("seo:title"),
      description: t("seo:description"),
      touristType: ["Foodies", "Solo travelers", "Couples", "Families"],
      aggregateRating: { "@type": "AggregateRating", ratingValue: SITE.rating, reviewCount: SITE.reviewCount },
      offers: { "@type": "Offer", price: SITE.price, priceCurrency: SITE.currency, url: SITE.bookingUrl, availability: "https://schema.org/InStock" },
      provider: { "@type": "LocalBusiness", name: SITE.name, address: { "@type": "PostalAddress", addressLocality: "Arequipa", addressCountry: "PE" }, sameAs: [SITE.instagram, SITE.facebook] },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function Landing() {
  const heroRef = useRef<HTMLElement>(null);
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setPastHero(!e?.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // GA4 (optional): set VITE_GA_ID to enable. Loaded after hydration so it never blocks render.
  useEffect(() => {
    const id = import.meta.env["VITE_GA_ID"] as string | undefined;
    if (!id || document.getElementById("ga4")) return;
    const s = document.createElement("script");
    s.id = "ga4";
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(s);
    const w = window as unknown as { dataLayer: unknown[]; gtag: (...a: unknown[]) => void };
    w.dataLayer = w.dataLayer || [];
    w.gtag = (...a: unknown[]) => w.dataLayer.push(a);
    w.gtag("js", new Date());
    w.gtag("config", id);
  }, []);

  return (
    <>
      <Splash />
      <BrushDefs />
      <JsonLd />
      <Nav />
      <main id="main">
        <Hero ref={heroRef} />
        <Marquee />
        <Vibe />
        <Good />
        <ClassInfo />
        <Gallery />
        <QuoteBand />
        <Proof />
        <Booking />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <StickyMobileCta visible={pastHero} />
      <WhatsAppButton />
      <ChiliCursor />
    </>
  );
}
