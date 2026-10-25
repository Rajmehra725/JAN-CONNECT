
"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  Bot,
  User,
  Headphones,
  ChevronRight,
  Loader2,
  RefreshCw,
  PhoneCall,
} from "lucide-react";
import { botApi, type BotAskResponse } from "@/lib/api";

type BotStatus =
  | "ANSWERED"
  | "CLARIFYING"
  | "UNANSWERED"
  | "HANDED_OFF";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  status?: BotStatus;
  clarificationOptions?: Array<{
    faqId: string;
    question: string;
  }>;
  showHumanSupport?: boolean;
}

const QUICK_PROMPTS = [
  "पोर्टल पर लॉगिन कैसे करें?",
  "शिकायत कैसे दर्ज करें?",
  "शिकायत की स्थिति कैसे देखें?",
  "जनप्रतिनिधि निर्देशिका कहाँ है?",
  "हेल्पलाइन नंबर क्या है?",
];

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  sender: "bot",
  text: "नमस्ते! 🙏 मैं जन कनेक्ट का स्वचालित सहायता बॉट हूँ। आप मुझसे पोर्टल में लॉगिन, नागरिक पंजीकरण, शिकायत दर्ज करने, निर्देशिका या तकनीकी सहायता से संबंधित प्रश्न पूछ सकते हैं।",
  timestamp: "--:--",
  status: "ANSWERED",
};

