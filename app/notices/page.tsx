import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Bell,
  CalendarDays,
  ChevronRight,
  FileText,
  Info,
  Megaphone,
  Search,
  ShieldCheck,
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

async function getNotices(): Promise<Notice[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
         return [];
    }

    const response = await fetch(`${apiUrl}/api/notices`, {
      next: {
        revalidate: 60,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch notices");
    }

    const data = await response.json();

    // Backend response:
    // { success: true, notices: [...] }

    return data.notices || [];
  } catch (error) {
    console.error("Notice API Error:", error);
    return [];
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

function getNoticeCategory(notice: Notice) {
  if (notice.category) return notice.category;

  if (notice.noticeType) return notice.noticeType;

  return "सामान्य सूचना";
}

function NoticeCard({ notice }: { notice: Notice }) {
  return (
    <article className="border border-slate-200 bg-white transition hover:border-blue-200 hover:shadow-md">
      <div className="flex flex-col gap-4 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-blue-50 text-blue-900">
              <Bell size={21} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                  {getNoticeCategory(notice)}
                </span>

                {notice.isImportant && (
                  <span className="bg-orange-100 px-2.5 py-1 text-[11px] font-bold text-orange-700">
                    महत्वपूर्ण
                  </span>
                )}
              </div>

              <h2 className="mt-3 text-lg font-bold leading-7 text-slate-900">
                {notice.title}
              </h2>
            </div>
          </div>
        </div>

        {notice.description && (
          <p className="text-sm leading-6 text-slate-600">
            {notice.description}
          </p>
        )}

        <div className="flex flex-col justify-between gap-4 border-t border-slate-100 pt-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <CalendarDays size={15} />
            <span>
              {formatDate(notice.publishedAt || notice.date)}
            </span>
          </div>

          {notice.attachmentUrl && (
            <a
              href={notice.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-blue-900 hover:text-orange-600"
            >
              दस्तावेज देखें
              <ArrowRight size={16} />
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
      {/* Top Bar */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs text-slate-600 sm:px-6 lg:px-8">
          <p>नागरिक संपर्क एवं सार्वजनिक सेवा पोर्टल</p>

          <div className="hidden items-center gap-4 sm:flex">
            <span>हिंदी</span>
            <span className="text-slate-300">|</span>
            <span>English</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center bg-blue-900 text-white">
              <ShieldCheck size={24} />
            </div>

            <div>
              <div className="text-xl font-extrabold tracking-tight text-blue-950">
                JAN CONNECT
              </div>

              <div className="text-xs font-medium text-slate-500">
                नागरिक संपर्क पोर्टल
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            <Link
              href="/"
              className="text-sm font-medium text-slate-600 hover:text-blue-900"
            >
              होम
            </Link>

            <Link
              href="/about"
              className="text-sm font-medium text-slate-600 hover:text-blue-900"
            >
              हमारे बारे में
            </Link>

            <Link
              href="/services"
              className="text-sm font-medium text-slate-600 hover:text-blue-900"
            >
              सेवाएँ
            </Link>

            <Link
              href="/schemes"
              className="text-sm font-medium text-slate-600 hover:text-blue-900"
            >
              योजनाएँ
            </Link>

            <Link
              href="/notices"
              className="text-sm font-semibold text-blue-900"
            >
              सूचनाएँ
            </Link>

            <Link
              href="/contact"
              className="text-sm font-medium text-slate-600 hover:text-blue-900"
            >
              संपर्क
            </Link>
          </nav>

          <Link
            href="/login/citizen"
            className="inline-flex items-center gap-2 bg-blue-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            लॉगिन
            <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-700">
              <Megaphone size={15} />
              सार्वजनिक सूचना केंद्र
            </div>

            <h1 className="text-3xl font-extrabold leading-tight text-blue-950 sm:text-4xl lg:text-5xl">
              नवीनतम
              <span className="text-orange-600"> सूचनाएँ</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Jan Connect पर प्रकाशित महत्वपूर्ण सूचनाएँ, घोषणाएँ और
              सार्वजनिक जानकारी यहाँ प्राप्त करें।
            </p>
          </div>
        </div>
      </section>

      {/* Notice Search UI */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                सार्वजनिक सूचनाएँ
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                नवीनतम प्रकाशित सूचनाएँ देखें।
              </p>
            </div>

            <div className="flex w-full items-center border border-slate-300 bg-white md:max-w-sm">
              <Search size={18} className="ml-3 text-slate-400" />

              <input
                type="text"
                placeholder="सूचना खोजें..."
                className="w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Notices */}
      <section className="bg-slate-50 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {notices.length > 0 ? (
            <div className="space-y-4">
              {notices.map((notice) => (
                <NoticeCard key={notice._id} notice={notice} />
              ))}
            </div>
          ) : (
            <div className="border border-slate-200 bg-white px-6 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center bg-slate-100 text-slate-500">
                <Info size={25} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                अभी कोई सूचना उपलब्ध नहीं है
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                नई सूचना प्रकाशित होने पर वह इस पेज पर दिखाई देगी।
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Important Note */}
      <section className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 border border-blue-100 bg-blue-50 p-5 sm:p-6">
            <AlertCircle
              size={22}
              className="mt-0.5 shrink-0 text-blue-900"
            />

            <div>
              <h3 className="font-bold text-blue-950">
                महत्वपूर्ण सूचना
              </h3>

              <p className="mt-2 text-sm leading-6 text-blue-900/80">
                किसी भी सूचना पर कार्रवाई करने से पहले उसकी पूरी जानकारी
                ध्यानपूर्वक पढ़ें। आवेदन, भुगतान या किसी अन्य प्रक्रिया के
                लिए संबंधित आधिकारिक स्रोत की पुष्टि अवश्य करें।
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-950 py-14">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <FileText
            size={32}
            className="mx-auto text-orange-400"
          />

          <h2 className="mt-4 text-2xl font-extrabold text-white sm:text-3xl">
            Jan Connect से जुड़े रहें
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-blue-100">
            नागरिक पंजीयन करके Jan Connect की उपलब्ध डिजिटल सेवाओं का
            उपयोग करें।
          </p>

          <div className="mt-7">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-orange-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
            >
              नागरिक पंजीयन करें
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <div className="font-extrabold text-blue-950">
                JAN CONNECT
              </div>

              <p className="mt-1 text-xs text-slate-500">
                नागरिक संपर्क एवं सार्वजनिक सेवा पोर्टल
              </p>
            </div>

            <div className="flex flex-wrap gap-5 text-xs text-slate-500">
              <Link href="/privacy" className="hover:text-blue-900">
                गोपनीयता नीति
              </Link>

              <Link href="/terms" className="hover:text-blue-900">
                नियम एवं शर्तें
              </Link>

              <Link href="/contact" className="hover:text-blue-900">
                संपर्क
              </Link>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5 text-center text-xs text-slate-500">
            © 2026 Jan Connect. सर्वाधिकार सुरक्षित।
          </div>
        </div>
      </footer>
    </main>
  );
}