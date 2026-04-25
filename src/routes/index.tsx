import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ContactDialog } from "@/components/ContactDialog";
import { BrightLineLogo } from "@/components/BrightLineLogo";
import { useReveal } from "@/hooks/use-reveal";
import { Square, Footprints, Sparkles, TreePine, Star, MapPin } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BrightLine Cleaning — Power Washing in Grand Rapids" },
      { name: "description", content: "Precision Cleaning, Every Time. Driveways, sidewalks, patios and decks across the Grand Rapids area. Premium service without the premium price." },
      { property: "og:title", content: "BrightLine Cleaning — Power Washing in Grand Rapids" },
      { property: "og:description", content: "Precision Cleaning, Every Time. Premium power washing without the premium price." },
    ],
  }),
  component: Index,
});

const services = [
  { icon: Square, name: "Driveways", desc: "Lift years of grime, oil, and tire marks." },
  { icon: Footprints, name: "Sidewalks", desc: "Crisp, slip-free walkways every time." },
  { icon: Sparkles, name: "Patios", desc: "Restore stone, brick, and pavers." },
  { icon: TreePine, name: "Decks", desc: "Strip dirt without harming the wood." },
];

const reviews = [
  { quote: "They made our driveway look brand new.", name: "Sarah M." },
  { quote: "Super professional and easy to work with.", name: "James R." },
  { quote: "Great service for the price.", name: "Linda K." },
];

// Curated non-person exterior cleaning photos (Unsplash, free to use)
const DIRTY_BG = "https://images.unsplash.com/photo-1605152276897-4f618f831968?w=1800&q=80&auto=format&fit=crop"; // weathered concrete / driveway
const CLEAN_BG = "https://images.unsplash.com/photo-1597047084897-51e81819a499?w=1800&q=80&auto=format&fit=crop"; // clean wet pavers / water spray
const ABOUT_BG = "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80&auto=format&fit=crop"; // architectural concrete

function Index() {
  useReveal();
  const [progress, setProgress] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(Math.min(1, Math.max(0, h.scrollTop / Math.max(1, max))));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Stay rich and brand-colored throughout — never blow out to white
  const dirtyOpacity = Math.max(0.25, 1 - progress * 0.85);
  const cleanOpacity = Math.min(0.9, progress * 1.1);

  return (
    <div ref={wrapRef} className="relative min-h-screen overflow-hidden bg-navy-deep text-foreground">
      {/* Fixed background: dirty driveway -> wet clean pavers, with brand-colored overlays */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        {/* Solid navy base so colors stay rich */}
        <div className="absolute inset-0 bg-navy-deep" />

        {/* Dirty concrete texture */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
          style={{
            backgroundImage: `url('${DIRTY_BG}')`,
            opacity: dirtyOpacity,
            filter: "grayscale(0.55) brightness(0.45) contrast(1.05)",
          }}
        />

        {/* Clean wet surface fading in */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
          style={{
            backgroundImage: `url('${CLEAN_BG}')`,
            opacity: cleanOpacity,
            filter: "brightness(0.7) saturate(1.1)",
          }}
        />

        {/* Brand color wash — navy at top, sky-tinted at bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.18 0.07 255 / 0.85) 0%, oklch(0.25 0.08 250 / 0.65) 45%, oklch(0.32 0.10 240 / 0.55) 100%)",
          }}
        />

        {/* Subtle vignette for depth */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, oklch(0.14 0.05 260 / 0.55) 100%)",
          }}
        />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-navy-deep/70 border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <BrightLineLogo size={72} />
          <ContactDialog>
            <Button size="sm" className="bg-sky text-navy-deep hover:bg-white rounded-full px-5 font-semibold">
              Contact Us
            </Button>
          </ContactDialog>
        </div>
      </header>

      {/* HERO */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-32 sm:pt-32 sm:pb-44">
          <div className="max-w-3xl animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky/40 bg-sky/10 px-3 py-1 text-xs font-medium text-sky backdrop-blur-md">
              <MapPin className="h-3.5 w-3.5" />
              Serving the Grand Rapids area
            </div>
            <h1 className="mt-6 font-display text-5xl font-bold tracking-tight text-white sm:text-7xl text-balance drop-shadow-[0_4px_24px_rgba(0,0,0,0.55)]">
              Power washing,
              <br />
              <span className="text-sky">done right.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/85 sm:text-xl">
              Precision Cleaning, Every Time.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <ContactDialog>
                <Button size="lg" className="rounded-full bg-sky text-navy-deep hover:bg-white px-8 h-12 text-base font-semibold shadow-2xl shadow-sky/20 hover:-translate-y-0.5 transition-all">
                  Contact Us
                </Button>
              </ContactDialog>
              <a href="#services" className="text-sm font-medium text-white/75 hover:text-sky transition-colors">
                See what we clean →
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sky/70 text-xs tracking-widest uppercase animate-fade-in">
          Scroll
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="relative py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="reveal mb-14 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-sky">Services</p>
            <h2 className="mt-3 text-4xl font-bold text-white sm:text-5xl">What we clean.</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <div
                key={s.name}
                className="reveal group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-7 transition-all duration-300 hover:-translate-y-1 hover:border-sky/60 hover:bg-white/10 hover:shadow-[0_20px_50px_-15px_rgba(70,150,255,0.35)]"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky/15 text-sky transition-colors group-hover:bg-sky group-hover:text-navy-deep">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-white">{s.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="relative py-28">
        <div className="mx-auto max-w-4xl px-6">
          <div className="reveal relative overflow-hidden rounded-3xl border border-white/10 p-10 sm:p-16 text-center shadow-2xl">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${ABOUT_BG}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-navy-deep/95 via-navy/90 to-navy-deep/95" />
            <p className="relative text-sm font-semibold uppercase tracking-widest text-sky">About us</p>
            <p className="relative mx-auto mt-6 max-w-2xl text-2xl leading-relaxed text-white sm:text-3xl text-balance">
              We are a local power washing business ran by two teenage entrepreneurs that are trying to learn how to run their own business.
            </p>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="relative py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="reveal mb-14 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-sky">Reviews</p>
            <h2 className="mt-3 text-4xl font-bold text-white sm:text-5xl">Trusted by neighbors.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((r, i) => (
              <figure
                key={r.name}
                className="reveal rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-7 transition-all hover:bg-white/10 hover:-translate-y-1 hover:border-sky/40"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex gap-0.5 text-sky">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 text-lg leading-relaxed text-white">
                  “{r.quote}”
                </blockquote>
                <figcaption className="mt-5 text-sm font-medium text-white/60">— {r.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-36">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="reveal font-display text-5xl font-bold tracking-tight text-white sm:text-7xl text-balance">
            Premium service<br />
            <span className="text-sky">without the premium price.</span>
          </h2>
          <div className="reveal mt-10">
            <ContactDialog>
              <Button size="lg" className="rounded-full bg-sky text-navy-deep hover:bg-white px-10 h-14 text-base font-semibold shadow-2xl shadow-sky/30 transition-all hover:-translate-y-0.5">
                Contact Us
              </Button>
            </ContactDialog>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative border-t border-white/10 bg-navy-deep/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <BrightLineLogo size={56} />
          <p className="text-xs text-white/50">© {new Date().getFullYear()} BrightLine Cleaning · Grand Rapids, MI</p>
        </div>
      </footer>
    </div>
  );
}
