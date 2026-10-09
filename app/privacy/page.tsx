import Link from "next/link";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
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

          <div className="inline-flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-900">
            <ShieldCheck size={16} />
            <span>डेटा सुरक्षा एवं निजता नीति</span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold text-blue-950 sm:text-4xl">
            गोपनीयता नीति (Privacy Policy)
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
              <span>प्रस्तावना एवं उद्देश्य</span>
            </h2>
            <p className="mt-2">
              <strong>Jan Connect</strong> (&quot;जन कनेक्ट&quot;) नागरिकों की व्यक्तिगत गोपनीयता का सम्मान करता है। यह गोपनीयता नीति स्पष्ट करती है कि पोर्टल पर पंजीकरण, सेवाओं का उपयोग और संपर्क अनुरोध दर्ज करने के दौरान एकत्रित की गई जानकारी को किस प्रकार सुरक्षित रखा जाता है।
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-900">
                2
              </span>
              <span>एकत्रित की जाने वाली जानकारी (Data Collection)</span>
            </h2>
            <p className="mt-2">
              हम केवल नागरिक सेवाओं और संपर्क सुविधा को सुगम बनाने हेतु आवश्यक न्यूनतम जानकारी एकत्र करते हैं:
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li><strong>पहचान विवरण:</strong> पूरा नाम, जन्म तिथि, लिंग।</li>
              <li><strong>संपर्क विवरण:</strong> प्राथमिक मोबाइल नंबर (प्रमाणीकरण हेतु), वैकल्पिक मोबाइल, ईमेल पता।</li>
              <li><strong>स्थानीय पता:</strong> निवास का पता, गांव/मोहल्ला, वार्ड क्रमांक, बूथ क्रमांक, विधानसभा क्षेत्र, जिला एवं पिनकोड।</li>
              <li><strong>ऐच्छिक विवरण:</strong> व्यवसाय, समग्र परिवार आईडी (केवल रिकॉर्ड मिलान हेतु, लॉगिन क्रेडेंशियल नहीं है)।</li>
              <li><strong>GPS स्थान:</strong> केवल नागरिक द्वारा &apos;Get Location&apos; बटन दबाने और ब्राउज़र अनुमति देने की दशा में।</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-900">
                3
              </span>
              <span>डेटा सुरक्षा एवं उपयोग (Data Security & Usage)</span>
            </h2>
            <p className="mt-2">
              नागरिकों द्वारा प्रदान की गई जानकारी का उपयोग केवल निम्नलिखित वैधानिक उद्देश्यों हेतु किया जाता है:
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>नागरिक पहचान का मोबाइल OTP आधारित सत्यापन।</li>
              <li>सार्वजनिक सेवाओं और संबंधित योजनाओं की जानकारी उपलब्ध कराना।</li>
              <li>नागरिक द्वारा दर्ज सहायता व संपर्क संदेशों का निवारण।</li>
              <li>क्षेत्रीय स्तर पर जनसुविधाओं की पहुँच और पारदर्शिता बढ़ाना।</li>
            </ul>
            <div className="mt-4 rounded-lg bg-slate-50 p-4 border border-slate-200">
              <p className="font-semibold text-slate-900">
                नागरिक डेटा किसी भी तृतीय पक्ष (Third Party) को व्यावसायिक या विज्ञापन लाभ हेतु बेचा अथवा साझा नहीं किया जाता।
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-900">
                4
              </span>
              <span>भूमिका-आधारित डेटा अभिगम (Role-Based Access Control)</span>
            </h2>
            <p className="mt-2">
              पोर्टल पर सुरक्षा के सख्त नियम लागू हैं:
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>नागरिक केवल अपनी प्रोफाइल और अनुमत जनसूचनाएँ देख सकते हैं।</li>
              <li>बूथ कार्यकर्ताओं को केवल उनके निर्धारित बूथ क्षेत्र की अनुमत सीमित जानकारी ही प्रदर्शित होती है; थोक नागरिक सूची (Bulk Export) प्रतिबंधित है।</li>
              <li>जनप्रतिनिधि एवं कार्यालय स्टाफ केवल अपने अधिकृत भौगोलिक क्षेत्र के डेटा का प्रबंधन कर सकते हैं।</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-900">
                5
              </span>
              <span>संपर्क एवं निजता प्रश्न</span>
            </h2>
            <p className="mt-2">
              यदि आपके पास इस गोपनीयता नीति अथवा अपने डेटा के संबंध में कोई प्रश्न है, तो कृपया हमारे{" "}
              <Link href="/contact" className="font-bold text-blue-900 underline">
                सहायता डेस्क
              </Link>{" "}
              से संपर्क करें अथवा <strong>privacy@janconnect.in</strong> पर ईमेल प्रेषित करें।
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
