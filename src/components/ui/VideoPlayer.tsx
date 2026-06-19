'use client';
import { useState } from 'react';
import { Play } from 'lucide-react';

interface Props {
  youtubeId?: string;
  mp4Src?: string;
}

export function VideoPlayer({ youtubeId, mp4Src }: Props) {
  const [playing, setPlaying] = useState(false);

  const hasSrc = !!(youtubeId || mp4Src);

  if (playing && youtubeId) {
    return (
      <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-[0_0_60px_var(--brand-glow)]">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1`}
          title="CodeOrda таныстыру"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  }

  if (playing && mp4Src) {
    return (
      <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-[0_0_60px_var(--brand-glow)]">
        <video
          src={mp4Src}
          autoPlay
          controls
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => hasSrc && setPlaying(true)}
      className="group relative aspect-video w-full rounded-2xl overflow-hidden border border-[var(--brand)]/40 hover:border-[var(--brand)] transition-all duration-500 shadow-[0_0_40px_var(--brand-glow)] hover:shadow-[0_0_80px_var(--brand-glow)] bg-[var(--bg-elevated)] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)]"
      aria-label="Видеоны ойнату"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/60 via-[var(--bg)] to-purple-950/40" />

      {/* Decorative code lines */}
      <div className="absolute inset-0 flex flex-col justify-center px-10 opacity-[0.18] font-mono text-xs sm:text-sm text-blue-300 leading-7 pointer-events-none select-none">
        <div><span className="text-purple-400">const</span> <span className="text-blue-200">developer</span> = <span className="text-green-400">&apos;сен&apos;</span>;</div>
        <div className="mt-1"><span className="text-purple-400">function</span> <span className="text-yellow-300">learn</span><span className="text-white">()</span> <span className="text-white">{'{'}</span></div>
        <div className="ml-5"><span className="text-blue-300">codeOrda</span><span className="text-white">.</span><span className="text-yellow-300">start</span><span className="text-white">();</span></div>
        <div><span className="text-white">{'}'}</span></div>
        <div className="mt-2"><span className="text-purple-400">const</span> <span className="text-blue-200">future</span> = <span className="text-blue-200">learn</span><span className="text-white">();</span></div>
        <div className="mt-3 text-[var(--faint)]"><span className="text-green-500">// </span>IT маманы болу — оңай!</div>
      </div>

      {/* Center radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-56 h-56 rounded-full bg-[var(--brand)] opacity-[0.08] blur-3xl group-hover:opacity-[0.16] transition-opacity duration-700" />
      </div>

      {/* Play button + label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[var(--brand)] flex items-center justify-center shadow-[0_0_60px_var(--brand-glow)] group-hover:scale-110 group-hover:shadow-[0_0_100px_var(--brand-glow)] transition-all duration-300">
          <span className="absolute inset-0 rounded-full bg-[var(--brand)] animate-ping opacity-20" />
          <Play className="w-9 h-9 sm:w-10 sm:h-10 text-white fill-white ml-1" />
        </div>
        <span className="text-sm text-[var(--muted)] group-hover:text-[var(--fg)] transition-colors">
          {hasSrc ? 'Видеоны ойнату' : 'Видео жақында қосылады'}
        </span>
      </div>

      {/* Duration badge */}
      {hasSrc && (
        <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-lg bg-black/60 text-white text-xs font-mono backdrop-blur-sm">
          1:30
        </div>
      )}
    </button>
  );
}
