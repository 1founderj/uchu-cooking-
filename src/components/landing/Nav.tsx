import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";
import { Globe, Menu, X } from "lucide-react";
import { SITE } from "@/config/site";
import { MEDIA } from "@/data/media";
import { SUPPORTED_LANGS } from "@/i18n";
import { cn } from "@/lib/utils";
import { EASE, MagneticLink } from "./primitives";

const LINKS = ["vibe", "good", "gallery", "booking"] as const;

export function LanguageSwitcher({ dark = false }: { dark?: boolean }) {
  const { t, i18n } = useTranslation("common");
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("lang.label")}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold uppercase",
          dark ? "text-cream hover:bg-cream/10" : "text-ink hover:bg-ink/5",
        )}
      >
        <Globe className="size-4" aria-hidden="true" />
        {i18n.language} <span aria-hidden="true">▾</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute right-0 z-50 mt-2 min-w-36 rounded-2xl bg-cream p-2 text-ink shadow-lift"
          >
            {SUPPORTED_LANGS.map((l) => (
              <li key={l} role="option" aria-selected={i18n.language === l}>
                <Link
                  to="/$lang"
                  params={{ lang: l }}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-3 py-2 text-sm font-semibold hover:bg-sage"
                >
                  {t(`lang.names.${l}`)}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Nav() {
  const { t } = useTranslation("common");
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 300 && y > prev && !open);
  });

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[80] rounded-full bg-ink px-4 py-2 text-cream focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        {t("nav.skip")}
      </a>
      <motion.header
        animate={{ y: hidden ? "-110%" : 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300",
          scrolled && "bg-cream/80 shadow-[0_1px_0_var(--border)] backdrop-blur-md",
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 md:px-8">
          <a href="#top" aria-label={t("nav.home")} className="shrink-0" data-cursor="hover">
            <img src={MEDIA.logo} alt={t("logoAlt")} className="h-14 w-auto md:h-16" width={85} height={64} />
          </a>
          <ul className="hidden items-center gap-7 lg:flex">
            {LINKS.map((k) => (
              <li key={k}>
                <a
                  href={`#${k}`}
                  data-cursor="hover"
                  className="relative font-semibold text-ink after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-aji-orange after:transition-transform hover:after:scale-x-100"
                >
                  {t(`nav.${k}`)}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            <div className="hidden sm:block">
              <MagneticLink href={SITE.bookingUrl} size="md" className="py-2 text-lg">
                {t("nav.cta")}
              </MagneticLink>
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={t("nav.menu")}
              className="grid size-11 place-items-center rounded-full bg-olive text-cream lg:hidden"
            >
              <Menu className="size-5" aria-hidden="true" />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-[70] flex flex-col bg-forest px-6 py-6 text-cream"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <div className="flex items-center justify-between">
              <LanguageSwitcher dark />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={t("nav.closeMenu")}
                className="grid size-11 place-items-center rounded-full bg-cream text-ink"
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>
            <ul className="mt-12 flex flex-1 flex-col gap-4">
              {LINKS.map((k, i) => (
                <motion.li
                  key={k}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.08, ease: EASE, duration: 0.6 }}
                >
                  <a
                    href={`#${k}`}
                    onClick={() => setOpen(false)}
                    className="h-display text-6xl text-cream hover:text-peach"
                  >
                    <span className="mr-3 align-top font-sans text-base text-peach">0{i + 1}</span>
                    {t(`nav.${k}`)}
                  </a>
                </motion.li>
              ))}
            </ul>
            <MagneticLink href={SITE.bookingUrl} size="lg" className="justify-center">
              {t("nav.cta")}
            </MagneticLink>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
