import Link from "next/link";
import { FileCheck, ShieldAlert, ArrowLeft } from "lucide-react";

export default function TermsOfUsePage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-slate-200 pb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-900 hover:text-orange-600 mb-6"
          >
            <ArrowLeft size={16} />
            <span>मुख्य पृष्ठ पर वापस जाएँ</span>
          </Link>

          <div className="inline-flex items-center gap-2 rounded-md border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700">
            <FileCheck size={16} />
            <span>सेवा शर्तें एवं उपयोग नियमावली</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold text-blue-950 sm:text-4xl">
            नियम एवं शर्तें (Terms of Use)
          </h1>
          <p className="mt-2 text-xs text-slate-500">
            अंतिम अद्यतन: अक्टूबर 2026
          </p>
        </div>

        <div className="prose prose-slate max-w-none mt-8 space-y-8 text-xs sm:text-sm leading-relaxed text-slate-700">
          {/* Section 1 */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-900">
                1
              </span>
              <span>स्वीकृति एवं सेवा का स्वरूप</span>
            </h2>
            <p className="mt-2">
              Jan Connect पोर्टल का उपयोग करके आप इन नियमों और शर्तों का पूर्णतः पालन करने के लिए अपनी सहमति प्रदान करते हैं। यह पोर्टल नागरिकों को सार्वजनिक सूचना, कल्याणकारी योजनाओं और संपर्क सेवाओं की सुगम उपलब्धता प्रदान करने हेतु विकसित किया गया है।
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700">
                2
              </span>
              <span>गैर-सरकारी स्वतंत्र मंच स्पष्टीकरण (Statutory Disclaimer)</span>
            </h2>
            <div className="mt-2 rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-amber-900">
              <div className="flex items-start gap-2.5">
                <ShieldAlert size={18} className="shrink-0 text-amber-700 mt-0.5" />
                <p>
                  Jan Connect एक स्वतंत्र नागरिक संपर्क व सूचना तकनीकी मंच है। यह किसी भी आधिकारिक सरकारी विभाग, संवैधानिक मंत्रालय अथवा निर्वाचन आयोग का अंग नहीं है। पोर्टल पर उपलब्ध योजना विवरण आम जनता के मार्गदर्शन हेतु हैं। किसी भी योजना में आवेदन या लाभ हेतु संबंधित सरकारी विभाग की आधिकारिक वेबसाइट व नियमों का पालन अनिवार्य है।
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-900">
                3
              </span>
              <span>उपयोगकर्ता दायित्व (User Responsibilities)</span>
            </h2>
            <p className="mt-2">
              नागरिक पंजीकरण एवं पोर्टल का उपयोग करते समय उपयोगकर्ता निम्नलिखित का पालन करने हेतु वचनबद्ध है:
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>पंजीकरण फॉर्म में केवल सत्य, सटीक एवं वैध व्यक्तिगत जानकारी दर्ज करना।</li>
              <li>किसी अन्य व्यक्ति के पहचान विवरण अथवा मोबाइल नंबर का अनाधिकृत उपयोग न करना।</li>
              <li>पोर्टल पर किसी भी प्रकार की आपत्तिजनक, भ्रामक, दुर्भावनापूर्ण अथवा गैर-कानूनी सामग्री प्रेषित न करना।</li>
              <li>अपने लॉगिन OTP व क्रेडेंशियल्स की गोपनीयता बनाए रखना।</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-900">
                4
              </span>
              <span>भूमिका-आधारित नियम व अनाधिकृत प्रवेश प्रतिबंध</span>
            </h2>
            <p className="mt-2">
              जनप्रतिनिधि, स्टाफ और बूथ कार्यकर्ता खातों के माध्यम से केवल अधिकृत कार्य ही किए जा सकते हैं। किसी भी अनाधिकृत क्षेत्र के डेटा तक पहुँचने, अनधिकृत डेटा निर्यात अथवा सुरक्षा उपायों को बायपास करने का प्रयास पोर्टल की शर्तों का गंभीर उल्लंघन माना जाएगा और खाता तुरंत निलंबित कर दिया जाएगा।
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-900">
                5
              </span>
              <span>नियमों में संशोधन एवं क्षेत्राधिकार</span>
            </h2>
            <p className="mt-2">
              Jan Connect प्रशासन बिना पूर्व सूचना के इन नियमों में संशोधन करने का अधिकार सुरक्षित रखता है। अद्यतन नियम इस पृष्ठ पर प्रकाशित होते ही प्रभावी माने जाएंगे।
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
