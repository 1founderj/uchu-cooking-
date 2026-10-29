import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "framer-motion";
import { useRef, useState, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { SITE, formatPrice } from "@/config/site";
import { MEDIA } from "@/data/media";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  BrushReveal,
  BrushUnderline,
  Dots,
  EASE,
  FadeIn,
  MagneticLink,
  RevealWords,
  SectionLabel,
  Stamp,
  Tilt,
} from "./primitives";

type Card = { emoji: string; title: string; text: string };
type Step = { num: string; eyebrow: string; title: string; text: string; alt: string };
type Dish = { name: string; tagline: string; ingredients: string[]; culture: string; alt: string };

/* ---------------- Hero ---------------- */
export const Hero = forwardRef<HTMLElement>(function Hero(_, ref) {
  const { t, i18n } = useTranslation("home");
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const ySlow = useTransform(scrollY, [0, 800], [0, reduce ? 0 : -80]);
  const yFast = useTransform(scrollY, [0, 800], [0, reduce ? 0 : -220]);
  const yMid = useTransform(scrollY, [0, 800], [0, reduce ? 0 : 140]);
  const price = formatPrice(SITE.price, i18n.language);
  const badges = [
    `★ ${t("hero.badgeRating", { rating: SITE.rating.toFixed(1), count: SITE.reviewCount })}`,
    t("hero.badgeGroup", { max: SITE.maxGuests }),
    t("hero.badgeDuration", { hours: SITE.durationHours }),
    t("hero.badgePrice", { price }),
  ];
  const stickers = [
    { e: "🌶️", c: "right-[44%] top-[62%] text-5xl hidden lg:block", y: yFast, r: "-12deg" },
    { e: "🍋", c: "right-[42%] top-[8%] text-4xl hidden md:block", y: ySlow, r: "10deg" },
    { e: "🍠", c: "left-[40%] bottom-[24%] text-5xl hidden md:block", y: yMid, r: "-6deg" },
    { e: "🌽", c: "right-[4%] bottom-[22%] text-5xl hidden md:block", y: yFast, r: "14deg" },
  ];

  return (
    <section ref={ref} id="top" className="relative overflow-hidden pt-24 pb-16 md:pt-28 md:pb-24">
      {stickers.map((s, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          style={{ y: s.y }}
          className={cn("pointer-events-none absolute z-10 select-none", s.c)}
        >
          <span className="animate-bob inline-block drop-shadow-md" style={{ ["--r" as string]: s.r, animationDelay: `${i * 0.8}s` }}>
            {s.e}
          </span>
        </motion.span>
      ))}
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 md:px-8 lg:grid-cols-[1.35fr_1fr]">
        <div className="relative z-20">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-hand text-2xl text-aji-red md:text-3xl"
          >
            {t("hero.kicker")}
          </motion.p>
          <h1 className="h-display mt-3 text-[clamp(3.5rem,11vw,9rem)] text-ink lg:text-[clamp(5rem,7.6vw,8.25rem)]">
            <RevealWords text={t("hero.titleLine1")} className="block" delay={0.3} />
            <span className="block">
              <RevealWords text={t("hero.titleLine2Pre")} delay={0.5} />{" "}
              <BrushUnderline className="text-olive">
                <RevealWords text={t("hero.titleHighlight")} delay={0.65} />
              </BrushUnderline>
            </span>
          </h1>
          <FadeIn delay={0.9} y={20}>
            <p className="mt-6 max-w-xl text-lg text-brown-soft md:text-xl">{t("hero.subtitle")}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <MagneticLink href={SITE.bookingUrl} size="lg">
                {t("hero.ctaPrimary")}
              </MagneticLink>
              <a
                href="#good"
                data-cursor="hover"
                className="font-display text-2xl tracking-wide text-olive uppercase underline decoration-aji-orange decoration-2 underline-offset-8 hover:text-aji-red"
              >
                {t("hero.ctaSecondary")} <span aria-hidden="true">↓</span>
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-2">
              {badges.map((b, i) => (
                <motion.li
                  key={b}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1 + i * 0.08, type: "spring", stiffness: 260, damping: 18 }}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-sm font-bold",
                    i === 0 ? "bg-ink text-peach" : i === 3 ? "bg-aji-orange text-ink" : "bg-sage text-forest",
                  )}
                >
                  {b}
                </motion.li>
              ))}
            </ul>
          </FadeIn>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="animate-blob glow-peach absolute -inset-8 bg-peach/70" aria-hidden="true" />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}
            className="relative aspect-[4/5] shadow-lift [clip-path:url(#brush)]"
          >
            <img
              src={MEDIA.hero}
              alt={t("hero.imageAlt")}
              fetchPriority="high"
              className="size-full object-cover"
            />
          </motion.div>
          <Stamp text={t("hero.stamp")} className="absolute -bottom-6 -left-4 md:-left-10" />
        </div>
      </div>
      <a
        href="#vibe"
        className="mx-auto mt-14 flex w-fit flex-col items-center gap-1 font-hand text-xl text-brown-soft"
      >
        {t("hero.scroll")}
        <motion.span
          aria-hidden="true"
          animate={reduce ? {} : { y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          className="text-aji-orange"
        >
          ↓
        </motion.span>
      </a>
    </section>
  );
});

