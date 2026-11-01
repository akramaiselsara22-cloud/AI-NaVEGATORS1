import { useState, type FormEvent } from "react";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpLeft,
  BookOpenCheck,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Compass,
  FileCheck2,
  Lightbulb,
  MessageCircle,
  PenLine,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  Video,
  UsersRound,
} from "lucide-react";

type ContactMethod = "whatsapp" | "email";

const whatsappNumber = "201037489146";
const telegramCommunity = "https://t.me/+uJ3JXA8ADbw5Y2U0";
const telegramBot = "https://t.me/enteshar_ai_bot";
const facebookPage = "https://www.facebook.com/abo.aisel.elmasry";

const sessions = [
  {
    number: "01",
    title: "الجمهور والهدف والصوت",
    description: "نحدد لمن نكتب، وما الفعل الذي نريده، وبأي نبرة نريد أن نُسمع.",
    output: "بطاقة المشروع والجمهور والهدف",
    icon: Target,
  },
  {
    number: "02",
    title: "الفكرة والزاوية والهيكل",
    description: "نحوّل الموضوع الواسع إلى فكرة قابلة للتنفيذ، ونبني هيكلًا وخطافات مناسبة.",
    output: "فكرة مختبرة وثلاث زوايا وخطافات",
    icon: Lightbulb,
  },
  {
    number: "03",
    title: "البرومبت والإنتاج",
    description: "نصوغ طلبًا منضبطًا وننتج مسودة أولى نعرف كيف نراجعها.",
    output: "برومبت موثق ومسودة وسجل قبل/بعد",
    icon: Sparkles,
  },
  {
    number: "04",
    title: "التحرير والصوت وإعادة الاستخدام",
    description: "نحذف الحشو، ونثبت صوت الكاتب، ونحوّل الفكرة إلى قالب آخر.",
    output: "نسخة محررة وقالب إضافي",
    icon: PenLine,
  },
  {
    number: "05",
    title: "التحقق والأخلاقيات",
    description: "نراجع الادعاءات والمصادر والخصوصية وحقوق الاستخدام قبل النشر.",
    output: "سجل تحقق ومصادر وقرارات تحرير",
    icon: ShieldCheck,
  },
  {
    number: "06",
    title: "المراجعة والتسليم والمتابعة",
    description: "نعرض المشروع النهائي ونضع خطة عملية لاستخدامه ومتابعته.",
    output: "ملف نهائي وخطة نشر لأربعة أسابيع",
    icon: FileCheck2,
  },
];

const outcomes = [
  "بطاقة مشروع وجمهور وهدف واضح",
  "فكرة معتمدة مع زوايا وخطافات وهيكل مناسب لمنصة واحدة",
  "برومبت موثق ومسودة أولى وسجل قبل/بعد",
  "نسخة محررة بصوتك وسجل للتحقق من الادعاءات والمصادر",
  "قالب إضافي لإعادة استخدام الفكرة ومشروع نهائي قابل للمراجعة",
  "خطة متابعة ونشر لأربعة أسابيع",
];

const faqs = [
  {
    question: "متى تبدأ الورشة؟",
    answer: "تبدأ يوم الجمعة 6 نوفمبر 2026، وتُعقد اللقاءات أونلاين مباشر.",
  },
  {
    question: "كم عدد اللقاءات ومدة كل لقاء؟",
    answer: "البرنامج مكوّن من ستة لقاءات، مدة كل لقاء 90 دقيقة.",
  },
  {
    question: "هل أحتاج إلى أداة ذكاء اصطناعي مدفوعة؟",
    answer: "لا يشترط ذلك. الأداة وسيلة؛ ويركز المنهج على التفكير والكتابة والتحرير والتحقق، مع بدائل يدوية للأنشطة التي تعتمد على الأداة.",
  },
  {
    question: "هل سأعمل على مثال عام؟",
    answer: "ستعمل على فكرة أو محتوى حقيقي من مجالك، وتبني عليه مشروعًا تطبيقيًا متدرجًا تحفظ مخرجاته بعد كل لقاء.",
  },
  {
    question: "هل تضمن الورشة انتشار المحتوى؟",
    answer: "لا. تركز الورشة على محتوى أوضح وأكثر ملاءمة وموثوقية وقابلية للقياس، ولا تَعِد بانتشار مضمون.",
  },
  {
    question: "كيف أتم التسجيل؟",
    answer: "أكمل النموذج في هذه الصفحة. سيفتح واتساب برسالة جاهزة من بياناتك؛ لا يُرسل الطلب ولا يُعد التسجيل مكتملًا إلا بعد أن تضغط زر الإرسال داخل واتساب.",
  },
  {
    question: "هل توجد شهادة؟",
    answer: "تذكر المواد أن الشهادة تُصدر بعد استيفاء المشروع النهائي والاختبار وشروط التقييم المعتمدة.",
  },
];

