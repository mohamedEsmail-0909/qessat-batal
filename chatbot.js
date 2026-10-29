// =========================================================
// شات بوت قصة بطل - أسئلة جاهزة + فهم كتابة الزوار + بحث في الحلقات
// محادثات محفوظة + سجل المحادثات + تسجيل الأسئلة اللي ملهاش إجابة
// =========================================================

(function () {
    "use strict";

    // ---------- روابطك (سيب الفاضي فاضي وهيتخفى) ----------

    var LINKS = {
        facebook: "",   // حط هنا رابط صفحتك على فيسبوك
        youtube: "https://youtube.com/@qessat_batal?si=eOJLXFC_hpmh3WaE",
        tiktok: "https://www.tiktok.com/@mohamedesmail0909",
        whatsapp: "https://whatsapp.com/channel/0029Va90YHeKrWQqsLCKCA2P"
    };

    function socialLinks() {
        var list = [
            { text: "فيسبوك", href: LINKS.facebook },
            { text: "يوتيوب", href: LINKS.youtube },
            { text: "تيك توك", href: LINKS.tiktok },
            { text: "واتساب", href: LINKS.whatsapp }
        ];

        return list
            .filter(function (item) { return item.href; })
            .map(function (item) {
                return { text: item.text, href: item.href, external: true };
            });
    }


    // ---------- الإعدادات ----------

    var SOUND_VOLUME = 1;      // مستوى الصوت: 0 يقفله، 1 عالي، 1.5 أعلى
    var MAX_CHATS = 20;        // أقصى عدد محادثات محفوظة
    var MAX_MESSAGES = 120;    // أقصى عدد رسايل في المحادثة الواحدة
    var STORE_KEY = "cb-chats-v1";

    // ---------- البحث والأسئلة اللي ملهاش إجابة ----------

    // الصفحات اللي البحث بيقرا منها (أي حلقة جديدة بتتضاف فيها بتظهر في البحث لوحدها)
    var PAGES = [
        { url: "companions.html", label: "قصص الصحابة" },
        { url: "faith.html", label: "دروس إيمانية" },
        { url: "ramadan.html", label: "قصص رمضان" }
    ];

    // رابط Google Apps Script اللي بيسجل الأسئلة في الجدول.
    // سيبه فاضي لحد ما تركبه، والبوت وقتها مش هيقول للزائر إن سؤاله اتسجل.
    var QUESTION_ENDPOINT = "";


    // ---------- الكلام (غيّره زي ما تحب) ----------

    var TEASER = "أهلًا بيك 👋 عايز تعرف الموقع ده بيتكلم عن إيه؟";
    var TEASER_BACK = "أهلًا بيك تاني 👋 تحب تكمل محادثتك؟";

    var WELCOME = [
        "أهلًا بيك في قصة بطل ❤️",
        "أنا مساعد الموقع 🤖 دوس على أي سؤال تحت، أو اكتب سؤالك براحتك، أو دوس على 🔍 وابحث عن أي صحابي أو قصة أو درس."
    ];

    var FINISH = "كده خلصت أسئلتي 😄 تابعنا من هنا عشان توصلك الحلقات الجديدة أول بأول:";

    var RESTART_TEXT = "تمام، اسألني براحتك 😊";

    var QUESTIONS = [
        {
            q: "الموقع ده بيتكلم عن إيه؟",
            a: "ده موقع قصة بطل، بتاع محمد إسماعيل 🌟\n" +
               "بيحكي فيه قصص صحابة رسول الله ﷺ ومواقفهم، " +
               "عشان نتعلم منهم ونستلهم من سيرتهم، وكمان فيه دروس إيمانية قصيرة.\n" +
               "شعارنا: نحكي تاريخهم... لنستعد طريقنا.",
            strong: ["بيتكلم", "بتتكلم", "الموقع ده", "القناه دي", "القناه ده", "موقع ايه", "عن ايه", "بيعمل ايه", "بتعمل ايه"],
            kw: ["الموقع", "القناه", "ايه ده", "ده ايه", "قصه بطل", "فكره"]
        },

        {
            q: "عايز أشوف أحدث حلقة",
            // الإجابة والرابط بيتجابوا من الصفحات نفسها، فأي حلقة جديدة تظهر لوحدها
            a: function () {
                var e = latestEpisode();

                if (e) {
                    return "أحدث حلقة نزلت: «" + e.title + "» (" + cleanName(e.cat) + ") 🔥\n" +
                           "وأي حلقة جديدة بتظهر هنا أول ما تنزل.";
                }

                return "أحدث حلقة بتلاقيها في أول الصفحة الرئيسية، " +
                       "وبتتحدث أول ما ينزل حلقة جديدة 🔥";
            },
            links: function () {
                var e = latestEpisode();
                var list = [];

                if (e) {
                    list.push({ text: "شاهد الحلقة", href: e.href, external: true });
                }

                list.push({ text: "الصفحة الرئيسية", href: "index.html" });
                return list;
            },
            strong: ["احدث", "اخر حلقه", "اخر فيديو", "حلقه جديده", "الحلقه الجديده", "جديدكم", "اخر حاجه", "نزل ايه", "نزلتوا ايه", "نزلتو ايه", "اخر ما نزل", "اخر اللي نزل", "ايه الجديد", "فيه جديد", "في جديد"],
            kw: ["جديد", "الجديده", "اخر", "نزل"]
        },
        {
            q: "أتابعكم منين؟",
            a: "تقدر تتابعنا من هنا، عشان توصلك الحلقات الجديدة أول بأول 📲",
            links: socialLinks,
            strong: ["اتابعكم", "اتابعكو", "تابعكم", "متابعتكم", "روابطكم", "حساباتكم", "صفحتكم", "قناتكم", "قناتكو", "فيسبوك", "فيس بوك", "يوتيوب", "تيك توك", "تيكتوك", "واتساب", "واتس", "انستجرام", "اشترك", "اشتراك", "سوشيال"],
            kw: ["اتابع", "متابعه", "فولو", "روابط", "صفحه", "حسابات", "تابعنا"]
        }
    ];


    // ---------- الأيقونات ----------

    var ICON_CHAT =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 3h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4V5a2 2 0 0 1 1-2z"/><path d="M8 8h8"/><path d="M8 12h5"/></svg>';

    var ICON_CLOSE =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';

    var ICON_ROBOT =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="8" width="16" height="12" rx="4"/><path d="M12 8V5"/><circle cx="12" cy="4" r="1"/><circle cx="9" cy="13" r="1" fill="currentColor"/><circle cx="15" cy="13" r="1" fill="currentColor"/><path d="M9.5 17h5"/><path d="M2 13v3M22 13v3"/></svg>';

    var ICON_SOUND_ON =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4V5z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18 6a8.5 8.5 0 0 1 0 12"/></svg>';

    var ICON_SOUND_OFF =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4V5z" fill="currentColor"/><path d="M16 9l5 6M21 9l-5 6"/></svg>';

    var ICON_HISTORY =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/></svg>';

    var ICON_TRASH =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12"/><path d="M9 7V4h6v3"/></svg>';

    var ICON_BACK =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>';

    var ICON_SEARCH =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.6-3.6"/></svg>';

    var ICON_SEND =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>';

    var TICK_ONE =
        '<svg viewBox="0 0 16 11" width="15" height="10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 6l3 3 6-7.5"/></svg>';

    var TICK_TWO =
        '<svg viewBox="0 0 16 11" width="15" height="10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1 6l3 3 6-7.5"/><path d="M6 8.5l.5.5 6.5-8"/></svg>';


    // ---------- الشكل ----------

    var css = [
        '@import url("https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap");body .cb-panel,body .cb-teaser{font-family:"Tajawal",Tahoma,Arial,sans-serif}',
        ':root{--cb-gold:#b88920;--cb-gold-2:#d2a63c;--cb-gold-3:#f1d064;--cb-glass:rgba(247,243,232,.78);--cb-solid:rgba(247,243,232,.97);--cb-bot:rgba(255,253,246,.96);--cb-line:rgba(184,137,32,.45);--cb-text:#292929;--cb-sub:rgba(0,0,0,.5);--cb-chip-text:#8a6512;--cb-chip-bg:rgba(255,255,255,.6);--cb-tray:rgba(255,255,255,.3)}',
        'body.dark{--cb-glass:rgba(23,23,23,.8);--cb-solid:rgba(23,23,23,.98);--cb-bot:#26231b;--cb-line:rgba(241,208,100,.4);--cb-text:#eee;--cb-sub:rgba(255,255,255,.5);--cb-chip-text:#f1d064;--cb-chip-bg:rgba(241,208,100,.08);--cb-tray:rgba(0,0,0,.3)}',

        /* الزرار */
        '.cb-toggle{position:fixed;bottom:20px;left:20px;z-index:3000;width:60px;height:60px;border:none;border-radius:50%;background:linear-gradient(135deg,var(--cb-gold-2),var(--cb-gold));color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 22px rgba(184,137,32,.5),inset 0 1px 0 rgba(255,255,255,.45);transition:filter .2s ease,scale .2s ease;-webkit-tap-highlight-color:transparent}',
        '.cb-toggle:not(.cb-active){animation:cb-bob 3.2s ease-in-out infinite}',
        '.cb-toggle:hover{filter:brightness(1.08)}',
        '.cb-toggle:active{scale:.93}',
        '.cb-toggle::before{content:"";position:absolute;inset:0;border-radius:50%;border:2px solid var(--cb-gold-3);animation:cb-ring 2.4s ease-out infinite;pointer-events:none}',
        '.cb-toggle.cb-active::before{animation:none;opacity:0}',
        '.cb-toggle svg{width:28px;height:28px;position:absolute;transition:transform .45s cubic-bezier(.34,1.56,.64,1),opacity .25s ease}',
        '.cb-toggle .cb-ic-close{opacity:0;transform:rotate(-90deg) scale(.4)}',
        '.cb-toggle.cb-active .cb-ic-chat{opacity:0;transform:rotate(90deg) scale(.4)}',
        '.cb-toggle.cb-active .cb-ic-close{opacity:1;transform:none}',
        '.cb-badge{position:absolute;top:-3px;right:-3px;width:21px;height:21px;border-radius:50%;background:#e53935;color:#fff;border:2px solid #fff;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;animation:cb-pop .6s cubic-bezier(.34,1.56,.64,1) both;animation-delay:1s}',

        /* الفقاعة الترحيبية */
        '.cb-teaser{position:fixed;bottom:92px;left:20px;z-index:3000;max-width:240px;display:none;direction:rtl;padding:11px 15px;background:var(--cb-bot);color:var(--cb-text);border:1px solid var(--cb-line);border-radius:16px;box-shadow:0 10px 28px rgba(0,0,0,.22);font-family:inherit;font-size:14px;font-weight:700;line-height:1.7;cursor:pointer;transform-origin:bottom left}',
        '.cb-teaser::after{content:"";position:absolute;bottom:-7px;left:24px;width:12px;height:12px;background:inherit;border-right:1px solid var(--cb-line);border-bottom:1px solid var(--cb-line);transform:rotate(45deg)}',
        '.cb-teaser.cb-show{display:block;animation:cb-msg-in .55s cubic-bezier(.34,1.56,.64,1)}',

        /* فقاعات الأحلام: بتكبر وتفضل ظاهرة لحد ما الشات يتقفل */
        '.cb-trail{position:fixed;z-index:3001;border-radius:50%;pointer-events:none;background:radial-gradient(circle at 30% 28%,rgba(255,255,255,.95),rgba(241,208,100,.6) 45%,rgba(184,137,32,.4));border:1px solid rgba(255,255,255,.75);box-shadow:inset -2px -3px 7px rgba(184,137,32,.3),0 4px 14px rgba(184,137,32,.25);animation:cb-trail-in .45s cubic-bezier(.34,1.56,.64,1) both,cb-trail-float 3.6s ease-in-out infinite}',
        '.cb-trail.cb-trail-out{animation:cb-trail-out .35s ease-in forwards}',

        /* الصندوق الزجاجي */
        '.cb-panel{position:fixed;bottom:156px;left:20px;z-index:3000;width:360px;max-width:calc(100vw - 24px);height:560px;max-height:calc(100vh - 256px);max-height:calc(100dvh - 256px);display:flex;flex-direction:column;overflow:hidden;direction:rtl;font-family:inherit;color:var(--cb-text);background:var(--cb-glass);-webkit-backdrop-filter:blur(18px) saturate(1.5);backdrop-filter:blur(18px) saturate(1.5);border:1px solid var(--cb-line);box-shadow:0 22px 55px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.4);transform-origin:bottom left;opacity:0;visibility:hidden;pointer-events:none;transform:scale(.1);border-radius:60px;transition:transform .4s cubic-bezier(.4,0,.2,1),opacity .25s ease,border-radius .4s ease,visibility 0s .4s}',
        '.cb-panel.cb-open{opacity:1;visibility:visible;pointer-events:auto;transform:scale(1);border-radius:22px;transition:transform .75s cubic-bezier(.34,1.45,.64,1),opacity .3s ease,border-radius .75s ease,visibility 0s}',

        '.cb-blob{position:absolute;border-radius:50%;filter:blur(30px);opacity:.38;pointer-events:none;animation:cb-float 9s ease-in-out infinite}',
        '.cb-blob-a{width:150px;height:150px;background:var(--cb-gold-3);top:70px;right:-50px}',
        '.cb-blob-b{width:130px;height:130px;background:var(--cb-gold);bottom:110px;left:-40px;animation-delay:-4s}',

        /* الهيدر */
        '.cb-head{position:relative;z-index:2;flex-shrink:0;height:67px;box-sizing:border-box;display:flex;align-items:center;gap:10px;padding:12px 12px;background:linear-gradient(135deg,#202020,#2e2614);color:#f2d27a;border-bottom:1px solid var(--cb-gold)}',
        '.cb-head-av{width:42px;height:42px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,var(--cb-gold-3),var(--cb-gold));color:#202020;display:flex;align-items:center;justify-content:center}',
        '.cb-head-av svg{width:25px;height:25px}',
        '.cb-head-info{display:flex;flex-direction:column;line-height:1.4;min-width:0}',
        '.cb-head-name{font-size:16px;font-weight:800;white-space:nowrap}',
        '.cb-status{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:600;color:#cdbd8d}',
        '.cb-dot{width:8px;height:8px;border-radius:50%;background:#3ddc84;animation:cb-online 2s infinite}',
        '.cb-head-actions{margin-inline-start:auto;display:flex;gap:0}',
        '.cb-hbtn{width:34px;height:34px;border:none;border-radius:50%;background:none;color:#f2d27a;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s ease}',
        '.cb-hbtn:hover{background:rgba(242,210,122,.16)}',
        '.cb-hbtn svg{width:19px;height:19px}',

        /* الرسايل */
        '.cb-body{position:relative;z-index:1;flex:1;overflow-y:auto;padding:14px 12px;display:flex;flex-direction:column;gap:7px;scroll-behavior:smooth;overscroll-behavior:contain}',
        '.cb-body::-webkit-scrollbar{width:5px}',
        '.cb-body::-webkit-scrollbar-thumb{background:var(--cb-line);border-radius:5px}',
        '.cb-row{display:flex;align-items:flex-end;gap:7px;max-width:92%}',
        '.cb-row-bot{align-self:flex-start}',
        '.cb-row-user{align-self:flex-end}',
        '.cb-av{width:28px;height:28px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,var(--cb-gold-3),var(--cb-gold));color:#202020;display:flex;align-items:center;justify-content:center}',
        '.cb-av svg{width:17px;height:17px}',
        '.cb-av.cb-noav{visibility:hidden}',

        '.cb-msg{position:relative;padding:8px 12px 5px;border-radius:14px;font-size:15px;line-height:1.8;box-shadow:0 2px 6px rgba(0,0,0,.1);animation:cb-msg-in .38s cubic-bezier(.34,1.56,.64,1) both}',
        '.cb-instant .cb-msg,.cb-links.cb-instant{animation:none}',
        '.cb-text{display:block;white-space:pre-line;word-break:break-word}',
        '.cb-bot{background:var(--cb-bot);color:var(--cb-text);border-top-right-radius:4px;transform-origin:top right}',
        '.cb-bot::before{content:"";position:absolute;top:0;right:-7px;width:9px;height:12px;background:var(--cb-bot);clip-path:polygon(0 0,100% 0,0 100%)}',
        '.cb-user{background:linear-gradient(180deg,#c79a2a,#b88920);color:#fff;border-top-left-radius:4px;transform-origin:top left}',
        '.cb-user::before{content:"";position:absolute;top:0;left:-7px;width:9px;height:12px;background:#c79a2a;clip-path:polygon(0 0,100% 0,100% 100%)}',

        '.cb-meta{display:flex;justify-content:flex-end;align-items:center;gap:4px;margin-top:1px;font-size:11px;color:var(--cb-sub);line-height:1.4}',
        '.cb-user .cb-meta{color:rgba(255,255,255,.8)}',
        '.cb-ticks{display:inline-flex;transition:color .3s ease}',
        '.cb-ticks.cb-read{color:#9fe8ff}',

        '.cb-typing{display:flex;gap:5px;padding:13px 15px}',
        '.cb-typing span{width:7px;height:7px;border-radius:50%;background:var(--cb-gold);animation:cb-blink 1.1s infinite}',
        '.cb-typing span:nth-child(2){animation-delay:.18s}',
        '.cb-typing span:nth-child(3){animation-delay:.36s}',

        '.cb-links{align-self:flex-start;display:flex;flex-wrap:wrap;gap:8px;margin-inline-start:35px;animation:cb-msg-in .4s cubic-bezier(.34,1.56,.64,1) both}',
        '.cb-link{padding:8px 15px;border-radius:999px;background:linear-gradient(135deg,var(--cb-gold-2),var(--cb-gold));color:#fff;font-size:13px;font-weight:800;text-decoration:none;box-shadow:0 4px 10px rgba(184,137,32,.4);transition:filter .2s ease,transform .2s ease}',
        '.cb-link:hover{filter:brightness(1.1);transform:translateY(-2px)}',
        'body.dark .cb-link{background:linear-gradient(135deg,var(--cb-gold-3),var(--cb-gold-2));color:#171717}',

        /* صينية الأسئلة */
        '.cb-tray{position:relative;z-index:2;display:flex;flex-wrap:wrap;gap:8px;padding:10px 12px 13px;max-height:44%;overflow-y:auto;border-top:1px solid var(--cb-line);background:var(--cb-tray)}',
        '.cb-tray.cb-hide{display:none}',
        '.cb-tray-title{width:100%;font-size:12px;font-weight:700;color:var(--cb-sub)}',
        '.cb-chip{font-family:inherit;font-size:14px;font-weight:700;line-height:1.6;text-align:right;padding:8px 14px;border-radius:999px;border:1px solid var(--cb-gold);background:var(--cb-chip-bg);color:var(--cb-chip-text);cursor:pointer;animation:cb-chip-in .5s cubic-bezier(.34,1.56,.64,1) both;animation-delay:calc(var(--i) * 80ms);transition:background .2s ease,color .2s ease,transform .2s ease;-webkit-tap-highlight-color:transparent}',
        '.cb-chip:hover{background:var(--cb-gold);color:#fff;transform:translateY(-2px)}',
        '.cb-chip:active{transform:scale(.96)}',
        'body.dark .cb-chip:hover{background:var(--cb-gold-3);color:#171717}',
        '.cb-chip.cb-out{animation:cb-chip-out .25s ease forwards}',
        '.cb-tray.cb-busy .cb-chip{opacity:.45;pointer-events:none}',

        /* سجل المحادثات */
        '.cb-history{position:absolute;left:0;right:0;bottom:0;top:67px;z-index:4;display:flex;flex-direction:column;background:var(--cb-solid);transform:translateY(10%);opacity:0;visibility:hidden;transition:transform .35s cubic-bezier(.34,1.3,.64,1),opacity .25s ease,visibility 0s .35s}',
        '.cb-history.cb-show{transform:none;opacity:1;visibility:visible;transition:transform .35s cubic-bezier(.34,1.3,.64,1),opacity .25s ease,visibility 0s}',
        '.cb-hist-top{display:flex;align-items:center;gap:6px;padding:8px 10px;border-bottom:1px solid var(--cb-line)}',
        '.cb-hist-top .cb-hbtn{color:var(--cb-chip-text)}',
        '.cb-hist-top .cb-hbtn:hover{background:rgba(184,137,32,.14)}',
        '.cb-hist-title{font-size:15px;font-weight:800}',
        '.cb-hist-list{flex:1;overflow-y:auto;padding:10px 12px;display:flex;flex-direction:column;gap:8px}',
        '.cb-hist-empty{margin:auto;padding:20px;text-align:center;font-weight:700;color:var(--cb-sub);line-height:1.9}',
        '.cb-item{display:flex;align-items:stretch;border:1px solid var(--cb-line);border-radius:14px;background:var(--cb-bot);overflow:hidden;animation:cb-chip-in .4s cubic-bezier(.34,1.56,.64,1) both}',
        '.cb-item.cb-current{border-color:var(--cb-gold);box-shadow:0 0 0 1px var(--cb-gold)}',
        '.cb-item-main{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;padding:10px 12px;text-align:right;background:none;border:none;color:var(--cb-text);font-family:inherit;cursor:pointer}',
        '.cb-item-title{font-size:14px;font-weight:800;line-height:1.6}',
        '.cb-item-sub{font-size:12px;color:var(--cb-sub)}',
        '.cb-tag{margin-inline-start:6px;font-size:11px;font-weight:800;color:var(--cb-gold)}',
        '.cb-item-del{width:46px;display:flex;align-items:center;justify-content:center;border:none;border-inline-start:1px solid var(--cb-line);background:none;color:#e53935;font-family:inherit;font-size:12px;font-weight:800;cursor:pointer;transition:background .2s ease,width .2s ease}',
        '.cb-item-del svg{width:18px;height:18px}',
        '.cb-item-del.cb-arm{width:72px;background:#e53935;color:#fff}',
        '.cb-hist-foot{display:flex;gap:8px;padding:10px 12px 13px;border-top:1px solid var(--cb-line)}',
        '.cb-btn{font-family:inherit;font-size:14px;font-weight:800;padding:10px 14px;border-radius:12px;cursor:pointer;transition:filter .2s ease,background .2s ease,color .2s ease}',
        '.cb-btn-primary{flex:1;border:none;background:linear-gradient(135deg,var(--cb-gold-2),var(--cb-gold));color:#fff}',
        '.cb-btn-primary:hover{filter:brightness(1.08)}',
        'body.dark .cb-btn-primary{background:linear-gradient(135deg,var(--cb-gold-3),var(--cb-gold-2));color:#171717}',
        '.cb-btn-ghost{border:1px solid #e53935;background:none;color:#e53935}',
        '.cb-btn-ghost.cb-arm{background:#e53935;color:#fff}',

        /* الحركات */
        '@keyframes cb-bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}',
        '@keyframes cb-ring{0%{transform:scale(1);opacity:.65}100%{transform:scale(1.65);opacity:0}}',
        '@keyframes cb-pop{0%{transform:scale(0)}100%{transform:scale(1)}}',
        '@keyframes cb-float{0%,100%{transform:translate(0,0)}50%{transform:translate(18px,-24px)}}',
        '@keyframes cb-online{0%{box-shadow:0 0 0 0 rgba(61,220,132,.6)}70%{box-shadow:0 0 0 7px rgba(61,220,132,0)}100%{box-shadow:0 0 0 0 rgba(61,220,132,0)}}',
        '@keyframes cb-msg-in{from{opacity:0;transform:translateY(12px) scale(.88)}to{opacity:1;transform:none}}',
        '@keyframes cb-blink{0%,80%,100%{opacity:.25;transform:translateY(0)}40%{opacity:1;transform:translateY(-4px)}}',
        '@keyframes cb-chip-in{from{opacity:0;transform:translateY(14px) scale(.85)}to{opacity:1;transform:none}}',
        '@keyframes cb-chip-out{to{opacity:0;transform:scale(.8) translateY(-8px)}}',
        '@keyframes cb-trail-in{0%{transform:scale(0);opacity:0}55%{transform:scale(1.3);opacity:1}78%{transform:scale(.9)}100%{transform:scale(1);opacity:1}}',
        '@keyframes cb-trail-out{0%{transform:scale(1);opacity:1}100%{transform:scale(0);opacity:0}}',
        '@keyframes cb-trail-float{0%,100%{translate:0 0}50%{translate:0 -3px}}',

        /* خانة الكتابة */
        '.cb-bar{position:relative;z-index:2;flex-shrink:0;display:flex;flex-direction:column;gap:4px;padding:8px 10px 9px;border-top:1px solid var(--cb-line);background:var(--cb-solid)}',
        '.cb-bar-row{display:flex;align-items:center;gap:7px}',
        '.cb-input{flex:1;min-width:0;box-sizing:border-box;direction:rtl;font-family:inherit;font-size:16px;line-height:1.5;padding:9px 15px;border-radius:999px;border:1px solid var(--cb-line);background:var(--cb-chip-bg);color:var(--cb-text);outline:none;transition:border-color .2s ease}',
        '.cb-input:focus{border-color:var(--cb-gold)}',
        '.cb-input::placeholder{color:var(--cb-sub)}',
        '.cb-ibtn{flex-shrink:0;width:40px;height:40px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;-webkit-tap-highlight-color:transparent;transition:transform .2s ease,opacity .2s ease}',
        '.cb-ibtn svg{width:19px;height:19px}',
        '.cb-ibtn:active{transform:scale(.92)}',
        '.cb-send{border:none;background:linear-gradient(135deg,var(--cb-gold-2),var(--cb-gold));color:#fff}',
        '.cb-send svg{transform:scaleX(-1)}',
        '.cb-send:disabled{opacity:.45;cursor:default}',
        'body.dark .cb-send{background:linear-gradient(135deg,var(--cb-gold-3),var(--cb-gold-2));color:#171717}',
        '.cb-find{border:1px solid var(--cb-gold);background:var(--cb-chip-bg);color:var(--cb-chip-text)}',
        '.cb-note{font-size:11px;font-weight:600;line-height:1.6;color:var(--cb-sub);text-align:center}',

        /* شاشة البحث */
        '.cb-hist-top .cb-input{padding:7px 14px}',
        '.cb-count{font-size:12px;font-weight:700;color:var(--cb-sub)}',
        '.cb-sugg{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-top:10px}',
        '.cb-res{display:flex;flex-direction:column;align-items:flex-start;gap:3px;padding:10px 13px;border:1px solid var(--cb-line);border-radius:14px;background:var(--cb-bot);color:var(--cb-text);text-decoration:none;animation:cb-chip-in .35s cubic-bezier(.34,1.56,.64,1) both;transition:border-color .2s ease,transform .2s ease}',
        '.cb-res:hover{border-color:var(--cb-gold);transform:translateY(-2px)}',
        '.cb-res-cat{font-size:12px;font-weight:800;color:var(--cb-chip-text)}',
        '.cb-res-title{font-size:14.5px;font-weight:700;line-height:1.7}',
        '.cb-res-tag{font-size:11px;font-weight:800;padding:1px 10px;border-radius:999px;background:rgba(184,137,32,.16);color:var(--cb-chip-text)}',
        '@media (max-width:700px){.cb-tray{max-height:36%}.cb-note{font-size:10.5px}}',

        /* الموبايل */
        '@media (max-width:700px){.cb-toggle{left:12px;bottom:14px;width:56px;height:56px}.cb-teaser{left:12px;bottom:80px;max-width:210px}.cb-panel{left:12px;right:12px;width:auto;max-width:none;bottom:142px;height:calc(100vh - 232px);height:calc(100dvh - 232px);max-height:560px}.cb-msg{font-size:14.5px}.cb-head-name{font-size:15px}}',

        /* لو الجهاز طالب تقليل الحركة */
        '@media (prefers-reduced-motion:reduce){.cb-toggle,.cb-toggle::before,.cb-blob,.cb-msg,.cb-chip,.cb-links,.cb-dot,.cb-teaser,.cb-item{animation:none!important}.cb-panel,.cb-panel.cb-open{transition:opacity .2s ease,visibility 0s!important}}'
    ].join("");


    // ---------- أدوات صغيرة ----------

    function el(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text) node.textContent = text;
        return node;
    }

    var reduceMotion = !!(window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    function nowTime() {
        try {
            return new Date().toLocaleTimeString("ar-EG", {
                hour: "numeric",
                minute: "2-digit"
            });
        } catch (error) {
            return "";
        }
    }

    function formatWhen(timestamp) {
        try {
            var d = new Date(timestamp);

            return d.toLocaleDateString("ar-EG", { day: "numeric", month: "long" }) +
                " · " +
                d.toLocaleTimeString("ar-EG", { hour: "numeric", minute: "2-digit" });
        } catch (error) {
            return "";
        }
    }


    // ---------- التخزين (على نفس الجهاز والمتصفح) ----------

    function loadStore() {
        try {
            var raw = localStorage.getItem(STORE_KEY);

            if (raw) {
                var data = JSON.parse(raw);

                if (data && Array.isArray(data.chats)) {
                    // محادثات قديمة: ترتيب الأسئلة اتغير، فبننقل اللي اتسأل لمكانه الجديد
                    if (!data.v) {
                        var map = { 0: 0, 1: 1, 4: 2, 5: 3 };

                        data.chats.forEach(function (c) {
                            var fresh = {};
                            var old = c.asked || {};

                            Object.keys(old).forEach(function (k) {
                                if (map[k] !== undefined) fresh[map[k]] = true;
                            });

                            c.asked = fresh;
                            c.finished = false;
                        });
                    }

                    return { v: 2, current: data.current || null, chats: data.chats };
                }
            }
        } catch (error) {
            // تجاهل
        }

        return { v: 2, current: null, chats: [] };
    }

    var store = loadStore();

    function saveStore() {
        try {
            localStorage.setItem(STORE_KEY, JSON.stringify(store));
        } catch (error) {
            // تجاهل
        }
    }

    function hasUserMessage(c) {
        return c.messages.some(function (m) { return m.who === "user"; });
    }

    function findChat(id) {
        for (var i = 0; i < store.chats.length; i++) {
            if (store.chats[i].id === id) return store.chats[i];
        }
        return null;
    }

    function newChatObject() {
        return {
            id: "c" + Date.now().toString(36) + Math.floor(Math.random() * 1000),
            created: Date.now(),
            updated: Date.now(),
            asked: {},
            finished: false,
            messages: []
        };
    }


    // ---------- الصوت (بيتصنع بالكود، من غير ملفات) ----------

    var audioCtx = null;
    var master = null;
    var muted = false;

    try {
        muted = localStorage.getItem("cb-muted") === "1";
    } catch (error) {
        muted = false;
    }

    function getCtx() {
        if (!audioCtx) {
            var AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return null;

            audioCtx = new AC();

            master = audioCtx.createDynamicsCompressor();
            master.connect(audioCtx.destination);
        }

        if (audioCtx.state === "suspended") {
            audioCtx.resume();
        }

        return audioCtx;
    }

    function tone(freq, start, duration, volume, type, endFreq) {
        if (muted || SOUND_VOLUME <= 0) return;

        var ctx = getCtx();
        if (!ctx) return;

        var t = ctx.currentTime + start;
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        var peak = Math.max(0.0002, Math.min(1, volume * SOUND_VOLUME));

        osc.type = type || "sine";
        osc.frequency.setValueAtTime(freq, t);

        if (endFreq) {
            osc.frequency.exponentialRampToValueAtTime(endFreq, t + duration);
        }

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(peak, t + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

        osc.connect(gain);
        gain.connect(master);

        osc.start(t);
        osc.stop(t + duration + 0.03);
    }

    var sounds = {
        trail: function (count) {
            for (var i = 0; i < count; i++) {
                tone(330 + i * 105, i * 0.095, 0.1, 0.6, "sine", 480 + i * 150);
            }
        },
        pop: function () {
            tone(500, 0, 0.14, 0.7, "sine", 1100);
            tone(1100, 0.1, 0.14, 0.45, "sine");
        },
        close: function () {
            tone(700, 0, 0.14, 0.55, "sine", 300);
        },
        send: function () {
            tone(700, 0, 0.1, 0.65, "triangle", 1050);
        },
        receive: function () {
            tone(988, 0, 0.13, 0.65, "sine");
            tone(1319, 0.09, 0.18, 0.55, "sine");
        }
    };


    // ---------- التركيب في الصفحة ----------

    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    // الزرار
    var toggle = el("button", "cb-toggle");
    toggle.setAttribute("aria-label", "فتح المحادثة");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = ICON_CHAT + ICON_CLOSE;

    var toggleIcons = toggle.querySelectorAll("svg");
    toggleIcons[0].classList.add("cb-ic-chat");
    toggleIcons[1].classList.add("cb-ic-close");

    var badge = el("span", "cb-badge", "1");
    toggle.appendChild(badge);

    // الفقاعة الترحيبية
    var hadPrevious = store.chats.some(hasUserMessage);
    var teaser = el("div", "cb-teaser", hadPrevious ? TEASER_BACK : TEASER);

    if (hadPrevious) {
        badge.style.display = "none";
    }

    // الصندوق
    var panel = el("div", "cb-panel");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "مساعد قصة بطل");

    panel.appendChild(el("div", "cb-blob cb-blob-a"));
    panel.appendChild(el("div", "cb-blob cb-blob-b"));

    var head = el("div", "cb-head");

    var headAv = el("div", "cb-head-av");
    headAv.innerHTML = ICON_ROBOT;

    var headInfo = el("div", "cb-head-info");
    headInfo.appendChild(el("span", "cb-head-name", "مساعد قصة بطل"));

    var status = el("span", "cb-status");
    status.appendChild(el("span", "cb-dot"));
    var statusText = el("span", "", "متصل الآن");
    status.appendChild(statusText);
    headInfo.appendChild(status);

    var actions = el("div", "cb-head-actions");

    var historyButton = el("button", "cb-hbtn");
    historyButton.setAttribute("aria-label", "المحادثات السابقة");
    historyButton.innerHTML = ICON_HISTORY;

    var muteButton = el("button", "cb-hbtn");
    muteButton.setAttribute("aria-label", "الصوت");
    muteButton.innerHTML = muted ? ICON_SOUND_OFF : ICON_SOUND_ON;

    var closeButton = el("button", "cb-hbtn");
    closeButton.setAttribute("aria-label", "إغلاق المحادثة");
    closeButton.innerHTML = ICON_CLOSE;

    actions.appendChild(historyButton);
    actions.appendChild(muteButton);
    actions.appendChild(closeButton);

    head.appendChild(headAv);
    head.appendChild(headInfo);
    head.appendChild(actions);

    var body = el("div", "cb-body");
    body.setAttribute("role", "log");
    body.setAttribute("aria-live", "polite");

    var tray = el("div", "cb-tray cb-hide");

    // سجل المحادثات
    var hist = el("div", "cb-history");

    var histTop = el("div", "cb-hist-top");
    var backButton = el("button", "cb-hbtn");
    backButton.setAttribute("aria-label", "رجوع");
    backButton.innerHTML = ICON_BACK;
    histTop.appendChild(backButton);
    histTop.appendChild(el("span", "cb-hist-title", "المحادثات السابقة"));

    var histList = el("div", "cb-hist-list");

    var histFoot = el("div", "cb-hist-foot");
    var newButton = el("button", "cb-btn cb-btn-primary", "＋ محادثة جديدة");
    var clearButton = el("button", "cb-btn cb-btn-ghost", "مسح الكل");
    histFoot.appendChild(newButton);
    histFoot.appendChild(clearButton);

    hist.appendChild(histTop);
    hist.appendChild(histList);
    hist.appendChild(histFoot);

    // خانة الكتابة
    var bar = el("div", "cb-bar");
    var barRow = el("div", "cb-bar-row");

    var findButton = el("button", "cb-ibtn cb-find");
    findButton.setAttribute("aria-label", "بحث عن صحابي أو قصة أو درس");
    findButton.innerHTML = ICON_SEARCH;

    var input = document.createElement("input");
    input.type = "text";
    input.className = "cb-input";
    input.placeholder = "اكتب سؤالك هنا...";
    input.maxLength = 200;
    input.setAttribute("enterkeyhint", "send");
    input.setAttribute("autocomplete", "off");
    input.setAttribute("aria-label", "اكتب رسالتك");

    var sendBtn = el("button", "cb-ibtn cb-send");
    sendBtn.setAttribute("aria-label", "إرسال");
    sendBtn.innerHTML = ICON_SEND;

    barRow.appendChild(findButton);
    barRow.appendChild(input);
    barRow.appendChild(sendBtn);
    bar.appendChild(barRow);

    if (QUESTION_ENDPOINT) {
        bar.appendChild(el("div", "cb-note", "الأسئلة اللي ماعرفش أجاوبها بتتسجل عشان نضيف إجابتها 📝"));
    }

    // شاشة البحث
    var sbox = el("div", "cb-history cb-search");

    var sTop = el("div", "cb-hist-top");
    var sBack = el("button", "cb-hbtn");
    sBack.setAttribute("aria-label", "رجوع");
    sBack.innerHTML = ICON_BACK;

    var sInput = document.createElement("input");
    sInput.type = "text";
    sInput.className = "cb-input cb-search-input";
    sInput.placeholder = "ابحث عن صحابي أو قصة أو درس...";
    sInput.maxLength = 60;
    sInput.setAttribute("enterkeyhint", "search");
    sInput.setAttribute("autocomplete", "off");
    sInput.setAttribute("aria-label", "بحث");

    sTop.appendChild(sBack);
    sTop.appendChild(sInput);

    var sList = el("div", "cb-hist-list");

    sbox.appendChild(sTop);
    sbox.appendChild(sList);

    panel.appendChild(head);
    panel.appendChild(body);
    panel.appendChild(tray);
    panel.appendChild(bar);
    panel.appendChild(hist);
    panel.appendChild(sbox);

    document.body.appendChild(panel);
    document.body.appendChild(teaser);
    document.body.appendChild(toggle);


    // ---------- حالة المحادثة ----------

    var chat = null;          // المحادثة الحالية
    var started = false;
    var busy = false;
    var opening = false;
    var epoch = 0;            // بيتغير لما نبدّل محادثة، عشان نلغي الردود المعلقة
    var lastWho = "";

    function scrollDown() {
        requestAnimationFrame(function () {
            body.scrollTop = body.scrollHeight;
        });
    }

    function setStatus(typing) {
        statusText.textContent = typing ? "يكتب..." : "متصل الآن";
    }

    function setBusy(flag) {
        tray.classList.toggle("cb-busy", flag);
        if (typeof sendBtn !== "undefined") sendBtn.disabled = flag;
    }

    function resetView() {
        epoch++;
        awaiting = "";
        busy = false;
        setBusy(false);
        setStatus(false);

        body.innerHTML = "";
        tray.innerHTML = "";
        tray.classList.add("cb-hide");
        lastWho = "";
    }


    // ---------- رسم الرسايل ----------

    function renderMessage(m, instant) {
        var isUser = m.who === "user";

        var row = el("div", "cb-row " + (isUser ? "cb-row-user" : "cb-row-bot") +
            (instant ? " cb-instant" : ""));

        if (!isUser) {
            var av = el("div", "cb-av");
            av.innerHTML = ICON_ROBOT;
            if (lastWho === "bot") av.classList.add("cb-noav");
            row.appendChild(av);
        }

        var msg = el("div", "cb-msg " + (isUser ? "cb-user" : "cb-bot"));
        msg.appendChild(el("span", "cb-text", m.text));

        var meta = el("div", "cb-meta");
        meta.appendChild(el("span", "", m.time || ""));

        var ticks = null;

        if (isUser) {
            ticks = el("span", "cb-ticks");

            if (instant) {
                ticks.innerHTML = TICK_TWO;
                ticks.classList.add("cb-read");
            } else {
                ticks.innerHTML = TICK_ONE;
            }

            meta.appendChild(ticks);
        }

        msg.appendChild(meta);
        row.appendChild(msg);
        body.appendChild(row);

        lastWho = m.who;

        return ticks;
    }

    function renderLinks(items, instant) {
        if (!items || !items.length) return;

        var row = el("div", "cb-links" + (instant ? " cb-instant" : ""));

        items.forEach(function (item) {
            var a = el("a", "cb-link", item.text);
            a.href = item.href;

            if (item.external) {
                a.target = "_blank";
                a.rel = "noopener noreferrer";
            }

            row.appendChild(a);
        });

        body.appendChild(row);
    }

    function addMessage(text, who) {
        var m = { who: who, text: text, time: nowTime() };

        if (chat) {
            chat.messages.push(m);

            if (chat.messages.length > MAX_MESSAGES) {
                chat.messages.shift();
            }

            chat.updated = Date.now();
            saveStore();
        }

        var ticks = renderMessage(m, false);
        scrollDown();

        return ticks;
    }

    function addLinks(links) {
        var items = typeof links === "function" ? links() : links;

        if (!items || !items.length) return;

        if (chat && chat.messages.length) {
            chat.messages[chat.messages.length - 1].links = items;
            saveStore();
        }

        renderLinks(items, false);
        scrollDown();
    }

    function setTicks(ticks, state) {
        if (!ticks || !ticks.isConnected) return;

        ticks.innerHTML = TICK_TWO;

        if (state === "read") {
            ticks.classList.add("cb-read");
        }
    }

    function showTyping() {
        var row = el("div", "cb-row cb-row-bot");

        var av = el("div", "cb-av");
        av.innerHTML = ICON_ROBOT;
        if (lastWho === "bot") av.classList.add("cb-noav");
        row.appendChild(av);

        var bubble = el("div", "cb-msg cb-bot cb-typing");
        bubble.appendChild(el("span"));
        bubble.appendChild(el("span"));
        bubble.appendChild(el("span"));
        row.appendChild(bubble);

        body.appendChild(row);
        scrollDown();

        return row;
    }

    function typingDelay(text) {
        return Math.min(1800, 650 + text.length * 9);
    }

    // البوت يرد برسالة أو أكتر ورا بعض
    function botSequence(list, finalLinks, done) {
        var myEpoch = epoch;

        busy = true;
        setBusy(true);

        var i = 0;

        function next() {
            if (myEpoch !== epoch) return;

            if (i >= list.length) {
                busy = false;
                setBusy(false);
                if (done) done();
                return;
            }

            var text = list[i];
            var isLast = i === list.length - 1;

            var typing = showTyping();
            setStatus(true);

            setTimeout(function () {
                if (myEpoch !== epoch) {
                    typing.remove();
                    return;
                }

                typing.remove();
                setStatus(false);

                addMessage(text, "bot");
                sounds.receive();

                if (isLast && finalLinks) {
                    addLinks(finalLinks);
                }

                i++;
                setTimeout(next, 260);
            }, typingDelay(text));
        }

        next();
    }


    // =========================================================
    // البحث والفهم الذكي والأسئلة الحرة
    // =========================================================

    // ---------- تتبع بالأرقام فقط (جوجل أناليتكس لو متركب) ----------

    function track(name, params) {
        try {
            if (typeof window.gtag === "function") {
                window.gtag("event", name, params || {});
            }
        } catch (error) {
            // تجاهل
        }
    }


    // ---------- تسجيل الأسئلة اللي البوت ماعرفش يجاوبها ----------

    var loggedKeys = {};
    var logCount = 0;

    // بترجّع true لو فيه مكان بيستقبل الأسئلة (يعني نقدر نقول للزائر إنها اتسجلت)
    function logUnanswered(text, type) {
        if (!QUESTION_ENDPOINT) return false;

        var clean = String(text).replace(/\s+/g, " ").trim().slice(0, 300);
        if (!clean) return true;

        var key = type + "|" + norm(clean);

        if (loggedKeys[key] || logCount >= 10) return true;

        loggedKeys[key] = true;
        logCount++;

        try {
            fetch(QUESTION_ENDPOINT, {
                method: "POST",
                mode: "no-cors",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify({
                    type: type,
                    text: clean,
                    page: location.pathname,
                    time: new Date().toISOString()
                })
            }).catch(function () { /* تجاهل */ });
        } catch (error) {
            // تجاهل
        }

        track("chatbot_unanswered", { type: type });
        return true;
    }


    // <PURE>
    // ---------- فهم الكلام العربي (تطبيع + مرادفات + تسامح مع الأخطاء) ----------

    var episodes = [];

    var STOP = {};
    ("عايز عاوز عايزه عاوزه اريد ابغي ممكن لو سمحت عن في من الي ده دي دا ايه ازاي فين هل يا انا ليا لي لينا " +
     "قصه قصص حلقه حلقات حكايه حكايات فيديو درس دروس صحابي صحابه نبي سيدنا الله بن بتاع بتاعه شوف اشوف ابحث " +
     "دور ادور عليه عليها او مع كل اي لما هو هي هما ان كان ليه عندكم عندكو فيه")
        .split(" ").forEach(function (w) { STOP[w] = true; });

    var ALIASES = [
        ["الفاروق", "عمر الخطاب"],
        ["فاروق", "عمر الخطاب"],
        ["ذو النورين", "عثمان عفان"],
        ["ذي النورين", "عثمان عفان"],
        ["سيف الله", "خالد الوليد"],
        ["اسد الله", "حمزه"],
        ["امين الامه", "ابو عبيده"],
        ["ابوبكر", "ابو بكر"],
        ["عبد الرحمن", "عبدالرحمن"],
        ["عبد الله", "عبدالله"]
    ];

    function norm(s) {
        s = String(s || "").toLowerCase();

        s = s.replace(/[\u064B-\u065F\u0670\u0640]/g, "");
        s = s.replace(/[أإآٱ]/g, "ا").replace(/ى/g, "ي").replace(/ة/g, "ه")
             .replace(/ؤ/g, "و").replace(/ئ/g, "ي");
        s = s.replace(/[٠-٩]/g, function (d) { return String(d.charCodeAt(0) - 1632); });
        s = s.replace(/[^a-z0-9\u0621-\u064A\s]/g, " ");
        s = s.replace(/\s+/g, " ").trim();

        s = s.replace(/رضي الله عن(?:ه|ها|هم|هما)(?= |$)/g, " ")
             .replace(/عليه السلام(?= |$)/g, " ")
             .replace(/صلي الله عليه وسلم(?= |$)/g, " ");

        return s.replace(/\s+/g, " ").trim();
    }

    function stem(t) {
        if (t === "ابن") t = "بن";
        if (t === "الله") return t;
        if (t.length > 3 && t.indexOf("ال") === 0) t = t.slice(2);
        return t;
    }

    function toks(s) {
        return norm(s).split(" ").map(stem).filter(function (t) { return t.length >= 2; });
    }

    function queryTokens(q) {
        var n = norm(q);
        var extra = "";

        ALIASES.forEach(function (pair) {
            if (n.indexOf(norm(pair[0])) > -1) extra += " " + pair[1];
        });

        var seen = {};
        var out = [];

        toks(n + extra).forEach(function (t) {
            if (STOP[t] || seen[t]) return;
            seen[t] = true;
            out.push(t);
        });

        return out;
    }

    // بيرجّع true لو الفرق بين الكلمتين أقل من أو يساوي max حرف
    function lev(a, b, max) {
        if (Math.abs(a.length - b.length) > max) return false;

        var prev = [];
        var i, j;

        for (j = 0; j <= b.length; j++) prev[j] = j;

        for (i = 1; i <= a.length; i++) {
            var cur = [i];
            var rowMin = i;

            for (j = 1; j <= b.length; j++) {
                var cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
                cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
                if (cur[j] < rowMin) rowMin = cur[j];
            }

            if (rowMin > max) return false;
            prev = cur;
        }

        return prev[b.length] <= max;
    }

    function tokenScore(q, h) {
        if (q === h) return 3;
        if (q.length >= 3 && h.indexOf(q) === 0) return 2;
        if (q.length >= 4 && lev(q, h, 1)) return 1.5;
        if (q.length >= 6 && lev(q, h, 2)) return 1.2;
        return 0;
    }

    var FIELDS = [
        { name: "cat", w: 1.4 },
        { name: "title", w: 1 },
        { name: "desc", w: 0.6 },
        { name: "label", w: 0.5 }
    ];

    function scoreEpisode(ep, qt) {
        var total = 0;
        var matched = 0;
        var top = 0;

        qt.forEach(function (q) {
            var best = 0;

            FIELDS.forEach(function (f) {
                var words = ep.f[f.name];
                var s = 0;

                for (var i = 0; i < words.length; i++) {
                    var v = tokenScore(q, words[i]);
                    if (v > s) s = v;
                    if (s === 3) break;
                }

                s *= f.w;
                if (s > best) best = s;
            });

            if (best > 0) {
                matched++;
                total += best;
                if (best > top) top = best;
            }
        });

        return { total: total, matched: matched, top: top };
    }

    function searchEpisodes(query, max) {
        var qt = queryTokens(query);
        var found = [];
        var bestMatched = 0;

        if (!qt.length) return { tokens: qt, items: [] };

        episodes.forEach(function (ep, order) {
            var r = scoreEpisode(ep, qt);

            if (r.matched && r.top >= 1.2) {
                found.push({ ep: ep, r: r, order: order });
                if (r.matched > bestMatched) bestMatched = r.matched;
            }
        });

        if (bestMatched < Math.ceil(qt.length / 2)) {
            return { tokens: qt, items: [] };
        }

        found = found.filter(function (x) { return x.r.matched === bestMatched; });

        found.sort(function (a, b) {
            return (b.r.total - a.r.total) || (a.order - b.order);
        });

        return {
            tokens: qt,
            items: found.slice(0, max).map(function (x) { return x.ep; })
        };
    }

    function kwHit(n, tk, k) {
        if (!k) return false;
        return k.length <= 3 ? tk.indexOf(k) > -1 : n.indexOf(k) > -1;
    }

    function hasAny(n, tk, list) {
        for (var i = 0; i < list.length; i++) {
            if (kwHit(n, tk, list[i])) return true;
        }
        return false;
    }

    var GREET = ["سلام", "السلام عليكم", "مرحبا", "اهلا", "هاي", "هلا", "هلو", "hello", "hi", "اهلين", "صباح الخير", "مساء الخير", "صباح النور", "مساء النور"].map(norm);
    var THANKS = ["شكرا", "جزاك", "جزاكم", "بارك", "تسلم", "يكرمك", "ماشاء", "ما شاء"].map(norm);

    QUESTIONS.forEach(function (q) {
        q.nStrong = (q.strong || []).map(norm);
        q.nKw = (q.kw || []).map(norm);
    });

    // بترجّع رقم السؤال الجاهز اللي الكلام ده أقرب له، أو -1
    function matchQuestion(n, tk) {
        var best = -1;
        var bestScore = 0;

        QUESTIONS.forEach(function (q, i) {
            var s = 0;

            q.nStrong.forEach(function (k) { if (kwHit(n, tk, k)) s += 2; });
            q.nKw.forEach(function (k) { if (kwHit(n, tk, k)) s += 1; });

            if (s > bestScore) {
                bestScore = s;
                best = i;
            }
        });

        return bestScore >= 2 ? best : -1;
    }

    // ---------- كلام الناس العادي (ردود جاهزة) ----------
    // phrases: جمل بيدور عليها جوه الرسالة | exact: كلمات لازم تتكتب لوحدها (رسالة قصيرة)
    // act: suggest = اقتراح، log = مشكلة بتتسجل، recommend = يرشّح حلقات

    var CHAT = [
        { id: "bye", phrases: ["مع السلامه", "باي", "تصبح علي خير", "في امان الله", "الي اللقاء", "همشي", "استاذنك", "سلام يا"],
          replies: ["في أمان الله 🤍 تابعنا عشان توصلك الحلقات الجديدة أول بأول."] },

        { id: "how", phrases: ["عامل ايه", "عاملين ايه", "اخبارك", "ازيك", "ازايك", "كيف حالك", "كيفك", "شلونك", "طمني عليك", "عامل اي", "ايه الاخبار", "ايه اخبارك"],
          replies: ["الحمد لله 🤍 تمام والله، وإنت عامل إيه؟", "اكتب اسم صحابي أو درس وأنا أدورلك عليه 🔍"] },

        { id: "name", phrases: ["اسمك ايه", "اسمك اي", "انت مين", "انتا مين", "مين انت", "مين صنعك", "مين عملك", "مين برمجك", "مين اللي عملك", "مين صممك", "انت ايه"],
          replies: ["أنا مساعد آلي اتعملت مخصوص لموقع قصة بطل 🤖", "بجاوب على أسئلتك وبدورلك على الحلقات. والموقع نفسه بتاع محمد إسماعيل."] },

        { id: "robot", phrases: ["انت روبوت", "انت بوت", "انت انسان", "انت بني ادم", "انت حقيقي", "انت ذكاء اصطناعي", "انت شات جي بي تي", "انت جيمني", "انت بشر", "حد بيكلمني", "انت بتفهم"],
          replies: ["أنا مساعد آلي مش إنسان 🤖 بوت بسيط بفهم كلام كتير، بس مش ذكاء اصطناعي كامل.", "ولو سؤالك صعب عليا، بسجله وهيتضاف هنا قريب إن شاء الله."] },

        { id: "can", phrases: ["تقدر تعمل ايه", "انت بتعمل ايه", "بتعرف تعمل ايه", "ممكن تساعدني", "ساعدني", "محتاج مساعده", "عايز مساعده", "مساعده", "بتعرف ايه", "ايه امكانياتك"],
          replies: ["أقدر أرد على أسئلتك عن الموقع، وأدورلك على أي صحابي أو قصة أو درس 🔍", "جرّب اكتب اسم صحابي، أو دوس على الأسئلة اللي تحت."] },

        { id: "praise", exact: ["جميل", "حلو", "رائع", "ممتاز", "عظيم", "تحفه", "جامد", "برافو", "احسنت", "عاش", "حلوه", "جميله"], maxTok: 3,
          replies: ["الله يبارك فيك 🤍 كلامك بيفرحنا، وهدفنا إن القصص دي توصل لأكبر عدد."] },

        { id: "praise2", phrases: ["ماشاء الله", "ما شاء الله", "الموقع حلو", "الموقع جميل", "بجد حلو", "تسلم ايدك", "تسلم ايدكم", "الله ينور", "ربنا يبارك فيك", "ربنا يكرمك", "شغل جامد", "شغل حلو"],
          replies: ["الله يبارك فيك 🤍 دعواتك."] },

        { id: "dhikr", phrases: ["سبحان الله", "الحمد لله", "الله اكبر", "لا اله الا الله", "استغفر الله", "لا حول ولا قوه"],
          replies: ["ولا إله إلا الله 🤍 تقبّل الله منا ومنك."] },

        { id: "salawat", phrases: ["صلي علي النبي", "صلوا علي النبي", "اللهم صل", "صل علي النبي", "عليه الصلاه والسلام", "صلي الله عليه وسلم"],
          replies: ["اللهم صلِّ وسلِّم وبارك على سيدنا محمد ﷺ 🤍"] },

        { id: "dua", phrases: ["ادعيلي", "ادعي لي", "ادعوا لي", "ادعولي", "ادعيلنا"],
          replies: ["اللهم اغفر لنا ولك، وارزقنا الهداية والتوفيق 🤍 وربنا يسعدك."] },

        { id: "problem", phrases: ["مش شغال", "مش بيفتح", "بيهنج", "بطيء", "بطئ", "بيقفل", "مش بيحمل", "مش بيشتغل", "فيه مشكله", "في مشكله", "عندي مشكله", "مش راضي يفتح", "الفيديو مش شغال", "الرابط مش شغال"],
          act: "log", replies: ["آسفين على ده 🙏 جرّب تعمل ريفرش للصفحة وتتأكد من النت."] },

        { id: "suggest", phrases: ["اقتراح", "اقترح", "اقتراحي", "عايز اقترح", "عندي فكره", "عندي اقتراح", "ياريت تعملوا", "ياريت تعمل"],
          act: "suggest", replies: [] },

        { id: "contact", phrases: ["تواصل", "اكلم محمد", "اكلمكم", "ابعتلكم", "رقمك", "رقم تليفون", "ايميلك", "ايميل", "عايز اكلم", "كلم محمد"],
          links: "social", replies: ["أفضل طريقة تتواصل بيها معانا من صفحاتنا على السوشيال 🤍"] },

        { id: "schedule", phrases: ["امتي تنزل", "امتي هتنزل", "هتنزلوا", "هتنزلو", "حلقه جديده امتي", "بتنزلوا امتي", "ميعاد", "مواعيد", "كل قد ايه", "كل اد ايه", "هتنزل امتي", "الحلقه الجايه", "الحلقه الجاي", "الحلقات الجايه"],
          links: "social", replies: ["مفيش ميعاد ثابت أقدر أأكده 🙏 الأفضل تتابعنا من هنا عشان توصلك الحلقة أول ما تنزل."] },

        { id: "download", phrases: ["تحميل", "احمل", "حمل الحلقه", "انزل الحلقه", "انشر", "اعيد نشر", "ريبوست", "انزلها"],
          links: "social", replies: ["الحلقات للمشاهدة على صفحاتنا 🎬 ولو عايز تحمّل أو تنشر حاجة، كلّم محمد إسماعيل الأول على صفحاته."] },

        { id: "free", phrases: ["مجاني", "مجانا", "بفلوس", "بكام", "السعر", "اشتراك مدفوع"],
          replies: ["الموقع نفسه مجاني، ومفيش أي اشتراك مدفوع 🤍"] },

        { id: "recommend", phrases: ["رشحلي", "رشح لي", "انصحني", "ابدا بايه", "احسن حلقه", "احلي حلقه", "افضل حلقه", "احكيلي", "احكي لي", "احكي قصه", "قولي قصه", "قصه حلوه", "حدوته", "ايه احلي", "اشوف ايه"],
          act: "recommend", replies: [] },

        { id: "where", phrases: ["انت منين", "انت فين", "ساكن فين", "من اي بلد", "محمد منين", "محمد ساكن"],
          replies: ["الموقع إلكتروني ومتاح من أي مكان 🌍 وصاحبه محمد إسماعيل."] },

        { id: "age", phrases: ["عمرك كام", "سنك كام", "انت عندك كام سنه", "عندك كام سنه"],
          replies: ["أنا بوت، مش بكبر 😄 بس بتعلم كل يوم حاجة جديدة من أسئلتكم."] },

        { id: "joke", phrases: ["نكته", "قولي نكته", "ضحكني", "هتهزر"], 
          replies: ["أنا متخصص في القصص والعبر أكتر من النكت 😄", "تحب أرشحلك حلقة؟ اكتب (رشحلي حلقة)."] },

        { id: "insult", exact: ["غبي", "حمار", "اهبل", "تافه", "كلب", "فاشل", "زفت", "بايخ", "هبل", "غبيه"], maxTok: 4,
          replies: ["ربنا يهديك 🤍 أنا هنا أساعدك في أي سؤال عن الموقع."] },

        { id: "fatwa", exact: ["حرام", "حلال", "فتوي", "يجوز", "جائز"], phrases: ["ما حكم", "ايه حكم", "هل يجوز", "حكم "],
          replies: ["أنا مش مفتي ولا عالم 🙏 للأحكام والفتاوى ارجع لأهل العلم المعتمدين أو دار الإفتاء."] },

        { id: "offtopic", exact: ["الطقس", "الجو", "الدولار", "ماتش", "الاهلي", "الزمالك", "اغنيه", "فيلم", "مسلسل", "لعبه", "بابجي"], phrases: ["الساعه كام", "سعر الدولار"],
          replies: ["ده خارج تخصصي 😄 أنا بجاوب عن الموقع والحلقات بس.", "جرّب تدوس على 🔍 وتدور باسم صحابي أو درس."] },

        { id: "ack", exact: ["اه", "ايوه", "تمام", "ماشي", "اوكي", "ok", "طيب", "حاضر", "اوك", "ايوا"], maxTok: 2,
          replies: ["تمام 🤍 لو محتاج حاجة أنا موجود."] }
    ];

    CHAT.forEach(function (c) {
        c.nPhrases = (c.phrases || []).map(norm);
        c.nExact = (c.exact || []).map(norm);
    });

    function matchChat(n, tk) {
        for (var i = 0; i < CHAT.length; i++) {
            var c = CHAT[i];

            if (tk.length > (c.maxTok || 7)) continue;

            var j;

            for (j = 0; j < c.nExact.length; j++) {
                if (tk.indexOf(c.nExact[j]) > -1) return c;
            }

            for (j = 0; j < c.nPhrases.length; j++) {
                if (kwHit(n, tk, c.nPhrases[j])) return c;
            }
        }

        return null;
    }
    // </PURE>


    // ---------- قراءة الحلقات من صفحات الموقع نفسها ----------

    var dataState = "idle";      // idle | loading | ready | failed
    var waiters = [];

    function cleanName(s) {
        return String(s || "")
            .replace(/\s*رضي الله عن(?:ه|ها|هم|هما)/g, "")
            .replace(/\s*عليه السلام/g, "")
            .replace(/\s+/g, " ")
            .trim();
    }

    function shorten(s, max) {
        s = String(s || "");
        return s.length > max ? s.slice(0, max - 1).trim() + "…" : s;
    }

    function pick(card, selector) {
        var node = card.querySelector(selector);
        return node ? node.textContent.replace(/\s+/g, " ").trim() : "";
    }

    function scanDocument(doc, label) {
        var list = [];
        var cards = doc.querySelectorAll(".story-card");

        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            var link = card.querySelector("a.story-button") || card.querySelector("a[href]");
            var href = link ? (link.getAttribute("href") || "").trim() : "";

            // نقبل روابط http/https بس
            if (!/^https?:\/\//i.test(href)) continue;

            var title = pick(card, "h3");
            if (!title) continue;

            list.push({
                cat: pick(card, ".story-category"),
                title: title,
                desc: pick(card, ".episode-description"),
                href: href,
                label: label
            });
        }

        return list;
    }

    function prepareEpisodes(list) {
        var seen = {};
        var out = [];

        list.forEach(function (e) {
            var key = e.href + "|" + e.title;
            if (seen[key]) return;
            seen[key] = true;

            e.f = {
                cat: toks(e.cat),
                title: toks(e.title),
                desc: toks(e.desc),
                label: toks(e.label)
            };

            out.push(e);
        });

        return out;
    }

    function currentFile() {
        var parts = location.pathname.split("/");
        return parts[parts.length - 1] || "index.html";
    }

    function loadData(cb) {
        if (dataState === "ready" || dataState === "failed") {
            cb();
            return;
        }

        waiters.push(cb);

        if (dataState === "loading") return;

        dataState = "loading";

        var results = [];
        var pending = PAGES.length;
        var finished = false;

        function finish() {
            if (finished) return;
            finished = true;

            var list = [];

            PAGES.forEach(function (p, i) {
                var part = results[i] || [];

                // لو الصفحة دي هي اللي مفتوحة ومجبناهاش، نقراها من الصفحة نفسها
                if (!part.length && currentFile() === p.url) {
                    part = scanDocument(document, p.label);
                }

                part.forEach(function (e) { list.push(e); });
            });

            episodes = prepareEpisodes(list);
            dataState = episodes.length ? "ready" : "failed";

            var w = waiters;
            waiters = [];

            w.forEach(function (fn) {
                try { fn(); } catch (error) { /* تجاهل */ }
            });
        }

        function oneDone() {
            pending--;
            if (pending <= 0) finish();
        }

        PAGES.forEach(function (p, i) {
            try {
                fetch(p.url)
                    .then(function (r) {
                        if (!r.ok) throw new Error("bad");
                        return r.text();
                    })
                    .then(function (html) {
                        var doc = new DOMParser().parseFromString(html, "text/html");
                        results[i] = scanDocument(doc, p.label);
                    })
                    .catch(function () { /* تجاهل */ })
                    .then(oneDone);
            } catch (error) {
                oneDone();
            }
        });

        setTimeout(finish, 8000);
    }

    function latestEpisode() {
        for (var i = 0; i < episodes.length; i++) {
            if (episodes[i].label === PAGES[0].label) return episodes[i];
        }
        return null;
    }

    function textOf(a) {
        return typeof a === "function" ? a() : a;
    }

    function episodePill(ep) {
        var text = ep.label === PAGES[0].label
            ? cleanName(ep.cat) + " — " + ep.title
            : ep.cat + " — " + ep.title;

        return { text: shorten(text, 56), href: ep.href, external: true };
    }


    // ---------- شاشة البحث ----------

    var SUGGESTIONS = ["أبو بكر", "عمر", "الصبر", "يوسف", "رمضان"];
    var lastCount = -1;
    var missTimer = null;

    function isSearchOpen() {
        return sbox.classList.contains("cb-show");
    }

    function hideSearch() {
        sbox.classList.remove("cb-show");
        sInput.blur();
    }

    function showSearch() {
        hideHistory();
        sbox.classList.add("cb-show");
        renderSearch(sInput.value);
        track("chatbot_search_open");

        setTimeout(function () {
            if (isSearchOpen()) sInput.focus();
        }, 320);
    }

    function searchMessage(text) {
        var box = el("div", "cb-hist-empty", text);
        box.style.whiteSpace = "pre-line";
        return box;
    }

    function renderSearch(q) {
        sList.innerHTML = "";

        var query = String(q || "").trim();
        lastCount = -1;

        if (!query) {
            var hint = searchMessage("اكتب اسم الصحابي أو القصة أو الدرس 🔍\nوالنتايج بتظهر وانت بتكتب.");
            var sugg = el("div", "cb-sugg");

            SUGGESTIONS.forEach(function (word, n) {
                var chip = el("button", "cb-chip", word);
                chip.style.setProperty("--i", n);

                chip.addEventListener("click", function () {
                    sInput.value = word;
                    renderSearch(word);
                    sInput.focus();
                });

                sugg.appendChild(chip);
            });

            hint.appendChild(sugg);
            sList.appendChild(hint);
            return;
        }

        if (dataState !== "ready" && dataState !== "failed") {
            sList.appendChild(searchMessage("ثواني، بحمّل الحلقات... ⏳"));

            loadData(function () {
                if (isSearchOpen() && sInput.value.trim() === query) renderSearch(query);
            });

            return;
        }

        if (dataState === "failed") {
            sList.appendChild(searchMessage("البحث مش شغال دلوقتي 😕\nجرّب تاني بعد شوية."));
            return;
        }

        var res = searchEpisodes(query, 25);

        if (!res.tokens.length) {
            sList.appendChild(searchMessage("اكتب اسم الصحابي أو عنوان القصة أو الدرس 🔍"));
            return;
        }

        lastCount = res.items.length;

        if (!res.items.length) {
            sList.appendChild(searchMessage("مفيش نتيجة لـ «" + query + "» 😕\nجرّب تكتب الاسم بشكل تاني، أو اسأل في الشات."));
            return;
        }

        sList.appendChild(el("div", "cb-count", res.items.length + " نتيجة"));

        res.items.forEach(function (ep, n) {
            var a = el("a", "cb-res");
            a.href = ep.href;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            a.style.animationDelay = (n * 35) + "ms";

            a.appendChild(el("span", "cb-res-cat", ep.label === PAGES[0].label ? cleanName(ep.cat) : ep.cat));
            a.appendChild(el("span", "cb-res-title", ep.title));
            a.appendChild(el("span", "cb-res-tag", ep.label));

            a.addEventListener("click", function () {
                track("chatbot_result_click", { section: ep.label });
            });

            sList.appendChild(a);
        });
    }

    sInput.addEventListener("input", function () {
        renderSearch(sInput.value);

        clearTimeout(missTimer);

        missTimer = setTimeout(function () {
            var q = sInput.value.trim();

            if (q.length >= 3 && lastCount === 0) {
                logUnanswered(q, "بحث");
                track("chatbot_search", { result: "miss" });
            } else if (lastCount > 0) {
                track("chatbot_search", { result: "hit" });
            }
        }, 1300);
    });

    sBack.addEventListener("click", hideSearch);
    findButton.addEventListener("click", function () {
        sounds.send();
        showSearch();
    });


    // ---------- الكتابة الحرة في الشات ----------

    function greetReply(n) {
        var first = n.indexOf("سلام") > -1
            ? "وعليكم السلام ورحمة الله وبركاته 🤍"
            : "أهلًا بيك 🤍";

        return [first, "اكتب اسم صحابي أو درس أو قصة وأنا أدورلك عليها 🔍"];
    }

    function answerBySearch(text) {
        var res = searchEpisodes(text, 5);

        track("chatbot_chat_search", { result: res.items.length ? "hit" : "miss" });

        if (!res.tokens.length) {
            botSequence(["اكتب اسم الصحابي أو عنوان القصة أو الدرس اللي بتدور عليه وأنا ألاقيهولك 🔍"], null, renderTray);
            return;
        }

        if (res.items.length) {
            var head = res.items.length === 1
                ? "لقيت الحلقة دي 👇"
                : "لقيتلك " + res.items.length + " نتايج قريبة 👇";

            botSequence([head], res.items.map(episodePill), renderTray);
            return;
        }

        var logged = logUnanswered(text, "شات");

        if (logged) {
            botSequence([
                "ماعرفتش أجاوب على سؤالك دلوقتي 🙏",
                "سؤالك اتسجل عندي ✅ وهيتم إضافة إجابته هنا قريبًا إن شاء الله.",
                "وفي الوقت ده تقدر تدوس على 🔍 وتدور باسم الصحابي أو الدرس."
            ], null, renderTray);
        } else {
            botSequence([
                "ماعرفتش أجاوب على سؤالك دلوقتي 🙏",
                "جرّب تدوس على 🔍 وتدور باسم الصحابي أو الدرس، أو اختار من الأسئلة اللي تحت."
            ], null, renderTray);
        }
    }

    var awaiting = "";

    function shuffle(list) {
        var a = list.slice();

        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = a[i];
            a[i] = a[j];
            a[j] = t;
        }

        return a;
    }

    function handleChat(ce, text) {
        track("chatbot_chitchat", { id: ce.id });

        var replies = ce.replies.slice();
        var links = ce.links === "social" ? socialLinks : null;

        if (ce.act === "suggest") {
            if (QUESTION_ENDPOINT) {
                awaiting = "اقتراح";
                replies = ["اتفضل اكتب اقتراحك دلوقتي 💡 وهيتسجل عشان نشوفه."];
            } else {
                replies = ["يسعدنا اقتراحك 💡 ابعته لنا على صفحاتنا في السوشيال."];
                links = socialLinks;
            }
        }

        if (ce.act === "log") {
            if (logUnanswered(text, "مشكلة")) {
                replies.push("وسجلت ملاحظتك عشان تتراجع ✅");
            }
        }

        if (ce.act === "recommend") {
            var myEpoch = epoch;

            busy = true;
            setBusy(true);

            var typing = showTyping();
            setStatus(true);

            loadData(function () {
                if (myEpoch !== epoch) return;

                typing.remove();
                setStatus(false);
                busy = false;
                setBusy(false);

                var pool = episodes.filter(function (e) { return e.label === PAGES[0].label; });
                if (!pool.length) pool = episodes;

                if (!pool.length) {
                    botSequence(["اكتب اسم صحابي وأنا ألاقيلك حلقته 🔍"], null, renderTray);
                    return;
                }

                botSequence(["جرّب الحلقات دي 👇"], shuffle(pool).slice(0, 3).map(episodePill), renderTray);
            });

            return;
        }

        botSequence(replies, links, renderTray);
    }

    function sendText(raw) {
        if (busy || !chat) return;

        var text = String(raw || "").replace(/\s+/g, " ").trim().slice(0, 200);
        if (!text) return;

        input.value = "";
        sounds.send();
        track("chatbot_message");

        var myEpoch = epoch;
        var ticks = addMessage(text, "user");

        setTimeout(function () { setTicks(ticks, "two"); }, 350);
        setTimeout(function () { setTicks(ticks, "read"); }, 950);

        var n = norm(text);
        var tk = n.split(" ");

        // رد على اقتراح الزائر (بعد ما قال عايز يقترح)
        if (awaiting) {
            var kind = awaiting;
            awaiting = "";

            logUnanswered(text, kind);
            botSequence(["شكرًا على اقتراحك 🤍 وصلني وهنشوفه إن شاء الله."], null, renderTray);
            return;
        }

        // كلام الناس العادي
        var ce = matchChat(n, tk);

        if (ce) {
            handleChat(ce, text);
            return;
        }

        // سلام وشكر
        if (tk.length <= 5) {
            if (hasAny(n, tk, GREET)) {
                botSequence(greetReply(n), null, renderTray);
                return;
            }

            if (hasAny(n, tk, THANKS)) {
                botSequence(["الله يبارك فيك 🤍 لو عايز تدور على حلقة اكتب اسمها أو دوس على 🔍."], null, renderTray);
                return;
            }
        }

        // سؤال من الأسئلة الجاهزة
        var idx = matchQuestion(n, tk);

        if (idx > -1) {
            var item = QUESTIONS[idx];

            chat.asked[idx] = true;
            chat.updated = Date.now();
            saveStore();

            botSequence([textOf(item.a)], item.links, function () {
                renderTray();
                if (!chat.finished) afterAnswer();
            });

            return;
        }

        // غير كده: بحث في الحلقات
        busy = true;
        setBusy(true);

        var typing = showTyping();
        setStatus(true);

        loadData(function () {
            if (myEpoch !== epoch) return;

            typing.remove();
            setStatus(false);
            busy = false;
            setBusy(false);

            answerBySearch(text);
        });
    }

    sendBtn.addEventListener("click", function () {
        sendText(input.value);
    });

    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.isComposing) {
            event.preventDefault();
            sendText(input.value);
        }
    });


    // ---------- الأسئلة ----------

    function hasMoreQuestions() {
        return QUESTIONS.some(function (q, index) {
            return !chat.asked[index];
        });
    }

    function renderTray() {
        tray.innerHTML = "";

        if (!chat) {
            tray.classList.add("cb-hide");
            return;
        }

        var remaining = [];

        QUESTIONS.forEach(function (item, index) {
            if (!chat.asked[index]) remaining.push(index);
        });

        if (remaining.length) {
            tray.appendChild(el("div", "cb-tray-title", "اختار سؤال:"));

            remaining.forEach(function (index, n) {
                var chip = el("button", "cb-chip", QUESTIONS[index].q);
                chip.style.setProperty("--i", n);

                chip.addEventListener("click", function () {
                    ask(index, chip);
                });

                tray.appendChild(chip);
            });

            tray.classList.remove("cb-hide");
            return;
        }

        if (chat.finished) {
            var again = el("button", "cb-chip", "ابدأ من جديد 🔄");
            again.style.setProperty("--i", 0);
            again.addEventListener("click", restart);
            tray.appendChild(again);
            tray.classList.remove("cb-hide");
            return;
        }

        tray.classList.add("cb-hide");
    }

    function ask(index, chip) {
        if (busy || !chat) return;

        busy = true;
        setBusy(true);

        chat.asked[index] = true;
        chat.updated = Date.now();
        saveStore();

        var myEpoch = epoch;
        var item = QUESTIONS[index];

        sounds.send();
        chip.classList.add("cb-out");

        setTimeout(function () {
            if (myEpoch !== epoch) return;

            // السؤال اللي اتسأل يتشال
            chip.remove();

            if (!tray.querySelector(".cb-chip")) {
                tray.classList.add("cb-hide");
            }

            var ticks = addMessage(item.q, "user");

            setTimeout(function () { setTicks(ticks, "two"); }, 350);
            setTimeout(function () { setTicks(ticks, "read"); }, 950);

            track("chatbot_question", { index: index });
            botSequence([textOf(item.a)], item.links, afterAnswer);
        }, 240);
    }

    function afterAnswer() {
        if (!chat || hasMoreQuestions()) return;

        chat.finished = true;
        saveStore();

        botSequence([FINISH], socialLinks, renderTray);
    }

    function restart() {
        if (busy || !chat) return;

        sounds.send();

        chat.asked = {};
        chat.finished = false;
        saveStore();

        tray.innerHTML = "";
        tray.classList.add("cb-hide");

        botSequence([RESTART_TEXT], null, renderTray);
    }

    function indexOfQuestion(text) {
        for (var i = 0; i < QUESTIONS.length; i++) {
            if (QUESTIONS[i].q === text) return i;
        }
        return -1;
    }


    // ---------- إدارة المحادثات ----------

    function trimChats() {
        if (store.chats.length <= MAX_CHATS) return;

        store.chats.sort(function (a, b) { return b.updated - a.updated; });
        store.chats = store.chats.slice(0, MAX_CHATS);
    }

    function startNewChat() {
        // لو المحادثة الحالية لسه ما اتسألش فيها حاجة نشيلها
        if (chat && !hasUserMessage(chat)) {
            store.chats = store.chats.filter(function (c) { return c.id !== chat.id; });
        }

        resetView();

        chat = newChatObject();
        store.chats.unshift(chat);
        store.current = chat.id;
        trimChats();
        saveStore();

        botSequence(WELCOME, null, renderTray);
    }

    function showChat(c) {
        resetView();

        chat = c;
        store.current = c.id;
        saveStore();

        c.messages.forEach(function (m) {
            renderMessage(m, true);
            renderLinks(m.links, true);
        });

        // لو السؤال الأخير ملحقش يتجاوب
        var lastMsg = c.messages[c.messages.length - 1];

        if (lastMsg && lastMsg.who === "user") {
            var qi = indexOfQuestion(lastMsg.text);

            if (qi > -1) {
                var item = QUESTIONS[qi];
                addMessage(textOf(item.a), "bot");
                addLinks(item.links);
            }
        }

        renderTray();

        if (!hasMoreQuestions() && !c.finished) {
            afterAnswer();
        }

        scrollDown();
    }

    function initChat() {
        var existing = store.current ? findChat(store.current) : null;

        if (existing && existing.messages.length) {
            showChat(existing);
        } else {
            chat = existing;
            startNewChat();
        }
    }

    function deleteChat(id) {
        store.chats = store.chats.filter(function (c) { return c.id !== id; });

        if (chat && chat.id === id) {
            chat = null;
            store.current = null;
            resetView();
        }

        saveStore();
        renderHistory();
    }

    function clearAll() {
        store.chats = [];
        store.current = null;
        chat = null;

        resetView();
        saveStore();
        renderHistory();
    }


    // ---------- سجل المحادثات ----------

    function armButton(button, armedLabel, action) {
        var original = button.innerHTML;
        var timer = null;

        function reset() {
            clearTimeout(timer);
            button.classList.remove("cb-arm");
            button.innerHTML = original;
        }

        button.addEventListener("click", function (event) {
            event.stopPropagation();

            if (button.classList.contains("cb-arm")) {
                reset();
                action();
                return;
            }

            button.classList.add("cb-arm");
            button.textContent = armedLabel;
            timer = setTimeout(reset, 3000);
        });
    }

    function chatTitle(c) {
        for (var i = 0; i < c.messages.length; i++) {
            if (c.messages[i].who === "user") return c.messages[i].text;
        }
        return "محادثة جديدة";
    }

    function renderHistory() {
        histList.innerHTML = "";

        var list = store.chats
            .filter(hasUserMessage)
            .sort(function (a, b) { return b.updated - a.updated; });

        if (!list.length) {
            histList.appendChild(
                el("div", "cb-hist-empty", "مفيش محادثات قديمة لسه 💬\nأي محادثة هتعملها هتتحفظ هنا.")
            );
            histList.lastChild.style.whiteSpace = "pre-line";
            return;
        }

        list.forEach(function (c, n) {
            var isCurrent = chat && c.id === chat.id;
            var questions = c.messages.filter(function (m) { return m.who === "user"; }).length;

            var item = el("div", "cb-item" + (isCurrent ? " cb-current" : ""));
            item.style.animationDelay = (n * 50) + "ms";

            var main = el("button", "cb-item-main");
            var title = el("span", "cb-item-title", chatTitle(c));

            if (isCurrent) {
                title.appendChild(el("span", "cb-tag", "الحالية"));
            }

            main.appendChild(title);
            main.appendChild(el("span", "cb-item-sub",
                formatWhen(c.updated) + " · " + questions + " سؤال"));

            main.addEventListener("click", function () {
                sounds.send();
                hideHistory();
                showChat(c);
            });

            var del = el("button", "cb-item-del");
            del.setAttribute("aria-label", "مسح المحادثة");
            del.innerHTML = ICON_TRASH;
            armButton(del, "تأكيد", function () { deleteChat(c.id); });

            item.appendChild(main);
            item.appendChild(del);
            histList.appendChild(item);
        });
    }

    function showHistory() {
        hideSearch();
        renderHistory();
        hist.classList.add("cb-show");
    }

    function hideHistory() {
        hist.classList.remove("cb-show");
    }

    function backFromHistory() {
        hideHistory();

        if (!chat) {
            startNewChat();
        }
    }

    historyButton.addEventListener("click", function () {
        if (hist.classList.contains("cb-show")) {
            backFromHistory();
        } else {
            showHistory();
        }
    });

    backButton.addEventListener("click", backFromHistory);

    newButton.addEventListener("click", function () {
        sounds.send();
        hideHistory();
        startNewChat();
    });

    armButton(clearButton, "تأكيد المسح؟", clearAll);


    // ---------- الفتح: فقاعات بتكبر لحد ما تبقى الشات ----------

    var TRAIL_SIZES = [8, 12, 17, 24];
    var TRAIL_STEP = 110;
    var TRAIL_TIME = (TRAIL_SIZES.length - 1) * TRAIL_STEP + 300;
    var trailNodes = [];

    // أماكن الفقاعات: من الزرار لحد أسفل الصندوق، بتكبر وهي طالعة
    function trailPoints() {
        var rect = toggle.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var r = rect.width / 2;

        var cs = window.getComputedStyle(panel);
        var panelBottomY = window.innerHeight - (parseFloat(cs.bottom) || 0);

        var n = TRAIL_SIZES.length;
        var lastSize = TRAIL_SIZES[n - 1];

        var startX = cx + r * 0.75;
        var startY = cy - r - 8;
        var endX = cx + r * 3.4;
        var endY = panelBottomY + 5 + lastSize / 2;

        if (endY > startY - 24) {
            endY = startY - 24;
        }

        var points = [];

        for (var i = 0; i < n; i++) {
            var t = n === 1 ? 1 : i / (n - 1);

            points.push({
                x: startX + (endX - startX) * t,
                y: startY + (endY - startY) * t
            });
        }

        return points;
    }

    function layoutTrail() {
        var points = trailPoints();

        trailNodes.forEach(function (node, i) {
            var s = TRAIL_SIZES[i];
            node.style.left = (points[i].x - s / 2) + "px";
            node.style.top = (points[i].y - s / 2) + "px";
        });

        return points[points.length - 1];
    }

    function removeTrailNow() {
        trailNodes.forEach(function (node) { node.remove(); });
        trailNodes = [];
    }

    function growTrail() {
        removeTrailNow();

        TRAIL_SIZES.forEach(function (s, i) {
            var node = el("span", "cb-trail");

            node.style.width = s + "px";
            node.style.height = s + "px";
            node.style.animationDelay =
                (i * TRAIL_STEP) + "ms, " + (i * TRAIL_STEP + 500) + "ms";

            document.body.appendChild(node);
            trailNodes.push(node);
        });

        return layoutTrail();
    }

    // لما الشات يتقفل الفقاعات بتختفي معاه، الكبيرة الأول
    function removeTrail() {
        var nodes = trailNodes;
        var n = nodes.length;

        trailNodes = [];

        nodes.forEach(function (node, i) {
            var wait = (n - 1 - i) * 70;

            node.style.animationDelay = wait + "ms";
            node.classList.add("cb-trail-out");

            setTimeout(function () { node.remove(); }, wait + 450);
        });
    }

    window.addEventListener("resize", function () {
        if (trailNodes.length) layoutTrail();
    });

    // الصندوق يطلع من مكان آخر فقاعة
    function setOrigin(x, y) {
        var cs = window.getComputedStyle(panel);
        var left = parseFloat(cs.left) || 0;
        var bottom = parseFloat(cs.bottom) || 0;
        var w = panel.offsetWidth;
        var h = panel.offsetHeight;
        var topY = window.innerHeight - bottom - h;

        var ox = Math.max(0, Math.min(w, x - left));
        var oy = Math.max(0, Math.min(h, y - topY));

        panel.style.transformOrigin = ox + "px " + oy + "px";
    }

    function isOpen() {
        return panel.classList.contains("cb-open");
    }

    function revealPanel(origin) {
        if (origin) {
            setOrigin(origin.x, origin.y);
        } else {
            panel.style.transformOrigin = "0px " + panel.offsetHeight + "px";
        }

        panel.classList.add("cb-open");
        sounds.pop();

        setTimeout(function () {
            if (!isOpen()) return;

            if (!started) {
                started = true;
                initChat();
            } else if (!chat) {
                startNewChat();
            }
        }, 650);
    }

    function openPanel() {
        if (opening || isOpen()) return;

        opening = true;

        toggle.classList.add("cb-active");
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "إغلاق المحادثة");

        teaser.classList.remove("cb-show");
        badge.style.display = "none";

        track("chatbot_open");
        loadData(function () {});

        if (reduceMotion) {
            revealPanel(null);
            opening = false;
            return;
        }

        var last = growTrail();
        sounds.trail(TRAIL_SIZES.length);

        setTimeout(function () {
            revealPanel(last);
            opening = false;
        }, TRAIL_TIME);
    }

    function closePanel() {
        if (opening || !isOpen()) return;

        hideHistory();
        hideSearch();

        panel.style.transformOrigin = "0px " + panel.offsetHeight + "px";
        panel.classList.remove("cb-open");

        toggle.classList.remove("cb-active");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "فتح المحادثة");

        removeTrail();
        sounds.close();
    }

    toggle.addEventListener("click", function () {
        if (isOpen()) {
            closePanel();
        } else {
            openPanel();
        }
    });

    teaser.addEventListener("click", openPanel);
    closeButton.addEventListener("click", closePanel);

    muteButton.addEventListener("click", function () {
        muted = !muted;

        try {
            localStorage.setItem("cb-muted", muted ? "1" : "0");
        } catch (error) {
            // تجاهل
        }

        muteButton.innerHTML = muted ? ICON_SOUND_OFF : ICON_SOUND_ON;

        if (!muted) sounds.receive();
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closePanel();
        }
    });


    // ---------- الفقاعة الترحيبية (مرة واحدة في الزيارة) ----------

    var teaserSeen = false;

    try {
        teaserSeen = sessionStorage.getItem("cb-teaser") === "1";
    } catch (error) {
        teaserSeen = false;
    }

    if (!teaserSeen) {
        setTimeout(function () {
            if (!isOpen() && !opening) {
                teaser.classList.add("cb-show");

                setTimeout(function () {
                    teaser.classList.remove("cb-show");
                }, 16000);
            }

            try {
                sessionStorage.setItem("cb-teaser", "1");
            } catch (error) {
                // تجاهل
            }
        }, 2500);
    }

})();
