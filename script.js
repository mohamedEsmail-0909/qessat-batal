// =========================
// أدوات مساعدة (التخزين بشكل آمن)
// =========================

function readStorage(key) {
    try {
        return localStorage.getItem(key);
    } catch (error) {
        return null;
    }
}

function writeStorage(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        // تجاهل الخطأ (مثلًا التصفح الخفي)
    }
}


// =========================
// القائمة الجانبية
// =========================

const menuButton = document.getElementById("menu-button");
const menuOverlay = document.getElementById("menu-overlay");
const sideMenuLinks = document.querySelectorAll(".side-menu-links a");

function closeMenu() {
    document.body.classList.remove("menu-open");

    if (menuButton) {
        menuButton.setAttribute("aria-expanded", "false");
    }
}

// فتح وإغلاق القائمة بالسهم نفسه
if (menuButton) {
    menuButton.addEventListener("click", function () {
        document.body.classList.toggle("menu-open");

        const isOpen = document.body.classList.contains("menu-open");

        menuButton.setAttribute("aria-expanded", String(isOpen));
    });
}

// الضغط على الشاشة خارج القائمة يقفلها
if (menuOverlay) {
    menuOverlay.addEventListener("click", closeMenu);
}

// الضغط على أي قسم يقفل القائمة
sideMenuLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
});

// إغلاق القائمة بزر Escape
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeMenu();
    }
});


// =========================
// الوضع الليلي والنهاري
// =========================

const themeSwitch = document.getElementById("theme-switch");

// قراءة الوضع المحفوظ عند فتح أي صفحة
// لو مفيش اختيار محفوظ (جهاز جديد مثلًا) بنمشي على وضع التليفون نفسه
var savedTheme = readStorage("theme");

var phoneIsDark = !!(window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches);

if (savedTheme === "dark" || (savedTheme === null && phoneIsDark)) {
    document.body.classList.add("dark");
}

// تغيير الوضع وحفظ الاختيار
if (themeSwitch) {
    themeSwitch.addEventListener("click", function () {
        document.body.classList.toggle("dark");

        const isDark = document.body.classList.contains("dark");

        writeStorage("theme", isDark ? "dark" : "light");
    });
}