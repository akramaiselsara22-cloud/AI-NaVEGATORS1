import os
import sys
import logging
import sqlite3
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    ContextTypes
)

# قراءة التوكن والآدمن من بيئة السيرفر بأمان
BOT_TOKEN = os.environ.get("BOT_TOKEN")
ADMIN_ID = int(os.environ.get("ADMIN_ID", "0"))

if not BOT_TOKEN:
    print("خطأ: لم يتم ضبط متغير BOT_TOKEN في إعدادات السيرفر!")
    sys.exit(1)

GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScThY3NxIxvmg1noZD9HK2xEjWGn5kI7sVj_D1fSdVAPbenAQ/viewform"
WEBSITE_URL = "https://akramaiselsara22-cloud.github.io/AI-NaVEGATORS1/#journey"

logging.basicConfig(format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO)

def init_db():
    conn = sqlite3.connect("subscribers.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS subscribers (
            chat_id INTEGER PRIMARY KEY,
            username TEXT,
            full_name TEXT,
            subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

def add_subscriber(chat_id: int, username: str, full_name: str):
    conn = sqlite3.connect("subscribers.db")
    cursor = conn.cursor()
    cursor.execute("INSERT OR IGNORE INTO subscribers (chat_id, username, full_name) VALUES (?, ?, ?)",
                   (chat_id, username or "", full_name or ""))
    conn.commit()
    conn.close()

def get_all_subscribers():
    conn = sqlite3.connect("subscribers.db")
    cursor = conn.cursor()
    cursor.execute("SELECT chat_id FROM subscribers")
    users = cursor.fetchall()
    conn.close()
    return [u[0] for u in users]

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    chat_id = update.effective_chat.id
    add_subscriber(chat_id, user.username, user.full_name)

    keyboard = [
        [InlineKeyboardButton("📝 اضغط هنا لملء استمارة التسجيل", url=GOOGLE_FORM_URL)],
        [InlineKeyboardButton("🌐 استكشف محطات الورشة بالموقع", url=WEBSITE_URL)]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)

    welcome_text = (
        f"أهلاً بك يا {user.first_name} في **AI Navigators**! 🚀\n\n"
        "يسعدنا انضمامك لورشة **الكتابة بالذكاء الاصطناعي**.\n\n"
        "📌 **لتأكيد حجز مكانك في الورشة واستلام التذكيرات ومواعيد اللقاءات المباشرة:**\n"
        "اضغط على زر الاستمارة بالأسفل وسجل بياناتك.\n\n"
        "للتعرف على قوانين الورشة والجروب، اضغط: /rules"
    )
    await update.message.reply_text(welcome_text, reply_markup=reply_markup, parse_mode="Markdown")

async def rules(update: Update, context: ContextTypes.DEFAULT_TYPE):
    rules_text = (
        "📜 **ميثاق وقوانين الورشة ومجتمع AI Navigators:**\n\n"
        "1. **الالتزام والممارسة:** الورشة قائمة على التطبيق العملي؛ احرص على حضور اللقاءات المباشرة وتسليم المخرجات في موعدها.\n"
        "2. **الاحترام المتبادل:** هذا المجتمع مساحة آمنة للتعلم ومشاركة الأفكار والأسئلة البنّاءة.\n"
        "3. **منع الإعلانات والسبام:** يمنع منعاً باتاً نشر أي روابط خارجية، إعلانات، أو ترويج لخدمات أو مجموعات أخرى دون إذن مسبق.\n"
        "4. **الحفاظ على الخصوصية:** يُمنع مراسلة الأعضاء في الخاص بدون إذن أو مشاركة بياناتهم خارج الجروب.\n"
        "5. **شعارنا الدائم:** «الأداة تقترح.. وأنت من يقرر». احتفظ بصوتك وأسلوبك دائماً.\n\n"
        "نتمنى للجميع رحلة تدريبية ممتعة ومثمرة! 🌟"
    )
    await update.message.reply_text(rules_text, parse_mode="Markdown")

async def journey(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [[InlineKeyboardButton("🗺️ عرض محطات اللقاءات بالموقع", url=WEBSITE_URL)]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    await update.message.reply_text("يمكنك الاطلاع على تفاصيل المحطات والمشاريع العملية عبر الرابط التالي:", reply_markup=reply_markup)

async def remind_all(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if ADMIN_ID != 0 and update.effective_user.id != ADMIN_ID:
        await update.message.reply_text("عذراً، هذا الأمر مخصص لمدير الورشة فقط.")
        return

    message_to_send = " ".join(context.args)
    if not message_to_send:
        await update.message.reply_text("⚠️ يرجى كتابة نص التذكير بعد الأمر.\nمثال:\n`/remind رابط لقاء اليوم: ...`", parse_mode="Markdown")
        return

    subscribers = get_all_subscribers()
    success = 0
    for uid in subscribers:
        try:
            await context.bot.send_message(chat_id=uid, text=f"📢 **تذكير ورشة AI Navigators:**\n\n{message_to_send}", parse_mode="Markdown")
            success += 1
        except Exception:
            continue

    await update.message.reply_text(f"✅ تم إرسال التذكير بنجاح إلى {success} مشترك.")

if __name__ == "__main__":
    init_db()
    app = ApplicationBuilder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("rules", rules))
    app.add_handler(CommandHandler("journey", journey))
    app.add_handler(CommandHandler("remind", remind_all))
    print("🤖 البوت يعمل بنجاح...")
    app.run_polling()
