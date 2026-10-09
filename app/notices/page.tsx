import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  CalendarDays,
  FileText,
  Info,
  Megaphone,
} from "lucide-react";

type Notice = {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  noticeType?: string;
  date?: string;
  publishedAt?: string;
  isImportant?: boolean;
  status?: string;
  attachmentUrl?: string;
};

// Fallback informative notices when backend has no dynamic notices yet
const DEFAULT_NOTICES: Notice[] = [
  {
    _id: "notice-1",
    title: "जन कनेक्ट डिजिटल नागरिक पंजीकरण पोर्टल प्रारंभ",
    description: "नागरिकों की सुविधा हेतु जन कनेक्ट पोर्टल पर ऑनलाइन पंजीकरण सुविधा प्रारंभ की गई है। सभी नागरिक अपनी बुनियादी जानकारी दर्ज करके डिजिटल प्रोफाइल बना सकते हैं।",
    category: "पोर्टल सूचना",
    publishedAt: "2026-10-09T08:00:00.000Z",
    isImportant: true,
  },
  {
    _id: "notice-2",
    title: "सार्वजनिक सेवाओं और कल्याणकारी योजनाओं की अद्यतन सूची",
    description: "विभिन्न विभागों से संबंधित जनसुविधाओं एवं कल्याणकारी योजनाओं की जानकारी पोर्टल के 'योजनाएँ' अनुभाग में प्रदर्शित की जा रही है।",
    category: "सेवाएं",
    publishedAt: "2026-10-07T08:00:00.000Z",
    isImportant: false,
  },
  {
    _id: "notice-3",
    title: "नागरिक सहायता डेस्क एवं तकनीकी संपर्क सुविधा",
    description: "पोर्टल के उपयोग में किसी भी प्रकार की कठिनाई होने पर नागरिक 'संपर्क' पृष्ठ के माध्यम से सहायता अनुरोध दर्ज कर सकते हैं।",
    category: "सहायता",
    publishedAt: "2026-10-05T08:00:00.000Z",
    isImportant: false,
  },
];

async function getNotices(): Promise<Notice[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      return DEFAULT_NOTICES;
    }

    const response = await fetch(`${apiUrl}/api/notices`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return DEFAULT_NOTICES;
    }

    const data = await response.json();
    if (data.notices && Array.isArray(data.notices) && data.notices.length > 0) {
      return data.notices;
    }
    return DEFAULT_NOTICES;
  } catch {
    return DEFAULT_NOTICES;
  }
}

function formatDate(date?: string) {
  if (!date) return "तिथि उपलब्ध नहीं";

  try {
    return new Intl.DateTimeFormat("hi-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return "तिथि उपलब्ध नहीं";
  }
}

function NoticeCard({ notice }: { notice: Notice }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white transition hover:border-blue-300 hover:shadow-md">
      <div className="flex flex-col gap-4 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-900">
              <Bell size={21} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700">
                  {notice.category || notice.noticeType || "सामान्य सूचना"}
                </span>

                {notice.isImportant && (
                  <span className="rounded-full bg-orange-100 px-2.5 py-0.5 text-[11px] font-bold text-orange-700">
                    महत्वपूर्ण / Important
                  </span>
                )}
              </div>

              <h2 className="mt-2.5 text-base sm:text-lg font-bold leading-7 text-slate-900">
                {notice.title}
              </h2>
            </div>
          </div>
        </div>

        {notice.description && (
          <p className="text-xs sm:text-sm leading-relaxed text-slate-600 pl-14">
            {notice.description}
          </p>
        )}

        <div className="flex flex-col justify-between gap-3 border-t border-slate-100 pt-3 sm:flex-row sm:items-center pl-14">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CalendarDays size={14} />
            <span>{formatDate(notice.publishedAt || notice.date)}</span>
          </div>

          {notice.attachmentUrl && (
            <a
              href={notice.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:text-orange-600"
            >
              संलग्न दस्तावेज देखें
              <ArrowRight size={14} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default async function NoticesPage() {
  const notices = await getNotices();

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-md border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700">
              <Megaphone size={15} />
              <span>सार्वजनिक सूचना केंद्र</span>
            </div>

            <h1 className="text-3xl font-extrabold leading-tight text-blue-950 sm:text-4xl lg:text-5xl">
              नवीनतम <span className="text-orange-600">सूचनाएँ (Public Notices)</span>
            </h1>

            <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">
              Jan Connect पोर्टल पर प्रकाशित महत्वपूर्ण सार्वजनिक सूचनाएँ, आवश्यक निर्देश और प्रशासनिक घोषणाएँ यहाँ प्राप्त करें।
            </p>
          </div>
        </div>
      </section>

      {/* Notices List */}
      <section className="bg-slate-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">
              प्रकाशित सूचनाएँ ({notices.length})
            </p>
          </div>

          {notices.length > 0 ? (
            <div className="space-y-4">
              {notices.map((notice) => (
                <NoticeCard key={notice._id} notice={notice} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 bg-white px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <Info size={25} />
              </div>

              <h2 className="mt-5 text-lg font-bold text-slate-900">
                अभी कोई सूचना उपलब्ध नहीं है
              </h2>

              <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-slate-500">
                नई सूचना प्रकाशित होने पर वह इस पृष्ठ पर स्वतः दिखाई देगी।
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Advisory Note */}
      <section className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 rounded-xl border border-blue-100 bg-blue-50/80 p-5 sm:p-6">
            <AlertCircle size={22} className="mt-0.5 shrink-0 text-blue-900" />
            <div>
              <h3 className="text-sm font-bold text-blue-950">
                महत्वपूर्ण नागरिक सतर्कता निर्देश
              </h3>
              <p className="mt-1 text-xs leading-6 text-blue-900/80">
                किसी भी सूचना पर कार्रवाई करने अथवा आवेदन व भुगतान करने से पूर्व संबंधित आधिकारिक स्रोत की सत्यता की पुष्टि अवश्य करें। जन कनेक्ट पोर्टल कभी भी नागरिकों से गोपनीय वित्तीय क्रेडेंशियल्स की मांग नहीं करता।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-950 py-12 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <FileText size={30} className="mx-auto text-orange-400" />
          <h2 className="mt-3 text-2xl font-extrabold text-white sm:text-3xl">
            Jan Connect से जुड़े रहें
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-xs leading-6 text-blue-100 sm:text-sm">
            नागरिक पंजीयन करके अपने क्षेत्र की सार्वजनिक सूचनाओं से हमेशा अद्यतन रहें।
          </p>

          <div className="mt-6">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 text-xs sm:text-sm font-bold text-white transition hover:bg-orange-700 shadow-md"
            >
              नागरिक पंजीयन करें
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}