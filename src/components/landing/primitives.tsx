import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";
import { cn } from "@/lib/utils";

export const EASE = [0.22, 1, 0.36, 1] as const;

/** SVG defs: organic brush-stroke clip path used as photo frame. */
export function BrushDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        <clipPath id="brush" clipPathUnits="objectBoundingBox">
          <path d="M0.03,0.06 C0.12,0.01 0.3,0.035 0.45,0.02 C0.62,0.005 0.8,0.03 0.97,0.015 C0.99,0.2 0.975,0.4 0.995,0.55 C1,0.72 0.98,0.86 0.985,0.97 C0.8,0.99 0.62,0.97 0.45,0.99 C0.3,1 0.15,0.975 0.02,0.985 C0.005,0.8 0.025,0.62 0.008,0.45 C0,0.3 0.02,0.16 0.03,0.06 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function SectionLabel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "brush-tape inline-block px-5 py-1.5 font-display text-lg tracking-wider uppercase",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Dots({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)} aria-hidden="true">
      <span className="h-px flex-1 bg-aji-orange/50" />
      <span className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <span key={i} className="size-2 rounded-full bg-aji-orange" />
        ))}
      </span>
      <span className="h-px flex-1 bg-aji-orange/50" />
    </div>
  );
}

/** Word-by-word reveal with mask + translateY. */
export function RevealWords({
  text,
  className,
  delay = 0,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "span" | "h2" | "h3" | "p";
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const words = text.split(" ");
  const Comp = Tag as "span";
  return (
    <Comp className={className}>
      <span ref={ref} className="sr-only">
        {text}
      </span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <motion.span
              className="inline-block"
              initial={reduce ? { opacity: 0 } : { y: "110%" }}
              animate={inView ? (reduce ? { opacity: 1 } : { y: 0 }) : {}}
              transition={{ duration: 0.8, ease: EASE, delay: delay + i * 0.07 }}
            >
              {w}
              {i < words.length - 1 ? "\u00a0" : ""}
            </motion.span>
          </span>
        ))}
      </span>
    </Comp>
  );
}

/** Brush underline that draws itself on view. */
export function BrushUnderline({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  return (
    <span ref={ref} className={cn("relative inline-block", className)}>
      {children}
      <svg
        viewBox="0 0 300 30"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -bottom-[0.12em] left-0 h-[0.28em] w-full"
        aria-hidden="true"
      >
        <motion.path
          d="M4 20 C 60 6, 120 26, 180 12 S 270 8, 296 16"
          fill="none"
          stroke="var(--aji-orange)"
          strokeWidth="9"
          strokeLinecap="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={inView ? { pathLength: 1 } : {}}
          transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
        />
      </svg>
    </span>
  );
}

/** CTA that follows the cursor slightly; orange ripple on click. */
export function MagneticLink({
  href,
  children,
  className,
  external = true,
  size = "md",
}: {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
  size?: "md" | "lg" | "xl";
}) {
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 250, damping: 18 });
  const y = useSpring(0, { stiffness: 250, damping: 18 });
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.25);
    y.set((e.clientY - r.top - r.height / 2) * 0.35);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((p) => [...p, { id, x: e.clientX - r.left, y: e.clientY - r.top }]);
    setTimeout(() => setRipples((p) => p.filter((q) => q.id !== id)), 700);
  };
  const sizes = {
    md: "px-6 py-3 text-xl",
    lg: "px-8 py-4 text-2xl",
    xl: "px-10 py-6 text-4xl md:px-14 md:py-8 md:text-6xl",
  };
  return (
    <motion.a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      style={{ x, y }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onClick={onClick}
      data-cursor="hover"
      className={cn(
        "group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-aji-orange font-display tracking-wide text-ink uppercase shadow-warm transition-colors",
        sizes[size],
        className,
      )}
    >
      <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 [background:var(--gradient-cta-hover)]" />
      <span className="relative z-10 flex items-center gap-2 transition-colors group-hover:text-cream">
        {children}
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          ↗
        </span>
      </span>
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          className="pointer-events-none absolute z-0 size-10 rounded-full bg-peach"
          style={{ left: r.x - 20, top: r.y - 20 }}
          initial={{ scale: 0, opacity: 0.7 }}
          animate={{ scale: 8, opacity: 0 }}
          transition={{ duration: 0.7 }}
        />
      ))}
    </motion.a>
  );
}

export function Counter({
  to,
  decimals = 0,
  className,
}: {
  to: number;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [val, setVal] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) return setVal(to);
    const c = animate(0, to, { duration: 1.6, ease: EASE, onUpdate: setVal });
    return () => c.stop();
  }, [inView, to, reduce]);
  return (
    <span ref={ref} className={className}>
      {val.toFixed(decimals)}
    </span>
  );
}

/** Soft 3D tilt with glare, max 8°. */
export function Tilt({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 });
  const glare = useTransform(
    [mx, my] as never,
    ([x = 0.5, y = 0.5]: number[]) =>
      `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,250,235,.45), transparent 55%)`,
  );
  return (
    <motion.div
      className={cn("group/tilt relative [transform-style:preserve-3d]", className)}
      style={reduce ? {} : { rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      onMouseLeave={() => {
        mx.set(0.5);
        my.set(0.5);
      }}
    >
      {children}
      {!reduce && (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/tilt:opacity-100"
          style={{ background: glare }}
        />
      )}
    </motion.div>
  );
}

export function Stamp({ text, className }: { text: string; className?: string }) {
  return (
    <div className={cn("relative size-28 md:size-36", className)} aria-hidden="true">
      <svg viewBox="0 0 200 200" className="animate-spin-slow size-full">
        <defs>
          <path id="stampCircle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <circle cx="100" cy="100" r="98" fill="var(--aji-red)" />
        <text fill="var(--cream)" fontFamily="var(--font-display)" fontSize="20" letterSpacing="2.5">
          <textPath href="#stampCircle">{text}</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 grid place-items-center text-4xl">🌶️</span>
    </div>
  );
}

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 30,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 0.8, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Image reveal: brush-clipped frame that wipes open on view. */
export function BrushReveal({
  src,
  alt,
  className,
  eager,
}: {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cn("overflow-hidden [clip-path:url(#brush)]", className)}
      initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 100% 0 0)" }}
      whileInView={reduce ? { opacity: 1 } : { clipPath: "inset(0 0% 0 0)" }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 1.2, ease: EASE }}
    >
      <div className="size-full [clip-path:url(#brush)]">
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          className="size-full object-cover"
        />
      </div>
    </motion.div>
  );
}
