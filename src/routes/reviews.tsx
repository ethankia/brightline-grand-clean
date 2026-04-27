import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { BrightLineLogo } from "@/components/BrightLineLogo";
import { supabase } from "@/integrations/supabase/client";
import { Star, Upload, X, Loader2, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "Customer Reviews — BrightLine Cleaning" },
      { name: "description", content: "Read real reviews from BrightLine Cleaning customers in Grand Rapids, and share your own experience with our power washing service." },
      { property: "og:title", content: "Customer Reviews — BrightLine Cleaning" },
      { property: "og:description", content: "Read real reviews from BrightLine Cleaning customers and leave your own." },
    ],
  }),
  component: ReviewsPage,
});

type Review = {
  id: string;
  name: string;
  rating: number;
  body: string;
  photo_urls: string[];
  created_at: string;
};

function StarRow({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <div className="flex gap-0.5 text-sky">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          style={{ width: size, height: size }}
          className={i < value ? "fill-current" : "opacity-30"}
        />
      ))}
    </div>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  const display = hover || value;
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const n = i + 1;
        return (
          <button
            type="button"
            key={n}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(n)}
            className="text-sky transition-transform hover:scale-110"
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
          >
            <Star className={`h-8 w-8 ${n <= display ? "fill-current" : "opacity-30"}`} />
          </button>
        );
      })}
    </div>
  );
}

