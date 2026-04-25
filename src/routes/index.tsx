import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ContactDialog } from "@/components/ContactDialog";
import { BrightLineLogo } from "@/components/BrightLineLogo";
import { useReveal } from "@/hooks/use-reveal";
import { Droplets, Home, Sparkles, Square, TreePine, Wind, Star, MapPin } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BrightLine Cleaning — Power Washing in Grand Rapids" },
      { name: "description", content: "Precision Cleaning, Every Time. Driveways, siding, patios and more across the Grand Rapids area. Premium service without the premium price." },
      { property: "og:title", content: "BrightLine Cleaning — Power Washing in Grand Rapids" },
      { property: "og:description", content: "Precision Cleaning, Every Time. Premium power washing without the premium price." },
    ],
  }),
  component: Index,
});

const services = [
  { icon: Square, name: "Driveways", desc: "Lift years of grime, oil, and tire marks." },
  { icon: Home, name: "Sidewalks", desc: "Crisp, slip-free walkways every time." },
  { icon: Sparkles, name: "Patios", desc: "Restore stone, brick, and pavers." },
  { icon: Wind, name: "Siding", desc: "Gentle wash that brings color back." },
  { icon: TreePine, name: "Decks", desc: "Strip dirt without harming the wood." },
  { icon: Droplets, name: "Exterior Cleaning", desc: "Whole-home refresh, top to bottom." },
];

const reviews = [
  { quote: "They made our driveway look brand new.", name: "Sarah M." },
  { quote: "Super professional and easy to work with.", name: "James R." },
  { quote: "Great service for the price.", name: "Linda K." },
];

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

  // dirty -> clean transition based on scroll
  const dirtyOpacity = 1 - progress * 1.4;
  const brightness = 0.85 + progress * 0.45;

  return (
    <div ref={wrapRef} className="relative min-h-screen overflow-hidden bg-background text-foreground">
      {/* Fixed background that morphs from dirty concrete -> clean light */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        {/* Dirty concrete layer */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-[opacity,filter] duration-300"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=1600&q=80&auto=format&fit=crop')",
            opacity: Math.max(0, dirtyOpacity),
            filter: `grayscale(0.4) brightness(${0.55 + progress * 0.2})`,
          }}
        />
        {/* Clean white/sky overlay grows in */}
        <div
          className="absolute inset-0 transition-opacity duration-300"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.99 0.005 230) 0%, oklch(0.95 0.03 230) 60%, oklch(1 0 0) 100%)",
            opacity: progress,
          }}
        />
        {/* Soft brightness wash always on top */}
        <div
          className="absolute inset-0 transition-all duration-300"
          style={{
            background:
              "linear-gradient(180deg, rgba(20,30,55,0.55) 0%, rgba(20,30,55,0.25) 40%, rgba(255,255,255,0.0) 100%)",
            opacity: 1 - progress * 0.9,
            mixBlendMode: "multiply",
            filter: `brightness(${brightness})`,
          }}
        />
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/60 border-b border-border/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <BrightLineLogo />
          <ContactDialog>
            <Button size="sm" className="bg-navy hover:bg-navy-deep text-white rounded-full px-5">
              Contact Us
            </Button>
          </ContactDialog>
        </div>
      </header>

      {/* HERO */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-32 sm:pt-32 sm:pb-44">
          <div className="max-w-3xl animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
              <MapPin className="h-3.5 w-3.5" />
              Serving the Grand Rapids area
            </div>
            <h1 className="mt-6 font-display text-5xl font-bold tracking-tight text-white sm:text-7xl text-balance drop-shadow-[0_2px_20px_rgba(0,0,0,0.45)]">
              Power washing,
              <br />
              done right.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/90 sm:text-xl drop-shadow">
              Precision Cleaning, Every Time.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <ContactDialog>
                <Button size="lg" className="rounded-full bg-white text-navy-deep hover:bg-sky-soft px-8 h-12 text-base font-semibold shadow-xl">
                  Contact Us
                </Button>
              </ContactDialog>
              <a href="#services" className="text-sm font-medium text-white/85 hover:text-white transition-colors">
                See what we clean →
              </a>
            </div>
          </div>
        </div>
        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 text-xs tracking-widest uppercase animate-fade-in">
          Scroll
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="relative py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="reveal mb-14 max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-navy">Services</p>
            <h2 className="mt-3 text-4xl font-bold text-navy-deep sm:text-5xl">What we clean.</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <div
                key={s.name}
                className="reveal group rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_rgba(20,40,80,0.25)] hover:border-accent"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-soft text-navy transition-colors group-hover:bg-navy group-hover:text-white">
                  <s.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-navy-deep">{s.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="relative py-28">
        <div className="mx-auto max-w-4xl px-6">
          <div className="reveal rounded-3xl bg-navy-deep p-10 sm:p-16 text-center shadow-2xl overflow-hidden relative">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80&auto=format&fit=crop')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                mixBlendMode: "overlay",
              }}
            />
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
            <p className="text-sm font-semibold uppercase tracking-widest text-navy">Reviews</p>
            <h2 className="mt-3 text-4xl font-bold text-navy-deep sm:text-5xl">Trusted by neighbors.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {reviews.map((r, i) => (
              <figure
                key={r.name}
                className="reveal rounded-2xl border border-border bg-card p-7 transition-all hover:shadow-lg hover:-translate-y-1"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className="flex gap-0.5 text-accent">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 text-lg leading-relaxed text-foreground">
                  “{r.quote}”
                </blockquote>
                <figcaption className="mt-5 text-sm font-medium text-muted-foreground">— {r.name}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative py-36">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="reveal font-display text-5xl font-bold tracking-tight text-navy-deep sm:text-7xl text-balance">
            Premium service<br />without the premium price.
          </h2>
          <div className="reveal mt-10">
            <ContactDialog>
              <Button size="lg" className="rounded-full bg-navy hover:bg-navy-deep text-white px-10 h-14 text-base font-semibold shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5">
                Contact Us
              </Button>
            </ContactDialog>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative border-t border-border/70 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <BrightLineLogo />
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} BrightLine Cleaning · Grand Rapids, MI</p>
        </div>
      </footer>
    </div>
  );
}
