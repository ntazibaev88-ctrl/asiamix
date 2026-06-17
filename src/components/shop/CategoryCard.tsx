"use client";

export function CategoryCard({
  emoji,
  name,
  onClick,
}: {
  emoji: string;
  name: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-3xl bg-surface text-left shadow-[var(--shadow)] transition-all duration-200 hover:shadow-[var(--shadow-lg)] active:scale-[0.98] cursor-pointer"
    >
      <div className="grid h-28 place-items-center bg-gradient-to-br from-surface-2 to-[color-mix(in_srgb,var(--brand)_8%,var(--surface-2))]">
        <span className="text-6xl transition-transform duration-200 group-hover:scale-110">
          {emoji}
        </span>
      </div>
      <div className="px-3.5 py-3">
        <span className="text-sm font-bold leading-tight">{name}</span>
      </div>
    </button>
  );
}
