// =========================
// القائمة الجانبية
// =========================

const menuButton = document.getElementById("menu-button");
const menuOverlay = document.getElementById("menu-overlay");
const sideMenuLinks = document.querySelectorAll(".side-menu-links a");


// فتح وإغلاق القائمة بالسهم نفسه

menuButton.addEventListener("click", function () {

    document.body.classList.toggle("menu-open");

    const isOpen =
        document.body.classList.contains("menu-open");

    menuButton.setAttribute(
        "aria-expanded",
        isOpen
    );

});


// الضغط على الشاشة خارج القائمة يقفلها

menuOverlay.addEventListener("click", function () {

    document.body.classList.remove("menu-open");

    menuButton.setAttribute(
        "aria-expanded",
        "false"
    );

});


// الضغط على أي قسم يقفل القائمة ويحفظ الصفحة

sideMenuLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        document.body.classList.remove("menu-open");

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

        // حفظ الصفحة التي اختارها المستخدم
        localStorage.setItem(
            "lastPage",
            link.getAttribute("href")
        );

    });

});


// =========================
// الوضع الليلي والنهاري
// =========================

const themeSwitch =
    document.getElementById("theme-switch");


// قراءة الوضع المحفوظ عند فتح أي صفحة

const savedTheme =
    localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark");

}


// تغيير الوضع وحفظ الاختيار

themeSwitch.addEventListener("click", function () {

    document.body.classList.toggle("dark");

    const isDark =
        document.body.classList.contains("dark");

    localStorage.setItem(
        "theme",
        isDark ? "dark" : "light"
    );

});


// =========================
// حفظ الصفحة الحالية
// =========================

localStorage.setItem(
    "lastPage",
    window.location.pathname
);


// =========================
// إغلاق القائمة بزر Escape
// =========================

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        document.body.classList.remove("menu-open");

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

    }

});