/* ---------------- Marquee ---------------- */
export function Marquee() {
  const { t } = useTranslation("home");
  const words = t("marquee", { returnObjects: true }) as string[];
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(vel, [-1000, 0, 1000], [-4, 0, 4], { clamp: false });
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);
  const [paused, setPaused] = useState(false);
  const dir = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce || paused) return;
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    base.set(base.get() - dir.current * 2 * (delta / 1000) * (1 + Math.abs(f)));
  });

  const line = [...words, ...words, ...words];
  return (
    <div
      className="relative z-20 -my-2 -rotate-2 overflow-hidden bg-olive py-4 text-cream shadow-warm"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label={words.join(", ")}
      role="marquee"
    >
      <motion.div style={{ x }} className="flex w-max whitespace-nowrap" aria-hidden="true">
        {[0, 1].map((k) => (
          <div key={k} className="flex">
            {line.map((w, i) => (
              <span key={i} className="h-display flex items-center px-5 text-5xl md:text-7xl">
                {w}
                <span className="ml-10 text-aji-orange">✳</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ---------------- 01 Vibe ---------------- */
export function Vibe() {
  const { t } = useTranslation("home");
  const cards = t("vibe.cards", { returnObjects: true }) as Card[];
  return (
    <section id="vibe" className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionLabel>{t("vibe.label")}</SectionLabel>
        <p className="mt-6 font-hand text-2xl text-aji-red">{t("vibe.kicker")}</p>
        <RevealWords as="h2" text={t("vibe.title")} className="h-display h2-fluid mt-2 block max-w-4xl text-olive" />
        <FadeIn>
          <p className="mt-6 max-w-2xl text-lg text-brown-soft">{t("vibe.text")}</p>
        </FadeIn>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {cards.map((c, i) => (
            <FadeIn key={c.title} delay={i * 0.12}>
              <Tilt className="h-full rounded-[28px]">
                <article
                  className={cn(
                    "h-full rounded-[28px] p-8 shadow-warm",
                    ["bg-cream-deep", "bg-sage", "bg-peach"][i],
                  )}
                >
                  <div className="flex items-start justify-between">
                    <span className="h-display text-7xl text-aji-orange">0{i + 1}</span>
                    <span className="text-5xl" aria-hidden="true">
                      {c.emoji}
                    </span>
                  </div>
                  <h3 className="h-display mt-6 text-4xl text-ink">{c.title}</h3>
                  <p className="mt-3 text-brown-soft">{c.text}</p>
                </article>
              </Tilt>
            </FadeIn>
          ))}
        </div>

        <div className="mt-24 grid items-center gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div className="relative">
            <BrushReveal src={MEDIA.rooftop} alt={t("vibe.rooftopAlt")} className="aspect-[4/3] shadow-lift" />
            <span className="absolute -top-6 right-6 rotate-6 font-hand text-4xl text-aji-red" aria-hidden="true">
              {t("vibe.rooftopNote")} ↙
            </span>
          </div>
          <FadeIn>
            <SectionLabel className="bg-aji-red">{t("vibe.rooftopLabel")}</SectionLabel>
            <h3 className="h-display mt-5 text-5xl text-ink md:text-6xl">{t("vibe.rooftopTitle")}</h3>
            <p className="mt-4 text-lg text-brown-soft">{t("vibe.rooftopText")}</p>
            <a
              href="#good"
              data-cursor="hover"
              className="mt-8 inline-block font-display text-2xl tracking-wide text-olive uppercase underline decoration-aji-orange decoration-2 underline-offset-8 hover:text-aji-red"
            >
              {t("vibe.cta")} <span aria-hidden="true">↘</span>
            </a>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 02 The good stuff ---------------- */
function StepPanel({ s, img, i }: { s: Step; img: string; i: number }) {
  return (
    <article className="relative flex h-full w-[85vw] shrink-0 snap-center flex-col overflow-hidden rounded-[32px] bg-cream-deep shadow-warm md:w-[70vw] md:flex-row lg:w-[60vw]">
      <img src={img} alt={s.alt} loading="lazy" className="h-64 w-full object-cover md:h-auto md:w-1/2" />
      <div className="flex flex-1 flex-col justify-center p-8 md:p-12">
        <span className="h-display text-8xl text-aji-orange/90 md:text-9xl">{s.num}</span>
        <p className="mt-2 font-hand text-2xl text-aji-red">{s.eyebrow}</p>
        <h3 className="h-display mt-1 text-5xl text-olive md:text-6xl">{s.title}</h3>
        <p className="mt-3 text-lg text-brown-soft">{s.text}</p>
        <span className="sr-only">{i + 1}/3</span>
      </div>
    </article>
  );
}

function PinnedSteps({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-62%"]);
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <div ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <motion.div style={{ x }} className="flex h-[68vh] gap-8 pl-[8vw]">
          {steps.map((s, i) => (
            <StepPanel key={s.num} s={s} img={MEDIA.steps[i] ?? ""} i={i} />
          ))}
        </motion.div>
        <div className="mx-auto mt-8 h-1.5 w-60 overflow-hidden rounded-full bg-sage">
          <motion.div style={{ scaleX: progress }} className="h-full origin-left bg-aji-orange" />
        </div>
      </div>
    </div>
  );
}

function DishCard({ d, img, i }: { d: Dish; img: string; i: number }) {
  const { t } = useTranslation("home");
  const [flipped, setFlipped] = useState(false);
  return (
    <FadeIn delay={i * 0.12}>
      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        onMouseEnter={() => setFlipped(true)}
        onMouseLeave={() => setFlipped(false)}
        aria-pressed={flipped}
        aria-label={`${d.name} — ${t("good.flipHint")}`}
        data-cursor="hover"
        className="group relative block h-[560px] w-full text-left [perspective:1200px]"
      >
        <motion.div
          className="relative size-full [transform-style:preserve-3d]"
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        >
          <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[32px] bg-cream-deep p-5 shadow-warm [backface-visibility:hidden]">
            <div className="relative h-60 shrink-0 overflow-hidden [clip-path:url(#brush)]">
              <img src={img} alt={d.alt} loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <SectionLabel className="mt-5 self-start text-base">{d.tagline}</SectionLabel>
            <h3 className="h-display mt-3 text-5xl text-ink">{d.name}</h3>
            <p className="mt-3 text-xs font-bold tracking-widest text-brown-soft uppercase">{t("good.ingredientsLabel")}</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {d.ingredients.map((ing) => (
                <li key={ing} className="rounded-full border border-dashed border-aji-orange px-2.5 py-0.5 text-sm text-ink">
                  {ing}
                </li>
              ))}
            </ul>
            <p className="mt-auto pt-3 font-hand text-lg text-aji-red">↻ {t("good.flipHint")}</p>
          </div>
          <div className="absolute inset-0 flex flex-col justify-center rounded-[32px] bg-peach p-8 shadow-warm [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <span className="text-6xl" aria-hidden="true">
              {["🐟", "🔥", "🍸"][i]}
            </span>
            <p className="mt-4 font-hand text-3xl text-aji-red">{t("good.cultureLabel")}</p>
            <h3 className="h-display mt-1 text-5xl text-ink">{d.name}</h3>
            <p className="mt-4 text-lg text-ink">{d.culture}</p>
          </div>
        </motion.div>
      </button>
    </FadeIn>
  );
}

export function Good() {
  const { t } = useTranslation("home");
  const steps = t("good.steps", { returnObjects: true }) as Step[];
  const dishes = t("good.dishes", { returnObjects: true }) as Dish[];
  const isMobile = useIsMobile();
  const reduce = useReducedMotion();
  const pinned = !isMobile && !reduce;
  return (
    <section id="good" className="relative bg-cream-deep/60 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionLabel>{t("good.label")}</SectionLabel>
        <p className="mt-6 font-hand text-2xl text-aji-red">{t("good.kicker")}</p>
        <RevealWords as="h2" text={t("good.title")} className="h-display h2-fluid mt-2 block text-olive" />
        <FadeIn>
          <p className="mt-5 max-w-2xl text-lg text-brown-soft">{t("good.subtitle")}</p>
        </FadeIn>
      </div>

      {pinned ? (
        <PinnedSteps steps={steps} />
      ) : (
        <div className="mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 [scrollbar-width:none]">
          {steps.map((s, i) => (
            <StepPanel key={s.num} s={s} img={MEDIA.steps[i] ?? ""} i={i} />
          ))}
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <Dots className="my-16" />
        {/* TODO equipo: reemplazar por fotos reales de cada plato de Uchu */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {dishes.map((d, i) => (
            <DishCard key={d.name} d={d} img={MEDIA.dishes[i] ?? ""} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Class ticket ---------------- */
export function ClassInfo() {
  const { t } = useTranslation("home");
  const items = t("class.items", {
    returnObjects: true,
    hours: SITE.durationHours,
    max: SITE.maxGuests,
  }) as { icon: string; strong: string; text: string }[];
  const inc = t("class.includes", { returnObjects: true }) as string[];
  const exc = t("class.excludes", { returnObjects: true }) as string[];
  const ideal = t("class.ideal", { returnObjects: true }) as string[];
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <FadeIn>
          <div className="ticket-edge rounded-[32px] bg-cream-deep shadow-lift">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-dashed border-aji-orange/50 px-8 pt-10 pb-6 md:px-14">
              <div>
                <p className="font-hand text-2xl text-aji-red">{t("class.kicker")}</p>
                <h2 className="h-display mt-1 text-5xl text-olive md:text-6xl">{t("class.title")}</h2>
              </div>
              <span className="font-display text-xl tracking-[0.3em] text-brown-soft">{t("class.ticketCode")}</span>
            </div>
            <ul className="grid gap-x-10 gap-y-5 px-8 py-10 sm:grid-cols-2 md:px-14 lg:grid-cols-3">
              {items.map((it) => (
                <li key={it.strong} className="flex gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-cream text-2xl" aria-hidden="true">
                    {it.icon}
                  </span>
                  <p className="text-brown-soft">
                    <strong className="block font-display text-2xl tracking-wide text-ink">{it.strong}</strong>
                    {it.text}
                  </p>
                </li>
              ))}
            </ul>
            <div className="grid gap-6 border-t-2 border-dashed border-aji-orange/50 px-8 py-10 md:grid-cols-2 md:px-14">
              <div className="rounded-3xl bg-sage p-6">
                <h3 className="h-display text-3xl text-forest">{t("class.includesTitle")}</h3>
                <ul className="mt-3 space-y-1.5">
                  {inc.map((x) => (
                    <li key={x} className="flex gap-2 text-ink">
                      <span className="text-olive" aria-hidden="true">✓</span>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl bg-cream p-6">
                <h3 className="h-display text-3xl text-aji-red">{t("class.excludesTitle")}</h3>
                <ul className="mt-3 space-y-1.5">
                  {exc.map((x) => (
                    <li key={x} className="flex gap-2 text-ink">
                      <span className="text-aji-red" aria-hidden="true">✕</span>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="md:col-span-2">
                <span className="font-hand text-2xl text-aji-red">{t("class.idealTitle")}:</span>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {ideal.map((x) => (
                    <li key={x} className="rounded-full bg-olive px-4 py-1.5 text-sm font-bold text-cream">
                      {x}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
