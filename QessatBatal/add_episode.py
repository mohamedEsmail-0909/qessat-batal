from pathlib import Path
from html import escape
import shutil
from datetime import datetime


# ==========================================
# ملفات الموقع
# ==========================================

FOLDER = Path(__file__).resolve().parent

INDEX_FILE = FOLDER / "index.html"
COMPANIONS_FILE = FOLDER / "companions.html"


# ==========================================
# قراءة الملفات
# ==========================================

def read_file(path):
    if not path.exists():
        raise FileNotFoundError(f"مش لاقي الملف: {path.name}")

    return path.read_text(encoding="utf-8")


# ==========================================
# استبدال المحتوى بين علامتين
# ==========================================

def replace_between(text, start_marker, end_marker, new_content):

    start = text.find(start_marker)
    end = text.find(end_marker)

    if start == -1 or end == -1 or end < start:
        raise ValueError(
            f"العلامات مش موجودة أو ترتيبها غلط:\n{start_marker}"
        )

    content_start = start + len(start_marker)

    return (
        text[:content_start]
        + "\n"
        + new_content
        + "\n"
        + text[end:]
    )


# ==========================================
# استخراج المحتوى بين علامتين
# ==========================================

def get_between(text, start_marker, end_marker):

    start = text.find(start_marker)
    end = text.find(end_marker)

    if start == -1 or end == -1 or end < start:
        raise ValueError(
            f"راجع العلامات الموجودة في الملف:\n{start_marker}"
        )

    start += len(start_marker)

    return text[start:end].strip()


# ==========================================
# إنشاء كرت الحلقة
# ==========================================

def make_companion_card(name, title, part, url):

    safe_name = escape(name)
    safe_title = escape(title)
    safe_url = escape(url, quote=True)

    part_html = ""

    # لو فيه جزء نكتبه
    if part:
        part_html = f'''
        <p class="episode-description">
            {escape(part)}
        </p>'''

    return f'''<article class="story-card">
    <div class="story-content">

        <span class="story-category">
            {safe_name} رضي الله عنه
        </span>

        <h3>{safe_title}</h3>

        {part_html}

        <a href="{safe_url}"
           class="story-button"
           target="_blank"
           rel="noopener noreferrer">
            مشاهدة الحلقة
        </a>

    </div>
</article>'''


# ==========================================
# كرت الواجهة الرئيسية
# ==========================================

def make_home_card(name, title, part, url):

    safe_name = escape(name)
    safe_title = escape(title)
    safe_url = escape(url, quote=True)

    description = safe_name + " رضي الله عنه"

    if part:
        description += " | " + part

    return f'''<article class="story-card">
    <div class="story-content">

        <span class="story-category">
            قصص الصحابة
        </span>

        <h3>{safe_title}</h3>

        <p class="episode-description">
            {escape(description)}
        </p>

        <a href="{safe_url}"
           class="story-button"
           target="_blank"
           rel="noopener noreferrer">
            مشاهدة الحلقة
        </a>

    </div>
</article>'''


# ==========================================
# تشغيل البرنامج
# ==========================================

def main():

    print()
    print("====================================")
    print("     إضافة حلقة جديدة - قصة بطل")
    print("====================================")
    print()

    # اسم الصحابي
    name = input("اكتب اسم الصحابي: ").strip()

    if not name:
        print("\nلازم تكتب اسم الصحابي.")
        return

    # عنوان الحلقة
    title = input("اكتب عنوان الحلقة: ").strip()

    if not title:
        print("\nلازم تكتب عنوان الحلقة.")
        return

    # الجزء - اختياري
    print()
    print("لو الحلقة لها جزء اكتب مثلًا: الجزء الأول")
    print("لو الحلقة ليس لها أجزاء، سيب الخانة فاضية.")
    print()

    part = input("اكتب الجزء (اختياري): ").strip()

    # الرابط
    print()
    url = input("الصق رابط الحلقة: ").strip()

    if not url:
        print("\nلازم تحط رابط الحلقة.")
        return

    if not url.startswith(("https://", "http://")):
        print("\nالرابط لازم يبدأ بـ https:// أو http://")
        return

    # قراءة الملفات
    index_html = read_file(INDEX_FILE)
    companions_html = read_file(COMPANIONS_FILE)

    # منع تكرار نفس الرابط
    if url in index_html or url in companions_html:

        print()
        print("الرابط ده موجود بالفعل في الموقع.")
        print("لم يتم تعديل أي ملف.")
        return

    # ==========================================
    # حفظ الحلقة الحالية كـ "الحلقة السابقة"
    # ==========================================

    old_latest = get_between(
        index_html,
        "<!-- LATEST_START -->",
        "<!-- LATEST_END -->"
    )

    # ==========================================
    # إنشاء الكروت الجديدة
    # ==========================================

    new_companion_card = make_companion_card(
        name,
        title,
        part,
        url
    )

    new_home_card = make_home_card(
        name,
        title,
        part,
        url
    )

    # ==========================================
    # إضافة الحلقة في صفحة قصص الصحابة
    # ==========================================

    old_companions = get_between(
        companions_html,
        "<!-- EPISODES_START -->",
        "<!-- EPISODES_END -->"
    )

    new_companions = (
        new_companion_card
        + "\n\n"
        + old_companions
    )

    companions_html = replace_between(
        companions_html,
        "<!-- EPISODES_START -->",
        "<!-- EPISODES_END -->",
        new_companions
    )

    # ==========================================
    # نقل أحدث حلقة إلى الحلقة السابقة
    # ==========================================

    index_html = replace_between(
        index_html,
        "<!-- PREVIOUS_START -->",
        "<!-- PREVIOUS_END -->",
        old_latest
    )

    # ==========================================
    # وضع الحلقة الجديدة في أحدث حلقة
    # ==========================================

    index_html = replace_between(
        index_html,
        "<!-- LATEST_START -->",
        "<!-- LATEST_END -->",
        new_home_card
    )

    # ==========================================
    # عمل نسخة احتياطية
    # ==========================================

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

    shutil.copy2(
        INDEX_FILE,
        FOLDER / f"index_backup_{timestamp}.html"
    )

    shutil.copy2(
        COMPANIONS_FILE,
        FOLDER / f"companions_backup_{timestamp}.html"
    )

    # ==========================================
    # حفظ الملفات
    # ==========================================

    INDEX_FILE.write_text(
        index_html,
        encoding="utf-8"
    )

    COMPANIONS_FILE.write_text(
        companions_html,
        encoding="utf-8"
    )

    # ==========================================
    # رسالة النجاح
    # ==========================================

    print()
    print("====================================")
    print("       تمت إضافة الحلقة بنجاح 🎉")
    print("====================================")
    print()
    print("✓ أضيفت الحلقة في قصص الصحابة")
    print("✓ أصبحت أحدث حلقة في الواجهة")
    print("✓ الحلقة السابقة أصبحت الحلقة السابقة")
    print("✓ تم إنشاء نسخة احتياطية")
    print()


# ==========================================
# تشغيل
# ==========================================

if __name__ == "__main__":

    try:
        main()

    except Exception as error:

        print()
        print("حصلت مشكلة:")
        print(error)
        print()
        print("لم يتم نشر أي شيء تلقائيًا.")