function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [website, setWebsite] = useState(""); // honeypot
  const formLoadedAt = useRef<number>(Date.now());

  const COOLDOWN_MS = 60 * 1000; // 1 min between submits
  const DAILY_LIMIT = 5;
  const STORAGE_KEY = "blc_reviews_submits";

  const getSubmitHistory = (): number[] => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw) as number[];
      const cutoff = Date.now() - 24 * 60 * 60 * 1000;
      return arr.filter((t) => t > cutoff);
    } catch {
      return [];
    }
  };

  const recordSubmit = () => {
    const next = [...getSubmitHistory(), Date.now()];
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  };

  const loadReviews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setReviews(data as Review[]);
    setLoading(false);
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const fiveStar = useMemo(() => reviews.filter((r) => r.rating === 5), [reviews]);
  const marqueeItems = useMemo(() => (fiveStar.length > 0 ? [...fiveStar, ...fiveStar] : []), [fiveStar]);

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const arr = Array.from(incoming).filter((f) => f.type.startsWith("image/") && f.size <= 8 * 1024 * 1024);
    setFiles((prev) => [...prev, ...arr].slice(0, 5));
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const trimmedName = name.trim();
    const trimmedBody = body.trim();
    if (!trimmedName || trimmedName.length > 100) return setError("Please enter your name (1–100 characters).");
    if (rating < 1 || rating > 5) return setError("Please select a star rating.");
    if (!trimmedBody || trimmedBody.length > 2000) return setError("Please write your review (1–2000 characters).");

    setSubmitting(true);
    try {
      const photo_urls: string[] = [];
      for (const file of files) {
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("review-photos").upload(path, file, {
          contentType: file.type,
          upsert: false,
        });
        if (upErr) throw upErr;
        const { data: pub } = supabase.storage.from("review-photos").getPublicUrl(path);
        photo_urls.push(pub.publicUrl);
      }

      const { error: insErr } = await supabase
        .from("reviews")
        .insert({ name: trimmedName, rating, body: trimmedBody, photo_urls });
      if (insErr) throw insErr;

      setName("");
      setRating(0);
      setBody("");
      setFiles([]);
      setSuccess(true);
      await loadReviews();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-deep text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-sky-soft/95 border-b border-sky/30 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/">
            <BrightLineLogo size={110} />
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-navy hover:text-navy-deep transition-colors">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-deep via-navy to-navy-deep" />
        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-sky">Reviews</p>
          <h1 className="mt-4 font-display text-5xl font-bold tracking-tight sm:text-6xl">
            What our neighbors say.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/75">
            Real reviews from real customers. Share yours below.
          </p>
        </div>
      </section>

      {/* 5-star marquee */}
      {fiveStar.length > 0 && (
        <section className="relative border-b border-white/10 bg-gradient-to-r from-navy-deep via-navy to-navy-deep py-10 overflow-hidden">
          <div className="mx-auto max-w-6xl px-6 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-sky">Five-star wall</p>
                <h2 className="mt-1 text-2xl font-bold sm:text-3xl">Excels and Driveways ★★★★★</h2>
              </div>
              <span className="text-sm text-white/60">
                {fiveStar.length} {fiveStar.length === 1 ? "rave review" : "rave reviews"}
              </span>
            </div>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-navy-deep to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-navy-deep to-transparent z-10" />
            <div className="flex gap-5 marquee-track">
              {marqueeItems.map((r, i) => (
                <figure
                  key={`${r.id}-${i}`}
                  className="shrink-0 w-80 rounded-2xl border border-sky/30 bg-white/5 backdrop-blur-md p-6"
                >
                  <StarRow value={5} />
                  <blockquote className="mt-3 text-base leading-relaxed text-white line-clamp-4">
                    “{r.body}”
                  </blockquote>
                  <figcaption className="mt-4 text-sm font-medium text-sky">— {r.name}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Submit form */}
      <section className="py-16">
        <div className="mx-auto max-w-2xl px-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md p-8 sm:p-10">
            <h2 className="text-3xl font-bold">Leave a review</h2>
            <p className="mt-2 text-sm text-white/65">No account needed. Your review will appear instantly.</p>

            {success && (
              <div className="mt-5 rounded-lg border border-sky/40 bg-sky/15 px-4 py-3 text-sm text-white">
                Thanks! Your review has been posted.
              </div>
            )}
            {error && (
              <div className="mt-5 rounded-lg border border-destructive/50 bg-destructive/15 px-4 py-3 text-sm text-white">
                {error}
              </div>
            )}

            <form onSubmit={submit} className="mt-6 space-y-5">
              <div>
                <Label htmlFor="name" className="text-white">Your name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={100}
                  placeholder="Jane D."
                  className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  required
                />
              </div>

              <div>
                <Label className="text-white">Your rating</Label>
                <div className="mt-2">
                  <StarPicker value={rating} onChange={setRating} />
                </div>
              </div>

              <div>
                <Label htmlFor="body" className="text-white">Your review</Label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  maxLength={2000}
                  rows={5}
                  placeholder="They did great with our sidewalk…"
                  className="mt-2 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                  required
                />
                <p className="mt-1 text-xs text-white/50">{body.length}/2000</p>
              </div>

              <div>
                <Label className="text-white">Photos (optional)</Label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={files.length >= 5}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-white/20 bg-white/5 px-4 py-6 text-sm text-white/70 transition hover:border-sky/60 hover:text-white disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" />
                  {files.length === 0 ? "Upload photos (up to 5)" : `Add more (${files.length}/5)`}
                </button>

                {files.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {files.map((f, i) => (
                      <div key={i} className="relative aspect-square overflow-hidden rounded-lg border border-white/10">
                        <img src={URL.createObjectURL(f)} alt="" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white hover:bg-black"
                          aria-label="Remove"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={submitting}
                size="lg"
                className="w-full rounded-full bg-sky text-navy-deep hover:bg-white font-semibold h-12"
              >
                {submitting ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Posting…</>
                ) : (
                  "Post review"
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* All reviews */}
      <section className="pb-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="text-3xl font-bold">All reviews</h2>
            <span className="text-sm text-white/60">{reviews.length} total</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-16 text-white/60">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : reviews.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center text-white/60">
              No reviews yet. Be the first to leave one!
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((r) => (
                <article
                  key={r.id}
                  className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-6 transition hover:bg-white/10 hover:border-sky/40"
                >
                  <div className="flex items-center justify-between">
                    <StarRow value={r.rating} />
                    <time className="text-xs text-white/50">
                      {new Date(r.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </time>
                  </div>
                  <p className="mt-4 text-base leading-relaxed text-white whitespace-pre-wrap">{r.body}</p>
                  {r.photo_urls.length > 0 && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {r.photo_urls.map((url, i) => (
                        <a key={i} href={url} target="_blank" rel="noreferrer" className="block aspect-square overflow-hidden rounded-lg border border-white/10">
                          <img src={url} alt={`Review photo ${i + 1}`} loading="lazy" className="h-full w-full object-cover transition hover:scale-105" />
                        </a>
                      ))}
                    </div>
                  )}
                  <p className="mt-5 text-sm font-semibold text-sky">— {r.name}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="border-t border-sky/30 bg-sky-soft/95">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <BrightLineLogo size={88} />
          <p className="text-xs text-navy-deep/70">© {new Date().getFullYear()} BrightLine Cleaning · Grand Rapids, MI</p>
        </div>
      </footer>
    </div>
  );
}
