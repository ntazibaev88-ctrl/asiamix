"use client";

import { useEffect, useRef } from "react";
import { ExternalLink, Play } from "lucide-react";

function getVideoType(url: string): "youtube" | "mp4" | "external" {
  if (!url) return "external";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.endsWith(".mp4") || url.includes(".mp4")) return "mp4";
  return "external";
}

function getYouTubeEmbedUrl(url: string): string {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/);
  if (match) return `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0`;
  return url;
}

export function MoviePlayer({ movieId, url, title }: { movieId: string; url: string; title: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const type = getVideoType(url);
  const storageKey = `movie_progress_${movieId}`;

  useEffect(() => {
    if (type !== "mp4" || !videoRef.current) return;
    const saved = localStorage.getItem(storageKey);
    if (saved) videoRef.current.currentTime = parseFloat(saved);

    const el = videoRef.current;
    const handleTime = () => {
      if (el) localStorage.setItem(storageKey, String(el.currentTime));
    };
    el.addEventListener("timeupdate", handleTime);
    return () => el.removeEventListener("timeupdate", handleTime);
  }, [type, storageKey]);

  if (type === "youtube") {
    return (
      <div className="aspect-video rounded-2xl overflow-hidden bg-black">
        <iframe
          src={getYouTubeEmbedUrl(url)}
          title={title}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
    );
  }

  if (type === "mp4") {
    return (
      <div className="aspect-video rounded-2xl overflow-hidden bg-black">
        <video
          ref={videoRef}
          src={url}
          controls
          className="w-full h-full"
          controlsList="nodownload"
        />
      </div>
    );
  }

  return (
    <div className="aspect-video rounded-2xl bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <Play className="h-16 w-16 text-white/30 mx-auto mb-4" />
        <p className="text-white/60 mb-4">Сыртқы бейне сілтемесі</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          <ExternalLink className="h-4 w-4" /> Қарауға өту
        </a>
      </div>
    </div>
  );
}
