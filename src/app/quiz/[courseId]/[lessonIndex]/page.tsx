'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle2, XCircle, ChevronRight, Trophy } from 'lucide-react';
import { toast } from 'sonner';

interface Question {
  id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
}

export default function QuizPage({ params }: { params: { courseId: string; lessonIndex: string } }) {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const lessonIndex = parseInt(params.lessonIndex);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from('quiz_questions')
        .select('*')
        .eq('course_id', params.courseId)
        .eq('lesson_index', lessonIndex)
        .order('order_index');
      setQuestions(data || []);
      setLoading(false);
    }
    load();
  }, [params.courseId, lessonIndex]);

  async function submit() {
    let correct = 0;
    questions.forEach(q => { if (answers[q.id] === q.correct_option) correct++; });
    setScore(correct);
    setSubmitted(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('quiz_results').insert({ user_id: user.id, course_id: params.courseId, lesson_index: lessonIndex, score: correct, total: questions.length });
      if (correct === questions.length) {
        toast.success('Керемет! 5/5! 🏆');
      }
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
      <div className="text-[var(--muted)]">Жүктелуде...</div>
    </div>
  );

  if (questions.length === 0) return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
      <div className="text-center text-[var(--muted)]">
        <p>Бұл тест үшін сұрақтар жоқ</p>
        <button onClick={() => router.back()} className="mt-4 px-4 py-2 rounded-lg bg-[var(--brand)] text-white text-sm">Артқа</button>
      </div>
    </div>
  );

  const opts = [
    { key: 'a', label: 'A' },
    { key: 'b', label: 'B' },
    { key: 'c', label: 'C' },
    { key: 'd', label: 'D' },
  ] as const;

  return (
    <div className="min-h-screen bg-[var(--bg)] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="text-sm text-[var(--brand)] font-semibold mb-2">Тест</div>
          <h1 className="text-2xl font-bold">{lessonIndex}-сабақтан кейінгі тест</h1>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex-1 bg-[var(--surface-2)] rounded-full h-2">
              <div className="bg-[var(--brand)] h-2 rounded-full transition-all" style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }} />
            </div>
            <span className="text-sm text-[var(--muted)]">{Object.keys(answers).length}/{questions.length}</span>
          </div>
        </div>

        {!submitted ? (
          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div key={q.id} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
                <p className="font-semibold mb-5">{idx + 1}. {q.question}</p>
                <div className="grid grid-cols-1 gap-3">
                  {opts.map(({ key, label }) => {
                    const optText = q[`option_${key}` as keyof Question] as string;
                    const selected = answers[q.id] === key;
                    return (
                      <button key={key} onClick={() => setAnswers({ ...answers, [q.id]: key })}
                        className={`flex items-center gap-3 p-4 rounded-xl border text-left text-sm transition-all ${selected ? 'border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)]' : 'border-[var(--border)] hover:border-[var(--brand)] hover:bg-[var(--surface-2)]'}`}>
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${selected ? 'bg-[var(--brand)] text-white' : 'bg-[var(--surface-2)]'}`}>{label}</span>
                        {optText}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <button onClick={submit} disabled={Object.keys(answers).length < questions.length}
              className="w-full py-4 rounded-xl bg-[var(--brand)] text-white font-semibold hover:bg-[var(--brand-hover)] transition-all shadow-[0_0_20px_var(--brand-glow)] disabled:opacity-40 flex items-center justify-center gap-2">
              Тексеру <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
            <Trophy className={`w-16 h-16 mx-auto mb-4 ${score === questions.length ? 'text-[var(--warning)]' : score >= 3 ? 'text-[var(--success)]' : 'text-[var(--muted)]'}`} />
            <h2 className="text-3xl font-bold mb-2">{score}/{questions.length}</h2>
            <p className="text-[var(--muted)] mb-6">
              {score === questions.length ? 'Тамаша! Барлығы дұрыс! 🎉' : score >= 3 ? 'Жақсы нәтиже! 👍' : 'Қайталап көріңіз'}
            </p>

            <div className="space-y-3 mb-8 text-left">
              {questions.map((q, idx) => {
                const userAns = answers[q.id];
                const correct = userAns === q.correct_option;
                const correctText = q[`option_${q.correct_option}` as keyof Question] as string;
                return (
                  <div key={q.id} className={`p-4 rounded-xl border ${correct ? 'border-[var(--success)] bg-[var(--success-soft)]' : 'border-[var(--danger)] bg-[var(--danger-soft)]'}`}>
                    <div className="flex items-start gap-2 mb-1">
                      {correct ? <CheckCircle2 className="w-4 h-4 text-[var(--success)] flex-shrink-0 mt-0.5" /> : <XCircle className="w-4 h-4 text-[var(--danger)] flex-shrink-0 mt-0.5" />}
                      <span className="text-sm font-medium">{idx + 1}. {q.question}</span>
                    </div>
                    {!correct && <p className="text-xs text-[var(--muted)] ml-6">Дұрыс жауап: {correctText}</p>}
                  </div>
                );
              })}
            </div>
            <button onClick={() => router.back()} className="px-6 py-3 rounded-xl bg-[var(--brand)] text-white font-semibold hover:bg-[var(--brand-hover)] transition-all">
              Жалғастыру →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
