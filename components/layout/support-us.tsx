"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Coffee, Cake, Send } from "lucide-react"; // Added Send icon for newsletter

interface SupportUsProps {
  /** Link to Buy Me a Coffee profile */
  buyMeACoffeeUrl?: string;
  /** Link to Trakteer.id profile */
  trakteerUrl?: string;
}

/**
 * SupportUs – simple section with buttons/links to support the developer.
 * Usage: <SupportUs buyMeACoffeeUrl="https://buymeacoffee.com/yourname" trakteerUrl="https://trakteer.id/yourname" />
 */
export function SupportUs({
  buyMeACoffeeUrl = "https://buymeacoffee.com/yourname",
  trakteerUrl = "https://trakteer.id/yourname",
}: SupportUsProps) {
  const COLOR_OPTIONS = [
    { name: "Brick Red", value: "oklch(0.5425 0.1342 23.73)" },
    { name: "Deep Indigo", value: "oklch(0.3635 0.0554 277.8)" },
    { name: "Teal", value: "oklch(0.5406 0.067 196.69)" },
    { name: "Steel Blue", value: "oklch(0.4703 0.0888 247.87)" },
    { name: "Bronze", value: "oklch(0.6209 0.095 90.75)" },
    { name: "Royal Purple", value: "oklch(0.3961 0.1167 303.38)" },
    { name: "Muted Magenta", value: "oklch(0.5297 0.1356 343.24)" },
    { name: "Forest Green", value: "oklch(0.5275 0.0713 151.27)" },
    { name: "Slate Gray", value: "oklch(0.2953 0.0196 278.09)" },
    { name: "Black", value: "oklch(0.0000 0.0000 0.0000)" },
  ];
  return (
    <div className="max-w-xl mx-auto border border-gray-200 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center gap-8 shadow-xl pt-20 bg-card text-card-foreground">
      <h3 className="text-2xl font-semibold text-center leading-tight">
        Dukung pengembangan{" "}
        <span style={{ color: COLOR_OPTIONS[0].value }}>Jeda</span> ☕🍰
      </h3>

      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        <Link
          href={buyMeACoffeeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto"
        >
          <Button
            variant="default"
            className="w-full flex items-center gap-2 px-6 py-3 text-base"
            style={{
              background: COLOR_OPTIONS[0].value,
            }}
          >
            <Coffee className="w-4 h-4" />
            Buy Me a Coffee
          </Button>
        </Link>
        <Link
          href={trakteerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto"
        >
          <Button
            className="w-full flex items-center gap-2 px-6 py-3 text-base"
            style={{
              background: COLOR_OPTIONS[2].value,
            }}
          >
            <Cake className="w-4 h-4" />
            Trakteer.id
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-sm flex flex-col items-center gap-4 pt-4 border-t border-dashed border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-medium text-center">
          Gabung Newsletter Kami 📩
        </h4>
        <NewsletterForm />
      </div>
    </div>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Email tidak valid 😅");
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // const res = await fetch("/api/newsletter", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email }),
      // });

      // if (!res.ok) throw new Error("Gagal");

      toast.success("Siap! Cek inbox kamu ya ✉️");
      setEmail("");
    } catch (err) {
      console.error(err);
      toast.error("Ups, ada masalah. Coba lagi nanti 😔");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2">
      <Input
        type="email"
        placeholder="nama@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 bg-background/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        required
      />
      <Button
        type="submit"
        disabled={loading || !email}
        className="px-4"
        style={{ background: "oklch(0.5425 0.1342 23.73)" }}
      >
        {loading ? (
          "..."
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" /> Join
          </>
        )}
      </Button>
    </form>
  );
}

export default SupportUs;
