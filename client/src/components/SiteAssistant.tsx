import { Fragment, useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Loader2, MessageCircle, RotateCcw, Send, Sparkles, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { answerSiteQuestion } from "@/lib/siteFaq";
import "./SiteAssistant.css";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const isStaticFaq = import.meta.env.VITE_STATIC_ASSISTANT === "faq";

const openingMessage: ChatMessage = {
  role: "assistant",
  content: isStaticFaq
    ? "أهلًا بك. أنا دليل الورشة، أجيب عن الأسئلة الشائعة المنشورة في الموقع."
    : "أهلًا بك. اسألني عن الورشة أو محاورها أو طريقة التسجيل، وسأجيبك من معلومات الموقع.",
};

const suggestedQuestions = [
  "ما الذي سأتعلمه في الورشة؟",
  "متى تبدأ وكم عدد اللقاءات؟",
  "لمن تناسب الورشة؟",
];

function renderAssistantText(text: string) {
  const plainText = text
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, "$1 $2")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*[-*]\s+/gm, "• ");
  const parts = plainText.split(/(https?:\/\/[^\s<>()]+)/gi);

  return parts.map((part, index) => {
    if (!/^https?:\/\//i.test(part)) return part;
    const trailingPunctuation = part.match(/[.,،؛:!?؟]+$/)?.[0] ?? "";
    const href = part.slice(0, part.length - trailingPunctuation.length);
    return (
      <Fragment key={`assistant-link-${index}`}>
        <a href={href} target="_blank" rel="noreferrer">{href}</a>
        {trailingPunctuation}
      </Fragment>
    );
  });
}

