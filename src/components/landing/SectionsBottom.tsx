import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, Facebook, Instagram, MessageCircle, Minus, Plus, X } from "lucide-react";
import { SITE, formatPrice } from "@/config/site";
import { GALLERY, MEDIA, type GalleryCategory } from "@/data/media";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./Nav";
import { Counter, EASE, FadeIn, MagneticLink, RevealWords, SectionLabel, Stamp } from "./primitives";

/* ---------------- 03 Gallery ---------------- */
const CATS: GalleryCategory[] = ["kitchen", "process", "feast", "people"];

export function Gallery() {
  const { t } = useTranslation("home");
  const [cat, setCat] = useState<GalleryCategory | "all">("all");
  const [idx, setIdx] = useState<number | null>(null);
  const items = GALLERY.filter((g) => cat === "all" || g.cat === cat);

  const go = useCallback(
    (d: number) => setIdx((i) => (i === null ? i : (i + d + items.length) % items.length)),
    [items.length],
  );
  useEffect(() => {
    if (idx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIdx(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, go]);

  const active = idx !== null ? items[idx] : null;

  return (
    <section id="gallery" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionLabel>{t("gallery.label")}</SectionLabel>
        <RevealWords as="h2" text={t("gallery.title")} className="h-display h2-fluid mt-6 block text-olive" />
        <p className="mt-4 max-w-xl text-lg text-brown-soft">{t("gallery.subtitle")}</p>

        <div className="mt-8 flex flex-wrap gap-2" role="group">
          {(["all", ...CATS] as const).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
              className={cn(
                "rounded-full px-5 py-2 font-display text-lg tracking-wide uppercase transition-colors",
                cat === c ? "bg-olive text-cream" : "bg-cream-deep text-ink hover:bg-sage",
              )}
            >
              {c === "all" ? t("gallery.all") : t(`gallery.filters.${c}`)}
            </button>
          ))}
        </div>

        <motion.ul layout className="mt-10 columns-2 gap-4 md:columns-3 md:gap-6">
          <AnimatePresence mode="popLayout">
            {items.map((g, i) => (
              <motion.li
                layout
                key={g.key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.05 }}
                className="mb-4 break-inside-avoid md:mb-6"
              >
                <button
                  type="button"
                  onClick={() => setIdx(i)}
                  data-cursor="view"
                  data-cursor-label={t("gallery.view")}
                  className="block w-full rounded-lg bg-cream p-2 pb-8 shadow-warm transition-transform duration-300 hover:z-10 hover:scale-[1.03] hover:rotate-0"
                  style={{ rotate: `${[-2, 1.5, -1, 2, -1.5, 1][i % 6]}deg` }}
                >
                  <img
                    src={g.src}
                    alt={t(`gallery.photos.${g.key}`)}
                    loading="lazy"
                    className={cn("w-full rounded object-cover", g.tall ? "aspect-[3/4]" : "aspect-[4/3]")}
                  />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t(`gallery.photos.${active.key}`)}
            className="fixed inset-0 z-[75] flex items-center justify-center bg-ink/90 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIdx(null)}
          >
            <motion.img
              key={active.key}
              src={active.src}
              alt={t(`gallery.photos.${active.key}`)}
              className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-lift"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 24 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) go(1);
                else if (info.offset.x > 60) go(-1);
              }}
              onClick={(e) => e.stopPropagation()}
            />
            <button type="button" aria-label={t("gallery.close")} onClick={() => setIdx(null)} className="absolute top-4 right-4 grid size-12 place-items-center rounded-full bg-cream text-ink">
              <X aria-hidden="true" />
            </button>
            <button type="button" aria-label={t("gallery.prev")} onClick={(e) => { e.stopPropagation(); go(-1); }} className="absolute left-3 grid size-12 place-items-center rounded-full bg-cream/90 text-ink">
              <ChevronLeft aria-hidden="true" />
            </button>
            <button type="button" aria-label={t("gallery.next")} onClick={(e) => { e.stopPropagation(); go(1); }} className="absolute right-3 grid size-12 place-items-center rounded-full bg-cream/90 text-ink">
              <ChevronRight aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------------- Quote band ---------------- */
export function QuoteBand() {
  const { t } = useTranslation("home");
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["8%", "-8%"]);
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [80, -80]);
  return (
    <section ref={ref} className="relative overflow-hidden bg-forest py-28 text-cream md:py-40">
      <motion.span style={{ y }} className="absolute top-10 left-[6%] text-6xl" aria-hidden="true">🌶️</motion.span>
      <motion.span style={{ y }} className="absolute right-[8%] bottom-10 text-6xl" aria-hidden="true">🍋</motion.span>
      <motion.blockquote style={{ x }} className="h-display mx-auto max-w-6xl px-4 text-center text-[clamp(3rem,9vw,8rem)]">
        {t("quote.pre")} <span className="text-peach">{t("quote.hl1")}</span> {t("quote.mid")}{" "}
        <span className="text-peach">{t("quote.hl2")}</span> {t("quote.post")}
      </motion.blockquote>
      <Stamp text={t("hero.stamp")} className="absolute right-6 -bottom-4 hidden md:block" />
    </section>
  );
}

