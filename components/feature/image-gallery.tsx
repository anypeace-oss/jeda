"use client";

import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ImageGalleryProps {
  selectedImage: string;
  onImageSelect: (image: string) => void;
}

const PRESET_IMAGES = [
  { id: "mountain", name: "Mountain", url: "/adv.png" },
  { id: "ocean", name: "Ocean", url: "/samurai1.jpg" },
  { id: "forest", name: "Forest", url: "/kucing.png" },
  { id: "desert", name: "Desert", url: "/adv.png" },
  { id: "city", name: "City", url: "/adv.png" },
  { id: "space", name: "Space", url: "/adv.png" },
  { id: "mosuntain", name: "Mountain", url: "/adv.png" },
  { id: "ocesan", name: "Ocean", url: "/samurai1.jpg" },
  { id: "foresst", name: "Forest", url: "/adv.png" },
  { id: "deserst", name: "Desert", url: "/adv.png" },
  { id: "citay", name: "City", url: "/adv.png" },
  { id: "spacse", name: "Space", url: "/adv.png" },
];

export function ImageGallery({ selectedImage, onImageSelect }: ImageGalleryProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Preset Images</h4>

      <ScrollArea className="rounded-md border max-h-[208px] overflow-y-auto">
        <div className="inline-flex flex-wrap gap-4 p-4">
          {PRESET_IMAGES.map((image) => (
            <div key={image.id} className="relative">
              <button
                className={`relative h-24 w-32 rounded-md overflow-hidden border-2 ${selectedImage === image.url
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-transparent"
                  }`}
                onClick={() => onImageSelect(image.url)}
              >
                <Image
                  src={image.url}
                  alt={image.name}
                  fill
                  className="object-cover"
                  sizes="128px"
                />
                <div className="absolute inset-0 bg-black/20 hover:bg-black/40 transition-colors flex items-center justify-center">
                  {selectedImage === image.url && (
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </button>
              <p className="text-xs text-center mt-1 text-muted-foreground">
                {image.name}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
