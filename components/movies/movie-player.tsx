"use client";

import { useEffect, useRef } from "react";
import { ExternalLink } from "lucide-react";

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export function MoviePlayer({
  movieId,
  url,
  title,
}: {
  movieId: string;
  url: string;
  title: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const ytId = getYouTubeId(url);
  const isMp4 = !ytId && /\.(mp4|webm|ogg)(\?|$)/i.test(url);

  useEffect(() => {
    if (!isMp4 || !videoRef.current) return;
    const el = videoRef.current;
    const saved = localStorage.getItem(`movie_progress_${movieId}`);
    if (saved) el.currentTime = parseFloat(saved);

    const save = () =>
      localStorage.setItem(`movie_progress_${movieId}`, String(el.currentTime));
    el.addEventListener("timeupdate", save);
    return () => el.removeEventListener("timeupdate", save);
  }, [isMp4, movieId]);

  if (ytId) {
    return (
      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  }

  if (isMp4) {
    return (
      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black">
        <video
          ref={videoRef}
          src={url}
          controls
          className="w-full h-full"
          title={title}
        />
      </div>
    );
  }

  return (
    <div className="aspect-video w-full rounded-2xl bg-gray-900 flex items-center justify-center">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
      >
        <ExternalLink className="h-5 w-5" />
        Сыртқы сайтта қарау
      </a>
    </div>
  );
}