/* ---------------- Social proof ---------------- */
export function Proof() {
  const { t } = useTranslation("home");
  const reviewHref = SITE.getYourGuideUrl || SITE.bookingUrl;
  return (
    <section className="py-24">
      <div className="mx-auto max-w-5xl px-4 text-center md:px-8">
        <p className="font-hand text-2xl text-aji-red">{t("proof.kicker")}</p>
        <div className="mt-6 flex flex-wrap items-end justify-center gap-10 md:gap-20">
          <div>
            <p className="h-display text-[clamp(6rem,16vw,11rem)] text-olive">
              <span className="text-aji-orange" aria-hidden="true">★</span>
              <Counter to={SITE.rating} decimals={1} />
            </p>
            <p className="font-bold text-brown-soft">{t("proof.ratingLabel")}</p>
          </div>
          <div>
            <p className="h-display text-[clamp(6rem,16vw,11rem)] text-olive">
              <Counter to={SITE.reviewCount} />
            </p>
            <p className="font-bold text-brown-soft">{t("proof.reviewsLabel")}</p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <span className="rounded-full bg-aji-red px-5 py-2 text-sm font-bold text-cream">
            {t("proof.deal", { pct: SITE.savingsPct })}
          </span>
          <span className="rounded-full bg-lime px-5 py-2 text-sm font-bold text-forest">⚡ {t("proof.instant")}</span>
        </div>
        <a
          href={reviewHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block font-semibold text-olive underline decoration-aji-orange decoration-2 underline-offset-4"
        >
          {t("proof.reviewsLink")} ↗
        </a>

        {SITE.showTestimonials && SITE.testimonials.length > 0 && (
          <div className="mt-16">
            <h3 className="h-display text-4xl text-ink">{t("proof.testimonialsTitle")}</h3>
            <ul className="mt-6 flex snap-x gap-4 overflow-x-auto">
              {SITE.testimonials.map((r) => (
                <li key={r.author} className="w-80 shrink-0 snap-center rounded-3xl bg-cream-deep p-6 text-left shadow-warm">
                  <p>“{r.quote}”</p>
                  <p className="mt-3 font-bold">— {r.author}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------- 04 Booking ---------------- */
export function Booking() {
  const { t, i18n } = useTranslation("home");
  const [lang, setLang] = useState<"es" | "en">("en");
  const [adults, setAdults] = useState(2);
  const micro = t("booking.micro", { returnObjects: true }) as string[];
  const checklist = t("booking.checklist", { returnObjects: true }) as string[];
  const fmt = (v: number) => formatPrice(v, i18n.language);
  return (
    <section id="booking" className="bg-cream-deep/60 py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 md:px-8 lg:grid-cols-[1fr_440px]">
        <div>
          <SectionLabel>{t("booking.label")}</SectionLabel>
          <RevealWords as="h2" text={t("booking.title")} className="h-display h2-fluid mt-6 block text-olive" />
          <p className="mt-5 max-w-xl text-lg text-brown-soft">{t("booking.text")}</p>
          <ul className="mt-8 space-y-3">
            {checklist.map((c) => (
              <li key={c} className="flex gap-3 rounded-2xl bg-sage p-4 text-ink">
                <span aria-hidden="true">📍</span>
                {c}
              </li>
            ))}
          </ul>
          <div className="relative mt-10 aspect-[4/3] max-w-lg overflow-hidden rounded-[28px] shadow-warm">
            <img src={MEDIA.steps[2]} alt="" loading="lazy" className="size-full object-cover" />
          </div>
        </div>

        <FadeIn className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[32px] bg-cream p-7 shadow-lift md:p-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-brown-soft uppercase">{t("booking.from")}</p>
                <p className="flex items-baseline gap-3">
                  <span className="h-display text-7xl text-ink">{fmt(SITE.price)}</span>
                  <s className="font-display text-3xl text-brown-soft/70">{fmt(SITE.priceOld)}</s>
                </p>
                <p className="text-brown-soft">{t("booking.perPerson")}</p>
              </div>
              <span className="rotate-6 rounded-full bg-aji-red px-3 py-1 font-display text-2xl text-cream">-{SITE.savingsPct}%</span>
            </div>

            <fieldset className="mt-6">
              <legend className="text-sm font-bold text-ink">{t("booking.langLabel")}</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(["es", "en"] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    aria-pressed={lang === l}
                    onClick={() => setLang(l)}
                    className={cn(
                      "rounded-2xl border-2 p-3 text-left transition-colors",
                      lang === l ? "border-olive bg-sage" : "border-border hover:border-olive/50",
                    )}
                  >
                    <span className="block font-bold text-ink">{l === "es" ? t("booking.langEs") : t("booking.langEn")}</span>
                    <span className="text-sm text-brown-soft">{l === "es" ? t("booking.langEsWho") : t("booking.langEnWho")}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mt-5 flex items-center justify-between rounded-2xl bg-cream-deep p-3">
              <span className="font-bold text-ink">{t("booking.adultsLabel")}</span>
              <div className="flex items-center gap-3">
                <button type="button" aria-label={t("booking.adultsDecrease")} onClick={() => setAdults((a) => Math.max(1, a - 1))} className="grid size-10 place-items-center rounded-full bg-cream text-ink hover:bg-sage">
                  <Minus className="size-4" aria-hidden="true" />
                </button>
                <motion.span key={adults} initial={{ scale: 1.4 }} animate={{ scale: 1 }} className="w-8 text-center font-display text-3xl" aria-live="polite">
                  {adults >= SITE.maxGuests - 1 ? `${SITE.maxGuests - 1}+` : adults}
                </motion.span>
                <button type="button" aria-label={t("booking.adultsIncrease")} onClick={() => setAdults((a) => Math.min(SITE.maxGuests - 1, a + 1))} className="grid size-10 place-items-center rounded-full bg-cream text-ink hover:bg-sage">
                  <Plus className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
            <p className="mt-3 flex justify-between text-sm text-brown-soft">
              <span>{t("booking.estimate")}</span>
              <span className="font-bold text-ink">{fmt(SITE.price * adults)}</span>
            </p>

            <MagneticLink href={SITE.bookingUrl} size="lg" className="mt-5 w-full justify-center">
              {t("booking.cta")}
            </MagneticLink>
            <ul className="mt-5 space-y-1.5 text-sm text-brown-soft">
              {micro.map((m) => (
                <li key={m} className="flex gap-2">
                  <span className="text-olive" aria-hidden="true">✓</span>
                  {m}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-brown-soft/80">{t("booking.infoNote")}</p>
            {SITE.getYourGuideUrl && (
              <a href={SITE.getYourGuideUrl} target="_blank" rel="noopener noreferrer" className="mt-4 block text-center text-sm font-semibold text-olive underline">
                {t("booking.gyg")} ↗
              </a>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */
export function Faq() {
  const { t } = useTranslation("faq");
  const items = t("items", { returnObjects: true }) as { q: string; a: string }[];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-4 md:px-8">
        <p className="font-hand text-2xl text-aji-red">{t("kicker")}</p>
        <h2 className="h-display h2-fluid mt-2 text-olive">{t("title")}</h2>
        <ul className="mt-10 space-y-3">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <li key={it.q} className={cn("overflow-hidden rounded-3xl transition-colors", isOpen ? "bg-sage" : "bg-cream-deep")}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left text-lg font-bold text-ink"
                  >
                    {it.q}
                    <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="grid size-9 shrink-0 place-items-center rounded-full bg-aji-orange text-xl text-ink" aria-hidden="true">
                      +
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                    >
                      <p className="px-6 pb-6 text-brown-soft">{it.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ---------------- Final CTA ---------------- */
export function FinalCta() {
  const { t } = useTranslation("home");
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-peach py-24">
      <div className="animate-blob absolute -top-20 -left-20 size-96 bg-aji-orange/40 blur-2xl" aria-hidden="true" />
      <div className="animate-blob absolute -right-20 -bottom-20 size-[28rem] bg-cream/60 blur-2xl [animation-delay:-5s]" aria-hidden="true" />
      <div className="relative mx-auto max-w-5xl px-4 text-center">
        <p className="font-hand text-3xl text-aji-red">{t("final.kicker")}</p>
        <RevealWords as="h2" text={t("final.title")} className="h-display mt-2 block text-[clamp(3.5rem,11vw,9rem)] text-ink" />
        <p className="mt-4 text-xl text-brown-soft">{t("final.subtitle")}</p>
        <div className="mt-10">
          <MagneticLink href={SITE.bookingUrl} size="xl">
            {t("final.cta")}
          </MagneticLink>
        </div>
        <span className="animate-bob absolute -top-6 right-4 inline-block font-hand text-5xl text-olive md:-right-6 md:text-7xl" style={{ ["--r" as string]: "-10deg" }} aria-hidden="true">
          {t("final.float")}
        </span>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
export function Footer() {
  const { t } = useTranslation("common");
  return (
    <footer className="relative overflow-hidden bg-forest pt-16 text-cream">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-3 md:px-8">
        <div>
          <div className="inline-block rounded-[28px] bg-cream p-3">
            <img src={MEDIA.logo} alt={t("logoAlt")} className="h-24 w-auto" loading="lazy" />
          </div>
          <p className="mt-4 font-hand text-2xl text-peach">{t("footer.tagline")}</p>
        </div>
        <div>
          <p className="font-display text-2xl tracking-wide">{t("footer.follow")}</p>
          <ul className="mt-3 space-y-2">
            <li>
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-peach">
                <Instagram className="size-5" aria-hidden="true" /> {t("footer.instagram")}
              </a>
            </li>
            <li>
              <a href={SITE.facebook} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-peach">
                <Facebook className="size-5" aria-hidden="true" /> {t("footer.facebook")}
              </a>
            </li>
            <li>
              <a href={SITE.bookingUrl} target="_blank" rel="noopener noreferrer" className="hover:text-peach">
                {t("footer.book")} ↗
              </a>
            </li>
          </ul>
        </div>
        <div className="md:justify-self-end">
          <LanguageSwitcher dark />
          <p className="mt-4 text-sm text-cream/70">{t("footer.copyright", { year: 2026 })}</p>
        </div>
      </div>
      <p className="h-display pointer-events-none mt-12 -mb-[0.18em] text-center text-[19vw] leading-[0.8] whitespace-nowrap text-olive select-none" aria-hidden="true">
        {t("footer.wordmark")}
      </p>
    </footer>
  );
}

/* ---------------- Globals ---------------- */
export function StickyMobileCta({ visible }: { visible: boolean }) {
  const { t, i18n } = useTranslation("home");
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: "120%" }}
          animate={{ y: 0 }}
          exit={{ y: "120%" }}
          transition={{ duration: 0.4, ease: EASE }}
          className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-between gap-3 rounded-full bg-ink py-2 pr-2 pl-5 text-cream shadow-lift md:hidden"
        >
          <span className="font-display text-2xl tracking-wide">{t("mobileCta.from", { price: formatPrice(SITE.price, i18n.language) })}</span>
          <a href={SITE.bookingUrl} target="_blank" rel="noopener noreferrer" className="rounded-full bg-aji-orange px-6 py-2.5 font-display text-xl tracking-wide text-ink uppercase">
            {t("mobileCta.cta")} ↗
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function WhatsAppButton() {
  const { t } = useTranslation("common");
  if (!SITE.whatsapp) return null;
  return (
    <a
      href={`https://wa.me/${SITE.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("whatsapp")}
      className="fixed right-4 bottom-20 z-40 grid size-14 place-items-center rounded-full bg-lime text-forest shadow-lift md:bottom-6"
    >
      <MessageCircle aria-hidden="true" />
    </a>
  );
}

/** Desktop-only chili cursor that grows over interactive elements. */
export function ChiliCursor() {
  const [enabled, setEnabled] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [mode, setMode] = useState<"default" | "hover" | "view">("default");
  const [label, setLabel] = useState("");
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    const move = (e: PointerEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button");
      const m = el?.dataset["cursor"] === "view" ? "view" : el ? "hover" : "default";
      setMode(m);
      setLabel(el?.dataset["cursorLabel"] ?? "");
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);
  if (!enabled) return null;
  const size = mode === "view" ? 84 : mode === "hover" ? 44 : 14;
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-[90] grid place-items-center rounded-full bg-aji-red font-display text-xl text-cream mix-blend-multiply"
      animate={{ x: pos.x - size / 2, y: pos.y - size / 2, width: size, height: size, opacity: mode === "hover" ? 0.35 : 0.9 }}
      transition={{ type: "spring", stiffness: 500, damping: 35, mass: 0.4 }}
    >
      {mode === "view" ? label : mode === "hover" ? "" : ""}
    </motion.div>
  );
}

/** Splash: pure CSS so it never blocks content, even before hydration. Max ~1s. */
export function Splash() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] grid place-items-center bg-cream motion-safe:animate-[splash-out_0.6s_var(--ease-out)_0.8s_forwards] motion-reduce:hidden"
    >
      <img src={MEDIA.logo} alt="" className="w-56 animate-[splash-logo_0.8s_var(--ease-out)_both]" />
    </div>
  );
}
