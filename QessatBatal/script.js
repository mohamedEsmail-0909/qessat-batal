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


// الضغط على أي قسم يقفل القائمة

sideMenuLinks.forEach(function (link) {

    link.addEventListener("click", function () {

        document.body.classList.remove("menu-open");

        menuButton.setAttribute(
            "aria-expanded",
            "false"
        );

    });

});


// =========================
// الوضع الليلي والنهاري
// =========================

const themeSwitch =
    document.getElementById("theme-switch");


themeSwitch.addEventListener("click", function () {

    document.body.classList.toggle("dark");

});


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