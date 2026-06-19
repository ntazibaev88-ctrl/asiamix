'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Download, Award, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CertificatePage({ params }: { params: { courseId: string } }) {
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [profile, setProfile] = useState<{ full_name?: string } | null>(null);
  const [course, setCourse] = useState<{ title?: string } | null>(null);
  const [certificate, setCertificate] = useState<{ issued_at?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) { setLoading(false); return; }
      setUser(u);
      const [{ data: p }, { data: c }, { data: cert }] = await Promise.all([
        supabase.from('profiles').select('full_name').eq('id', u.id).single(),
        supabase.from('courses').select('title').eq('id', params.courseId).single(),
        supabase.from('certificates').select('issued_at').eq('user_id', u.id).eq('course_id', params.courseId).single(),
      ]);
      setProfile(p);
      setCourse(c);
      setCertificate(cert);
      setLoading(false);
    }
    load();
  }, [params.courseId]);

  async function downloadPDF() {
    setGenerating(true);
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();

    // Background
    doc.setFillColor(10, 10, 15);
    doc.rect(0, 0, w, h, 'F');

    // Border
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(2);
    doc.rect(10, 10, w - 20, h - 20, 'S');
    doc.setLineWidth(0.5);
    doc.rect(13, 13, w - 26, h - 26, 'S');

    // Title
    doc.setTextColor(59, 130, 246);
    doc.setFontSize(36);
    doc.setFont('helvetica', 'bold');
    doc.text('CodeOrda', w / 2, 40, { align: 'center' });

    doc.setTextColor(240, 240, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'normal');
    doc.text('SERTIFIKAT', w / 2, 55, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(136, 136, 170);
    doc.text('Bul sertifikat tomendegisin rastaydy:', w / 2, 72, { align: 'center' });

    // Name
    doc.setFontSize(28);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    const name = profile?.full_name || user?.email || 'Oqyshy';
    doc.text(name, w / 2, 92, { align: 'center' });

    // Course
    doc.setFontSize(16);
    doc.setTextColor(136, 136, 170);
    doc.setFont('helvetica', 'normal');
    doc.text('kursin tolyk ayaqtady:', w / 2, 107, { align: 'center' });

    doc.setFontSize(22);
    doc.setTextColor(59, 130, 246);
    doc.setFont('helvetica', 'bold');
    doc.text(course?.title || 'Kurs', w / 2, 122, { align: 'center' });

    // Date
    doc.setFontSize(12);
    doc.setTextColor(85, 85, 106);
    doc.setFont('helvetica', 'normal');
    const date = certificate?.issued_at ? new Date(certificate.issued_at).toLocaleDateString('ru-RU') : new Date().toLocaleDateString('ru-RU');
    doc.text(`Berilgen kuni: ${date}`, w / 2, 145, { align: 'center' });

    // Signature line
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.5);
    doc.line(w / 2 - 40, 162, w / 2 + 40, 162);
    doc.setFontSize(11);
    doc.setTextColor(136, 136, 170);
    doc.text('CodeOrda', w / 2, 168, { align: 'center' });

    doc.save(`CodeOrda-Sertifikat-${name.replace(/\s/g, '-')}.pdf`);
    setGenerating(false);
  }

  if (loading) return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-[var(--brand)]" />
    </div>
  );

  if (!certificate) return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
      <div className="text-center">
        <Award className="w-16 h-16 text-[var(--faint)] mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Сертификат жоқ</h1>
        <p className="text-[var(--muted)] mb-6">Алдымен курсты толық аяқтаңыз</p>
        <Link href="/dashboard" className="px-5 py-2.5 rounded-xl bg-[var(--brand)] text-white font-medium">Кабинетке оралу</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full text-center">
        <div className="rounded-3xl border border-[var(--warning)] bg-gradient-to-b from-[var(--warning-soft)] to-transparent p-10 mb-8">
          <Award className="w-16 h-16 text-[var(--warning)] mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Құттықтаймыз! 🎉</h1>
          <p className="text-[var(--muted)] mb-1">
            <strong className="text-[var(--fg)]">{profile?.full_name || user?.email}</strong>
          </p>
          <p className="text-[var(--muted)] mb-1">курсты сәтті аяқтады:</p>
          <p className="text-xl font-bold text-[var(--warning)] mb-4">{course?.title}</p>
          <p className="text-sm text-[var(--faint)]">{new Date(certificate.issued_at || '').toLocaleDateString('kk-KZ')}</p>
        </div>

        <button onClick={downloadPDF} disabled={generating}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-[var(--brand)] text-white font-semibold text-lg hover:bg-[var(--brand-hover)] transition-all shadow-[0_0_30px_var(--brand-glow)] disabled:opacity-50 mb-4">
          {generating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
          PDF жүктеп алу
        </button>
        <Link href="/dashboard" className="block text-center text-sm text-[var(--muted)] hover:text-[var(--fg)] transition-colors">
          Кабинетке оралу
        </Link>
      </div>
    </div>
  );
}