function BrandMark() {
  return (
    <a className="brand" href="#top" aria-label="AI Navigators — إلى أعلى الصفحة">
      <span className="brand-symbol" aria-hidden="true">
        <Compass size={25} strokeWidth={2.4} />
        <span className="brand-spark">✦</span>
      </span>
      <span className="brand-wordmark">
        <span><b>AI</b> NAVIGATORS</span>
        <small>قادة الذكاء الاصطناعي</small>
      </span>
    </a>
  );
}

function WhatsappIcon() {
  return <MessageCircle size={18} strokeWidth={2.2} aria-hidden="true" />;
}

export default function Home() {
  const [contactMethod, setContactMethod] = useState<ContactMethod>("whatsapp");
  const [contactValue, setContactValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [whatsappFallback, setWhatsappFallback] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const goal = String(form.get("goal") ?? "").trim();
    const experience = String(form.get("experience") ?? "");
    const source = String(form.get("source") ?? "");
    const consent = form.get("consent") ? "نعم" : "لا";
    const contactLabel = contactMethod === "whatsapp" ? "واتساب" : "البريد الإلكتروني";

    const message = [
      "مرحبًا، أرغب في التسجيل في ورشة «الكتابة الهادفة بالذكاء الاصطناعي».",
      "",
      `الاسم: ${name}`,
      `وسيلة التواصل (${contactLabel}): ${contactValue.trim()}`,
      `هدفي من المشاركة: ${goal}`,
      `مستوى الخبرة: ${experience}`,
      `الموافقة على رسائل التذكير: ${consent}`,
      `عرفت عن الورشة من: ${source}`,
    ].join("\n");

    setSubmitted(true);
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    setWhatsappFallback(url);
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) window.location.assign(url);
  }

  return (
    <div className="site-shell" dir="rtl" id="top">
      <header className="site-header">
        <div className="header-inner">
          <BrandMark />
          <nav className="desktop-nav" aria-label="التنقل الرئيسي">
            <a href="#about">عن الورشة</a>
            <a href="#journey">اللقاءات</a>
            <a href="#faq">الأسئلة الشائعة</a>
          </nav>
          <a className="button button-gold header-cta" href="#register">
            <WhatsappIcon />
            <span>احجز مكانك مجانًا عبر واتساب</span>
            <ArrowUpLeft size={16} aria-hidden="true" />
          </a>
        </div>
      </header>

      <main>
        <section className="hero section-wrap" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> ورشة عملية <i /> أونلاين مباشر</div>
            <h1 id="hero-title">اكتب محتوى <em>واضحًا وموثوقًا</em> بصوتك أنت.</h1>
            <p className="hero-lede">بمساعدة الذكاء الاصطناعي، لا بدلًا منك. رحلة تطبيقية من تحديد الجمهور والهدف إلى محتوى محرر، متحقق من ادعاءاته، وقابل للنشر وإعادة الاستخدام.</p>
            <div className="hero-facts">
              <div><CalendarDaysIcon /><span>الجمعة<br /><b>6 نوفمبر 2026</b></span></div>
              <div><Clock3 size={19} /><span>البرنامج<br /><b>6 لقاءات × 90 دقيقة</b></span></div>
              <div><Video size={19} /><span>الحضور<br /><b>أونلاين مباشر</b></span></div>
            </div>
            <a className="button button-gold hero-cta" href="#register">
              <WhatsappIcon /> احجز مكانك مجانًا عبر واتساب <ArrowLeft size={17} aria-hidden="true" />
            </a>
            <p className="hero-note"><ShieldCheck size={15} /> لا نعدك بانتشار مضمون؛ نمنحك منهجًا أوضح وقرارات تحرير أفضل.</p>
          </div>
          <div className="hero-art-wrap">
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <figure className="hero-art">
              <img src="/manus-storage/TheArtofImpactfulWritingwithAI_3c076c81.png" alt="الصورة المرجعية لورشة الكتابة المؤثرة بالذكاء الاصطناعي مع المدرب وهو يكتب أمام حاسوبه" />
              <figcaption><span className="image-caption-mark">✦</span><span>THE ART OF<br /><b>IMPACTFUL WRITING</b></span><small>WITH AI</small></figcaption>
            </figure>
            <div className="floating-note"><span className="floating-icon"><PenLine size={17} /></span><span><b>صوتك أولًا</b><small>الأداة تقترح، وأنت تقرر</small></span></div>
            <div className="hero-index">01 <span /> AI NAVIGATORS</div>
          </div>
          <a className="scroll-cue" href="#about" aria-label="اكتشف تفاصيل الورشة"><ArrowDownLeft size={17} /> اكتشف تفاصيل الورشة</a>
        </section>

        <section className="signal-strip" aria-label="ملخص الورشة">
          <div><span>01</span><b>جمهور محدد</b><small>قبل أن تبدأ الكتابة</small></div>
          <div><span>02</span><b>تحرير بشري</b><small>يحافظ على صوتك</small></div>
          <div><span>03</span><b>تحقق مسؤول</b><small>قبل النشر والمشاركة</small></div>
          <div className="strip-side-note">الفكرة ليست نصًا.<br /><strong>إنها قرار يصل لشخص محدد.</strong></div>
        </section>

        <section className="section section-intro" id="about">
          <div className="section-kicker"><span>01 / الفكرة</span><i /></div>
          <div className="intro-grid">
            <h2>من الضوضاء<br />إلى <span className="gold-text">الرسالة.</span></h2>
            <div className="intro-copy">
              <p className="intro-quote">«الكلام ده معمول عشاني.»</p>
              <p>هذه هي اللحظة التي نكتب من أجلها. لكن الوصول إليها يبدأ قبل الكلمات: بمن نخاطب؟ ماذا نريد منه؟ وما الذي يجب أن يبقى بصوتنا نحن؟</p>
              <p>في ستة لقاءات عملية، ستتعلم كيف توظف الذكاء الاصطناعي من دون أن تسلمه صوتك أو تفكيرك، وكيف تبني محتوى حقيقيًا خطوة خطوة.</p>
              <a className="text-link" href="#journey">استكشف رحلة اللقاءات <ArrowLeft size={17} /></a>
            </div>
          </div>
          <div className="problem-grid">
            <article className="problem-card"><span className="problem-no">01</span><div className="problem-icon"><MessageCircle size={20} /></div><h3>طلب عام، ونص عام</h3><p>تكتب للأداة «اكتب منشورًا جذابًا»، فتعود إليك كلمات تشبه كلمات الجميع.</p></article>
            <article className="problem-card"><span className="problem-no">02</span><div className="problem-icon"><Target size={20} /></div><h3>فكرة بلا مسار</h3><p>تعرف الموضوع، لكن تحويله إلى هدف وهيكل ومحتوى قابل للتنفيذ ليس واضحًا.</p></article>
            <article className="problem-card"><span className="problem-no">03</span><div className="problem-icon"><ShieldCheck size={20} /></div><h3>تردد قبل النشر</h3><p>تريد أن تتحقق من رقم أو مصدر أو وعد قبل أن تضع اسمك على المحتوى.</p></article>
          </div>
        </section>

        <section className="outcomes-section section" aria-labelledby="outcomes-title">
          <div className="outcomes-visual">
            <div className="outcome-glow" />
            <div className="outcome-emblem"><Compass size={44} strokeWidth={1.4} /><span>AI</span></div>
            <span className="outcome-orbit orbit-a" /><span className="outcome-orbit orbit-b" />
            <div className="outcome-caption">من الفكرة <span>←</span> إلى أثر واضح</div>
          </div>
          <div className="outcomes-copy">
            <div className="section-kicker"><span>02 / النتيجة</span><i /></div>
            <h2 id="outcomes-title">مشروع حقيقي.<br /><span className="blue-text">ومسار يمكنك تكراره.</span></h2>
            <p>لن تخرج بكلام فقط. ستبني مشروعًا من مجالك وتحفظ القرارات والمخرجات مع كل لقاء، حتى يصبح لديك محتوى واضح يمكنك مراجعته وإعادة استخدامه.</p>
            <ul className="outcome-list">{outcomes.map((outcome) => <li key={outcome}><span><Check size={14} /></span>{outcome}</li>)}</ul>
          </div>
        </section>

        <section className="section journey-section" id="journey">
          <div className="section-kicker"><span>03 / الرحلة</span><i /></div>
          <div className="journey-heading"><div><h2>ست محطات.<br /><span className="gold-text">ومشروع ينمو معك.</span></h2><p>كل لقاء يضيف مخرجًا محفوظًا إلى مشروعك التطبيقي.</p></div><div className="journey-meta"><Clock3 size={18} /><span>90 دقيقة لكل لقاء</span><i /> <Video size={18} /><span>أونلاين مباشر</span></div></div>
          <div className="timeline">
            {sessions.map((session, index) => {
              const Icon = session.icon;
              return <article className="session-card" key={session.number}>
                <div className="session-marker"><span>{session.number}</span>{index < sessions.length - 1 && <i />}</div>
                <div className="session-body"><div className="session-topline"><span>اللقاء {session.number}</span><Icon size={19} /></div><h3>{session.title}</h3><p>{session.description}</p><div className="session-output"><BookOpenCheck size={16} /><span>المخرج</span><b>{session.output}</b></div></div>
              </article>;
            })}
          </div>
        </section>

        <section className="before-after-section section" aria-labelledby="before-after-title">
          <div className="before-after-heading"><div className="section-kicker"><span>04 / مثال تطبيقي</span><i /></div><h2 id="before-after-title">الفرق يظهر<br />في <span className="gold-text">القرار الذي يسبق الكلمات.</span></h2><p>الذكاء الاصطناعي يقترح. أنت تختار وتحرر وتتحقق وتتحمل مسؤولية ما تنشره.</p></div>
          <div className="comparison">
            <article className="comparison-card comparison-before"><div className="comparison-label"><span>قبل</span><i /> طلب مفتوح</div><p>«اكتب لي منشورًا جذابًا عن التسويق.»</p><div className="comparison-foot"><span className="comparison-status"><i /> عام</span><small>لا جمهور محددًا ولا هدفًا</small></div></article>
            <div className="comparison-arrow"><ArrowLeft size={25} /><span>وضوح القرار</span></div>
            <article className="comparison-card comparison-after"><div className="comparison-label"><span>بعد</span><i /> طلب له قصد</div><p>«اكتب لصاحب متجر صغير يريد وصف منتج جديد بوضوح، بهدف أن يرسل القارئ سؤالًا، وبصوت مباشر، دون اختراع أرقام أو مصادر.»</p><div className="comparison-foot"><span className="comparison-status"><i /> محدد</span><small>جمهور وهدف وصوت وحدود</small></div></article>
          </div>
        </section>

        <section className="section fit-section">
          <div className="section-kicker"><span>05 / الملاءمة</span><i /></div>
          <div className="fit-heading"><h2>هل هذه الورشة<br /><span className="gold-text">مناسبة لك؟</span></h2><p>لا تحتاج خبرة تقنية متقدمة. تحتاج إلى فكرة حقيقية تريد العمل عليها.</p></div>
          <div className="fit-columns">
            <article className="fit-card fit-yes"><div className="fit-card-head"><span className="fit-icon"><Check size={20} /></span><div><span>قد تناسبك إذا كنت</span><h3>تريد كتابة أقرب إليك.</h3></div></div><ul><li><UsersRound size={17} /> صانع محتوى يريد الحفاظ على بصمته الشخصية.</li><li><Target size={17} /> صاحب مشروع يحتاج لغة توضّح قيمة ما يقدمه.</li><li><PenLine size={17} /> مدربًا أو مسوقًا أو مبتدئًا إلى متوسط.</li><li><BookOpenCheck size={17} /> مستعدًا للعمل على موضوع حقيقي وتطبيق المهام.</li></ul></article>
            <article className="fit-card fit-no"><div className="fit-card-head"><span className="fit-icon"><CircleHelp size={20} /></span><div><span>قد لا تناسبك إذا كنت</span><h3>تبحث عن وعود سريعة.</h3></div></div><ul><li><span className="cross-mark">×</span> تريد ضمان الانتشار أو مضاعفة التفاعل.</li><li><span className="cross-mark">×</span> تريد نسخ محتوى الآخرين أو اختراع مصادر.</li><li><span className="cross-mark">×</span> لا تستطيع حضور اللقاءات وتنفيذ المهام التطبيقية.</li></ul></article>
          </div>
        </section>

        <section className="faq-section section" id="faq">
          <div className="section-kicker"><span>06 / أسئلة شائعة</span><i /></div>
          <div className="faq-layout"><div className="faq-intro"><h2>أسئلة قبل<br /><span className="blue-text">أن تبدأ.</span></h2><p>إذا بقي سؤال، أرسله لنا عبر واتساب وسنساعدك على معرفة ما إذا كانت الورشة تناسبك.</p><a className="text-link" href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">اسألنا عبر واتساب <ArrowLeft size={16} /></a></div>
            <div className="faq-list">{faqs.map((faq, index) => <details className="faq-item" key={faq.question} open={index === 0}><summary><span className="faq-number">0{index + 1}</span><b>{faq.question}</b><ChevronDown size={18} /></summary><p>{faq.answer}</p></details>)}</div>
          </div>
        </section>

        <section className="register-section section" id="register">
          <div className="register-copy"><div className="section-kicker"><span>07 / التسجيل</span><i /></div><div className="register-overline"><span className="live-dot" /> الدفعة الأولى · الجمعة 6 نوفمبر 2026</div><h2>ابدأ من فكرة<br /><span className="gold-text">تستحق أن تُكتب.</span></h2><p>املأ البيانات التالية لفتح رسالة تسجيل جاهزة على واتساب. لن نخزن بياناتك هنا، ولن يُرسل الطلب إلا عندما تراجعه وتضغط إرسال داخل واتساب.</p><div className="register-assurance"><ShieldCheck size={20} /><span><b>بياناتك لا تُحفظ في هذه الصفحة.</b><small>تنتقل إلى واتساب فقط عند فتح الرسالة وإرسالها بنفسك.</small></span></div><div className="register-social-proof"><span className="social-orbit"><Compass size={24} /></span><span>AI NAVIGATORS<small>من الفكرة إلى محتوى موثوق</small></span></div></div>
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-heading"><div><span>REGISTRATION / 01</span><h3>خطوتك الأولى تبدأ هنا.</h3></div><span className="form-index">06<br /><small>NOV</small></span></div>
            <p className="form-description">املأ بياناتك لتجهيز رسالة التسجيل. الحقول ذات النجمة مطلوبة.</p>
            <label className="field-label" htmlFor="full-name">الاسم الكامل <i>*</i></label>
            <input className="form-control" id="full-name" name="name" type="text" placeholder="اكتب اسمك كما تريد أن نناديك" autoComplete="name" required />
            <div className="field-split"><fieldset className="contact-choice"><legend>وسيلة التواصل <i>*</i></legend><label><input type="radio" name="contactMethod" value="whatsapp" checked={contactMethod === "whatsapp"} onChange={() => { setContactMethod("whatsapp"); setContactValue(""); }} /> واتساب</label><label><input type="radio" name="contactMethod" value="email" checked={contactMethod === "email"} onChange={() => { setContactMethod("email"); setContactValue(""); }} /> بريد إلكتروني</label></fieldset>
              <div className="contact-input-wrap"><label className="field-label" htmlFor="contact-value">{contactMethod === "whatsapp" ? "رقم واتساب" : "البريد الإلكتروني"} <i>*</i></label><input className="form-control" id="contact-value" name="contactValue" type={contactMethod === "whatsapp" ? "tel" : "email"} inputMode={contactMethod === "whatsapp" ? "tel" : "email"} autoComplete={contactMethod === "whatsapp" ? "tel" : "email"} placeholder={contactMethod === "whatsapp" ? "+20 1x xxxx xxxx" : "you@example.com"} value={contactValue} onChange={(event) => setContactValue(event.target.value)} required /></div>
            </div>
            <label className="field-label" htmlFor="goal">ما هدفك من المشاركة؟ <i>*</i></label>
            <textarea className="form-control form-textarea" id="goal" name="goal" placeholder="مثلًا: أريد كتابة محتوى أوضح لمشروعي" rows={3} required />
            <div className="field-split">
              <div><label className="field-label" htmlFor="experience">مستوى الخبرة <i>*</i></label><select className="form-control form-select" id="experience" name="experience" defaultValue="" required><option value="" disabled>اختر مستواك</option><option>مبتدئ</option><option>متوسط</option><option>متقدم</option></select></div>
              <div><label className="field-label" htmlFor="source">عرفت عن الورشة من <i>*</i></label><select className="form-control form-select" id="source" name="source" defaultValue="" required><option value="" disabled>اختر مصدرًا</option><option>تليجرام</option><option>واتساب</option><option>فيسبوك</option><option>شخص رشحها لي</option><option>أخرى</option></select></div>
            </div>
            <label className="consent-row"><input type="checkbox" name="consent" value="yes" required /><span className="consent-check"><Check size={13} /></span><span>أوافق على استقبال رسالة التأكيد وتذكيرات الورشة والمواد المرتبطة بها عبر وسيلة التواصل التي اخترتها.</span></label>
            <button className="button button-gold form-submit" type="submit"><WhatsappIcon /> احجز مكانك مجانًا عبر واتساب <Send size={16} /></button>
            <p className="form-privacy"><ShieldCheck size={14} /> لن يتم إرسال بياناتك قبل مراجعة الرسالة والضغط على «إرسال» داخل واتساب.</p>
            {submitted && <div className="form-status" role="status"><Check size={16} /><span>فُتحت رسالة واتساب. أرسلها، ثم أكمل التسجيل في بوت الورشة.</span><a href={telegramBot} target="_blank" rel="noreferrer">افتح بوت تليجرام</a>{whatsappFallback && <a className="form-status-fallback" href={whatsappFallback} target="_blank" rel="noreferrer">إعادة فتح الرسالة</a>}</div>}
            <div className="form-divider"><span>أو</span></div>
            <a className="telegram-link" href={telegramBot} target="_blank" rel="noreferrer"><Send size={16} /> الخطوة التالية: أكمل التسجيل في بوت تليجرام <ArrowUpLeft size={15} /></a>
            <p className="bot-note">بعد إرسال رسالة واتساب، اضغط «ابدأ» في بوت مساعد الورشة وأكمل خطوات التسجيل هناك. لا تنتقل بيانات النموذج إلى البوت تلقائيًا.</p>
            <a className="community-link" href={telegramCommunity} target="_blank" rel="noreferrer">انضم إلى مجتمع AI Navigators على تليجرام</a>
          </form>
        </section>
      </main>

      <footer className="site-footer"><div className="footer-top"><BrandMark /><p>اكتب أقل عشوائية.<br /><b>واكتب أكثر قصدًا.</b></p><a className="button button-gold footer-cta" href="#register"><WhatsappIcon /> احجز مكانك مجانًا عبر واتساب <ArrowUpLeft size={15} /></a></div><div className="footer-bottom"><span>© AI NAVIGATORS · 2026</span><nav aria-label="روابط التواصل"><a href={facebookPage} target="_blank" rel="noreferrer">فيسبوك</a><a href={telegramCommunity} target="_blank" rel="noreferrer">مجتمع تليجرام</a><a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">واتساب</a></nav><span>الأداة تقترح. أنت تقرر.</span></div></footer>
    </div>
  );
}

function CalendarDaysIcon() {
  return <span className="calendar-icon"><span>06</span><small>NOV</small></span>;
}
