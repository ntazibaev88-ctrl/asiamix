import { Presentations } from "@/components/dashboard/presentations";
import { BookOpenCheck } from "lucide-react";

export default function LearnPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 p-6 text-white">
        <div className="absolute top-3 right-6 text-6xl opacity-10">🎓</div>
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <BookOpenCheck className="h-5 w-5" />
            <h1 className="text-xl font-bold">Мини-сабақтар</h1>
          </div>
          <p className="text-sm text-white/70">Қаржылық сауаттылықты арттырыңыз</p>
        </div>
      </div>

      <Presentations />
    </div>
  );
}