function getCurrentTime(): string {
  return new Date().toLocaleTimeString("hi-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function createSessionId(): string {
  return (
    "sess-" +
    Math.random().toString(36).substring(2, 9) +
    "-" +
    Date.now().toString(36)
  );
}

export default function JanBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    WELCOME_MESSAGE,
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionIdRef = useRef("");
  const requestInProgressRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize session and update the welcome timestamp after mounting.
  useEffect(() => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = createSessionId();
    }

    setMessages((previous) =>
      previous.map((message) =>
        message.id === "welcome"
          ? { ...message, timestamp: getCurrentTime() }
          : message
      )
    );
  }, []);

  // Scroll to the latest message.
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [messages, isOpen, loading]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText ?? input).trim();

    if (!textToSend || requestInProgressRef.current) {
      return;
    }

    requestInProgressRef.current = true;
    setLoading(true);

    const userMessage: Message = {
      id: `user-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 7)}`,
      sender: "user",
      text: textToSend,
      timestamp: getCurrentTime(),
    };

    setMessages((previous) => [...previous, userMessage]);
    setInput("");

    try {
      if (!sessionIdRef.current) {
        sessionIdRef.current = createSessionId();
      }

      const response = await botApi.ask(
        textToSend,
        sessionIdRef.current
      );

      if (!response?.success || !response.data) {
        throw new Error(
          response?.message || "उत्तर प्राप्त नहीं हो सका।"
        );
      }

      const data: BotAskResponse = response.data;

      // Normalize the API status before handling the reply.
      const status: BotStatus = data.status;

      let replyText = "";
      let showHumanSupport = false;

      if (status === "ANSWERED" && data.answer) {
        replyText = data.answer;
      } else if (status === "CLARIFYING") {
        replyText =
          data.language === "HI"
            ? "क्या आपका मतलब इनमें से किसी विषय से है? कृपया नीचे दिए गए विकल्पों में से चुनें:"
            : "Did you mean one of these topics? Please choose an option below:";
      } else if (status === "HANDED_OFF") {
        replyText =
          data.language === "HI"
            ? "आपका प्रश्न सहायता टीम को भेजा जा रहा है। कृपया नीचे दिए गए लाइव सपोर्ट विकल्प का उपयोग करें।"
            : "Your question has been handed off to support. Please use the live support option below.";

        showHumanSupport = true;
      } else {
        replyText =
          data.language === "HI"
            ? "क्षमा करें, मुझे इस प्रश्न की सटीक जानकारी नहीं मिली। आप हमारे लाइव चैट एजेंट से बात कर सकते हैं या सीएम हेल्पलाइन 181 पर संपर्क कर सकते हैं।"
            : "Sorry, I could not find a verified answer. You can connect with live support or call CM Helpline 181.";

        showHumanSupport = true;
      }

      const botMessage: Message = {
        id: `bot-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 7)}`,
        sender: "bot",
        text: replyText,
        timestamp: getCurrentTime(),
        status,
        clarificationOptions: data.clarificationOptions,
        showHumanSupport,
      };

      setMessages((previous) => [...previous, botMessage]);
    } catch (error) {
      console.error("JanBot API error:", error);

      setMessages((previous) => [
        ...previous,
        {
          id: `error-${Date.now()}`,
          sender: "bot",
          text: "सर्वर से संपर्क करने में समस्या हुई। कृपया कुछ क्षण बाद पुनः प्रयास करें या सीधे लाइव चैट से संपर्क करें।",
          timestamp: getCurrentTime(),
          status: "UNANSWERED",
          showHumanSupport: true,
        },
      ]);
    } finally {
      requestInProgressRef.current = false;
      setLoading(false);
    }
  };

  const handleReset = () => {
    // Do not reset while an API request is running.
    if (requestInProgressRef.current) {
      return;
    }

    sessionIdRef.current = createSessionId();
    setInput("");

    setMessages([
      {
        ...WELCOME_MESSAGE,
        id: "welcome-reset",
        text: "वार्तालाप रीसेट कर दिया गया है। आप कोई भी नया प्रश्न पूछ सकते हैं।",
        timestamp: getCurrentTime(),
      },
    ]);

    inputRef.current?.focus();
  };

  const handleOpenTawk = () => {
    const win = window as Window & {
      Tawk_API?: {
        maximize?: () => void;
        toggle?: () => void;
      };
    };

    if (
      win.Tawk_API &&
      typeof win.Tawk_API.maximize === "function"
    ) {
      win.Tawk_API.maximize();
      setIsOpen(false);
      return;
    }

    window.location.href =
      "mailto:support@janconnect.in?subject=Jan%20Connect%20Support%20Request";
  };

  return (
    <>
      {/* Floating bot button */}
      {!isOpen && (
        <div className="fixed bottom-5 left-4 z-40 sm:bottom-6 sm:left-6">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            aria-label="जन कनेक्ट स्मार्ट बॉट खोलें"
            className="flex items-center gap-2.5 rounded-full border-2 border-white/80 bg-gradient-to-r from-orange-600 to-amber-600 px-4 py-3 text-white shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-orange-300"
          >
            <div className="relative shrink-0">
              <Bot className="h-6 w-6" />
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border-2 border-orange-600 bg-emerald-400" />
            </div>

            <div className="hidden text-left sm:block">
              <p className="text-xs font-bold leading-tight">
                जन कनेक्ट बॉट
              </p>
              <p className="text-[10px] font-medium leading-tight text-orange-100">
                स्वचालित त्वरित सहायता
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Chat window */}
      {isOpen && (
        <section
          role="dialog"
          aria-label="जन कनेक्ट सहायता चैट"
          aria-modal="false"
          className="fixed inset-x-2 bottom-2 z-50 flex h-[min(600px,calc(100dvh-16px))] min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:inset-x-auto sm:bottom-6 sm:left-6 sm:h-[min(600px,calc(100dvh-48px))] sm:w-[400px]"
        >
          {/* Header */}
          <header className="flex shrink-0 items-center justify-between bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 px-3.5 py-3 text-white shadow-sm sm:px-4 sm:py-3.5">
            <div className="flex min-w-0 items-center gap-3">
              <div className="shrink-0 rounded-xl bg-white/20 p-2">
                <Bot className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold leading-tight">
                    जन कनेक्ट सहायता बॉट
                  </h3>
                  <span className="rounded-full bg-emerald-500 px-1.5 py-0.5 text-[10px] font-semibold">
                    सहायता
                  </span>
                </div>

                <p className="mt-1 text-[11px] text-orange-100">
                  अक्सर पूछे जाने वाले प्रश्न एवं समाधान
                </p>
              </div>
            </div>

            <div className="ml-2 flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                title="चैट रीसेट करें"
                aria-label="चैट रीसेट करें"
                className="rounded-lg p-2 text-white/90 transition-colors hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RefreshCw className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="बंद करें"
                aria-label="चैट बंद करें"
                className="rounded-lg p-2 text-white/90 transition-colors hover:bg-white/15"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </header>

          {/* Message list */}
          <div
            aria-live="polite"
            className="min-h-0 flex-1 space-y-3.5 overflow-y-auto overscroll-contain bg-slate-50 p-3 text-xs sm:p-4 sm:text-sm"
          >
            {messages.map((message) => {
              const isUser = message.sender === "user";

              return (
                <div
                  key={message.id}
                  className={`flex gap-2.5 ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  {!isUser && (
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-orange-200 bg-orange-100 text-orange-700">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}

                  <div
                    className={`min-w-0 max-w-[85%] space-y-1.5 ${
                      isUser ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`rounded-2xl p-3 leading-relaxed shadow-sm ${
                        isUser
                          ? "rounded-br-sm bg-blue-900 font-medium text-white"
                          : "rounded-bl-sm border border-slate-200 bg-white text-slate-800"
                      }`}
                    >
                      <p className="whitespace-pre-wrap [overflow-wrap:anywhere]">
                        {message.text}
                      </p>

                      {/* Clarification options */}
                      {message.clarificationOptions &&
                        message.clarificationOptions.length > 0 && (
                          <div className="mt-3 space-y-1.5 border-t border-slate-100 pt-2">
                            {message.clarificationOptions.map(
                              (option, index) => (
                                <button
                                  key={option.faqId || `${option.question}-${index}`}
                                  type="button"
                                  onClick={() =>
                                    handleSend(option.question)
                                  }
                                  disabled={loading}
                                  className="flex w-full items-center justify-between gap-2 rounded-lg border border-orange-200 bg-orange-50 px-2.5 py-2 text-left text-xs font-semibold text-orange-900 transition-colors hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                  <span className="min-w-0 [overflow-wrap:anywhere]">
                                    {option.question}
                                  </span>
                                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-orange-600" />
                                </button>
                              )
                            )}
                          </div>
                        )}

                      {/* Human support */}
                      {message.showHumanSupport && (
                        <div className="mt-3 space-y-2 border-t border-slate-100 pt-2">
                          <p className="text-[11px] font-bold text-slate-600">
                            सहायता विकल्प:
                          </p>

                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              type="button"
                              onClick={handleOpenTawk}
                              className="flex min-w-0 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-2 py-2 text-[11px] font-bold text-white transition-colors hover:bg-emerald-700"
                            >
                              <Headphones className="h-3.5 w-3.5 shrink-0" />
                              <span>लाइव एजेंट</span>
                            </button>

                            <a
                              href="tel:181"
                              className="flex min-w-0 items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-2 py-2 text-center text-[11px] font-bold text-white transition-colors hover:bg-blue-700"
                            >
                              <PhoneCall className="h-3.5 w-3.5 shrink-0" />
                              <span>हेल्पलाइन 181</span>
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                    <p
                      className={`px-1 text-[10px] text-slate-400 ${
                        isUser ? "text-right" : "text-left"
                      }`}
                    >
                      {message.timestamp}
                    </p>
                  </div>

                  {isUser && (
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-100 text-blue-900">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Loading indicator */}
            {loading && (
              <div className="flex items-start gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-orange-200 bg-orange-100 text-orange-700">
                  <Bot className="h-4 w-4" />
                </div>

                <div className="flex items-center gap-2 rounded-2xl rounded-bl-sm border border-slate-200 bg-white p-3 text-slate-500 shadow-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-orange-600" />
                  <span className="text-xs font-medium">
                    उत्तर खोजा जा रहा है...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions */}
          {messages.length <= 2 && (
            <div className="flex shrink-0 gap-1.5 overflow-x-auto border-t border-slate-200 bg-slate-100/90 p-2">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  disabled={loading}
                  className="shrink-0 whitespace-nowrap rounded-full border border-slate-300 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 shadow-sm transition-colors hover:border-orange-500 hover:text-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Message input */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void handleSend();
            }}
            className="flex shrink-0 items-center gap-2 border-t border-slate-200 bg-white p-2.5 sm:p-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="अपना प्रश्न यहाँ लिखें..."
              aria-label="अपना प्रश्न लिखें"
              autoComplete="off"
              maxLength={2000}
              disabled={loading}
              className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200 disabled:opacity-50"
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              aria-label="संदेश भेजें"
              className="shrink-0 rounded-xl bg-orange-600 p-2.5 text-white shadow-sm transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </section>
      )}
    </>
  );
}