export default function SiteAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([openingMessage]);
  const [draft, setDraft] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [failedMessage, setFailedMessage] = useState("");
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);
  const sendingRef = useRef(false);
  const answerMutation = trpc.assistant.answer.useMutation();

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => inputRef.current?.focus());
    } else if (wasOpenRef.current) {
      launcherRef.current?.focus();
    }
    wasOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, errorMessage, answerMutation.isPending]);

  async function sendMessage(value: string, retry = false) {
    const content = value.trim();
    if (!content || sendingRef.current || answerMutation.isPending) return;

    const lastMessage = messages[messages.length - 1];
    const hasFailedUserTurn =
      Boolean(failedMessage) &&
      lastMessage?.role === "user" &&
      lastMessage.content === failedMessage;
    const previousMessages = hasFailedUserTurn ? messages.slice(0, -1) : messages;
    const history = previousMessages.slice(-8);

    if (!retry) {
      setMessages([...previousMessages, { role: "user", content }]);
      setDraft("");
    }

    setErrorMessage("");
    setFailedMessage("");
    sendingRef.current = true;

    try {
      const result = isStaticFaq
        ? { answer: answerSiteQuestion(content) }
        : await answerMutation.mutateAsync({
            message: content,
            history,
          });
      setMessages((current) => [...current, { role: "assistant", content: result.answer }]);
    } catch {
      setFailedMessage(content);
      setErrorMessage("لم أتمكن من تجهيز الإجابة. يمكنك المحاولة مجددًا أو مراسلتنا عبر واتساب.");
    } finally {
      sendingRef.current = false;
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(draft);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (draft.trim() && !answerMutation.isPending) void sendMessage(draft);
    }
  }

  function startNewConversation() {
    if (answerMutation.isPending) return;
    setMessages([openingMessage]);
    setErrorMessage("");
    setFailedMessage("");
    setDraft("");
  }

  return (
    <div className="site-assistant-root" dir="rtl">
      {isOpen && (
        <section
          className="site-assistant-panel"
          id="site-assistant-panel"
          role="dialog"
          aria-labelledby="site-assistant-title"
          aria-describedby="site-assistant-note"
          onKeyDown={(event) => {
            if (event.key === "Escape") setIsOpen(false);
          }}
        >
          <header className="site-assistant-header">
            <span className="site-assistant-mark" aria-hidden="true">
              <Sparkles size={19} />
            </span>
            <div className="site-assistant-heading">
              <h2 id="site-assistant-title">
                {isStaticFaq ? "دليل AI Navigators" : "مساعد AI Navigators"}
              </h2>
              <p>{isStaticFaq ? "إجابات ثابتة من معلومات الموقع" : "اسأل عن الورشة والتسجيل"}</p>
            </div>
            <div className="site-assistant-actions">
              <button
                className="site-assistant-icon-button"
                type="button"
                onClick={startNewConversation}
                disabled={answerMutation.isPending}
                aria-label="بدء محادثة جديدة"
                title="بدء محادثة جديدة"
              >
                <RotateCcw size={16} />
              </button>
              <button
                className="site-assistant-icon-button"
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="إغلاق المساعد"
                title="إغلاق المساعد"
              >
                <X size={19} />
              </button>
            </div>
          </header>

          <div className="site-assistant-messages" ref={messageListRef} role="log" aria-live="polite" aria-relevant="additions text">
            {messages.map((message, index) => (
              <div className={`site-assistant-message is-${message.role}`} key={`${message.role}-${index}`}>
                {message.role === "assistant" && (
                  <span className="site-assistant-avatar" aria-hidden="true"><Sparkles size={13} /></span>
                )}
                <div className="site-assistant-bubble" dir="auto">
                  <p>{message.role === "assistant" ? renderAssistantText(message.content) : message.content}</p>
                </div>
              </div>
            ))}

            {messages.length === 1 && !answerMutation.isPending && (
              <div className="site-assistant-suggestions" aria-label="أسئلة مقترحة">
                {suggestedQuestions.map((question) => (
                  <button
                    className="site-assistant-suggestion"
                    key={question}
                    type="button"
                    onClick={() => void sendMessage(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {answerMutation.isPending && (
              <div className="site-assistant-thinking" role="status" aria-label="جارٍ إعداد الإجابة">
                <Loader2 size={16} className="site-assistant-spinner" />
                <span>أراجع معلومات الموقع…</span>
              </div>
            )}

            {errorMessage && (
              <div className="site-assistant-error" role="alert">
                <p>{errorMessage}</p>
                {failedMessage && (
                  <button type="button" onClick={() => void sendMessage(failedMessage, true)}>
                    أعد المحاولة
                  </button>
                )}
                <a href="https://wa.me/201037489146" target="_blank" rel="noreferrer">
                  واتساب
                </a>
              </div>
            )}
          </div>

          <form className="site-assistant-form" onSubmit={handleSubmit}>
            <label className="site-assistant-sr-only" htmlFor="site-assistant-input">اكتب سؤالك</label>
            <textarea
              id="site-assistant-input"
              ref={inputRef}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="اكتب سؤالك هنا…"
              rows={1}
              maxLength={1200}
              disabled={answerMutation.isPending}
            />
            <button
              className="site-assistant-send"
              type="submit"
              disabled={!draft.trim() || answerMutation.isPending}
              aria-label="إرسال السؤال"
              title="إرسال السؤال"
            >
              {answerMutation.isPending ? <Loader2 size={17} className="site-assistant-spinner" /> : <Send size={17} />}
            </button>
          </form>
          <p className="site-assistant-note" id="site-assistant-note">
            تُرسل رسالتك إلى خدمة الذكاء الاصطناعي في Manus لمعالجتها. لا يحفظ الموقع سجل المحادثة؛ تجنّب مشاركة بيانات شخصية أو حساسة. {" "}
            <a href="https://wa.me/201037489146" target="_blank" rel="noreferrer">تواصل عبر واتساب</a>
          </p>
        </section>
      )}

      <button
        className="site-assistant-launcher"
        ref={launcherRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={
          isOpen
            ? "إغلاق مساعد AI Navigators"
            : isStaticFaq
              ? "اسأل دليل AI Navigators"
              : "اسأل مساعد AI Navigators"
        }
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls="site-assistant-panel"
      >
        {isOpen ? <X size={23} /> : <MessageCircle size={24} />}
        {!isOpen && (
          <span className="site-assistant-launcher-label">
            {isStaticFaq ? "اسأل دليل الورشة" : "اسأل المساعد"}
          </span>
        )}
      </button>
    </div>
  );
}
