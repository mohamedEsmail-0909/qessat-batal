// =========================================================
// شات بوت قصة بطل - أسئلة جاهزة وردود جاهزة
// محادثات محفوظة + سجل المحادثات + صوت أعلى + فقاعات بتكبر
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


    // ---------- الكلام (غيّره زي ما تحب) ----------

    var TEASER = "أهلًا بيك 👋 عايز تعرف الموقع ده بيتكلم عن إيه؟";
    var TEASER_BACK = "أهلًا بيك تاني 👋 تحب تكمل محادثتك؟";

    var WELCOME = [
        "أهلًا بيك في قصة بطل ❤️",
        "أنا مساعد الموقع 🤖 دوس على أي سؤال تحت وأنا أرد عليك."
    ];

    var FINISH = "كده خلصت أسئلتي 😄 تابعنا من هنا عشان توصلك الحلقات الجديدة أول بأول:";

    var RESTART_TEXT = "تمام، اسألني براحتك 😊";

    var QUESTIONS = [
        {
            q: "الموقع ده بيتكلم عن إيه؟",
            a: "ده موقع قصة بطل، بتاع محمد إسماعيل 🌟\n" +
               "بيحكي فيه قصص صحابة رسول الله ﷺ ومواقفهم، " +
               "عشان نتعلم منهم ونستلهم من سيرتهم، وكمان فيه دروس إيمانية قصيرة.\n" +
               "شعارنا: نحكي تاريخهم... لنستعد طريقنا."
        },
        {
            q: "مين اللي عمل الموقع؟",
            a: "الموقع والقناة بتوع محمد إسماعيل، " +
               "وهو اللي بيقدم الحلقات على فيسبوك ويوتيوب وتيك توك 🎬"
        },
        {
            q: "هلاقي إيه من قصص الصحابة؟",
            a: "هتلاقي حلقات عن أبو بكر وعمر وعثمان وخالد بن الوليد " +
               "ومصعب بن عمير وغيرهم، كل حلقة بتحكي موقف من حياتهم.",
            links: [
                { text: "قصص الصحابة", href: "companions.html" }
            ]
        },
        {
            q: "إيه الدروس الإيمانية دي؟",
            a: "وقفات إيمانية قصيرة عن الرضا والصبر والدعاء والتوكل على الله 🤍",
            links: [
                { text: "الدروس الإيمانية", href: "faith.html" }
            ]
        },
        {
            q: "عايز أشوف أحدث حلقة",
            a: "أحدث حلقة بتلاقيها في أول الصفحة الرئيسية، " +
               "وبتتحدث أول ما ينزل حلقة جديدة 🔥",
            links: [
                { text: "الصفحة الرئيسية", href: "index.html" }
            ]
        },
        {
            q: "أتابعكم منين؟",
            a: "تقدر تتابعنا من هنا، واشترك في قناة الواتساب " +
               "عشان توصلك الحلقات الجديدة أول بأول 📲",
            links: socialLinks
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

    var TICK_ONE =
        '<svg viewBox="0 0 16 11" width="15" height="10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1.5 6l3 3 6-7.5"/></svg>';

    var TICK_TWO =
        '<svg viewBox="0 0 16 11" width="15" height="10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M1 6l3 3 6-7.5"/><path d="M6 8.5l.5.5 6.5-8"/></svg>';


    // ---------- الشكل ----------

    var css = [
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

        /* فقاعات الفتح (بتكبر لحد ما تبقى الشات) */
        '.cb-trail{position:fixed;z-index:3001;border-radius:50%;pointer-events:none;background:radial-gradient(circle at 30% 28%,rgba(255,255,255,.95),rgba(241,208,100,.6) 45%,rgba(184,137,32,.4));border:1px solid rgba(255,255,255,.75);box-shadow:inset -2px -3px 7px rgba(184,137,32,.3),0 4px 14px rgba(184,137,32,.25);animation:cb-trail-in .45s cubic-bezier(.34,1.56,.64,1) both}',
        '.cb-trail.cb-trail-out{animation:cb-trail-out .55s ease forwards}',
        '.cb-trail.cb-trail-out.cb-trail-last{animation:cb-trail-last .6s ease forwards}',

        /* الصندوق الزجاجي */
        '.cb-panel{position:fixed;bottom:92px;left:20px;z-index:3000;width:360px;max-width:calc(100vw - 24px);height:560px;max-height:calc(100vh - 200px);max-height:calc(100dvh - 200px);display:flex;flex-direction:column;overflow:hidden;direction:rtl;font-family:inherit;color:var(--cb-text);background:var(--cb-glass);-webkit-backdrop-filter:blur(18px) saturate(1.5);backdrop-filter:blur(18px) saturate(1.5);border:1px solid var(--cb-line);box-shadow:0 22px 55px rgba(0,0,0,.3),inset 0 1px 0 rgba(255,255,255,.4);transform-origin:bottom left;opacity:0;visibility:hidden;pointer-events:none;transform:scale(.1);border-radius:60px;transition:transform .4s cubic-bezier(.4,0,.2,1),opacity .25s ease,border-radius .4s ease,visibility 0s .4s}',
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
        '@keyframes cb-trail-out{0%{transform:scale(1);opacity:1}100%{transform:scale(1.6);opacity:0}}',
        '@keyframes cb-trail-last{0%{transform:scale(1);opacity:1}100%{transform:scale(2.6);opacity:0}}',

        /* الموبايل */
        '@media (max-width:700px){.cb-toggle{left:12px;bottom:14px;width:56px;height:56px}.cb-teaser{left:12px;bottom:80px;max-width:210px}.cb-panel{left:12px;right:12px;width:auto;max-width:none;bottom:82px;height:calc(100vh - 190px);height:calc(100dvh - 190px);max-height:560px}.cb-msg{font-size:14.5px}.cb-head-name{font-size:15px}}',

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
                    return { current: data.current || null, chats: data.chats };
                }
            }
        } catch (error) {
            // تجاهل
        }

        return { current: null, chats: [] };
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

    panel.appendChild(head);
    panel.appendChild(body);
    panel.appendChild(tray);
    panel.appendChild(hist);

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
    }

    function resetView() {
        epoch++;
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

            botSequence([item.a], item.links, afterAnswer);
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
                addMessage(item.a, "bot");
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

    var TRAIL = [
        { x: 4,  y: -50,  s: 9 },
        { x: 14, y: -92,  s: 14 },
        { x: 30, y: -140, s: 21 },
        { x: 54, y: -196, s: 31 },
        { x: 86, y: -262, s: 45 }
    ];

    var TRAIL_STEP = 95;
    var TRAIL_TIME = (TRAIL.length - 1) * TRAIL_STEP + 260;
    var trailNodes = [];

    function growTrail() {
        var rect = toggle.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;

        var f = Math.max(0.45, Math.min(1, (cy - 110) / 262));
        var last = { x: cx, y: cy };

        trailNodes = [];

        TRAIL.forEach(function (t, i) {
            var x = cx + t.x * f;
            var y = cy + t.y * f;

            var node = el("span", "cb-trail");
            node.style.width = t.s + "px";
            node.style.height = t.s + "px";
            node.style.left = (x - t.s / 2) + "px";
            node.style.top = (y - t.s / 2) + "px";
            node.style.animationDelay = (i * TRAIL_STEP) + "ms";

            document.body.appendChild(node);
            trailNodes.push(node);

            last = { x: x, y: y };
        });

        return last;
    }

    function fadeTrail() {
        var nodes = trailNodes;
        trailNodes = [];

        nodes.forEach(function (node, i) {
            node.classList.add("cb-trail-out");

            if (i === nodes.length - 1) {
                node.classList.add("cb-trail-last");
            }

            setTimeout(function () { node.remove(); }, 800);
        });
    }

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

        if (reduceMotion) {
            revealPanel(null);
            opening = false;
            return;
        }

        var last = growTrail();
        sounds.trail(TRAIL.length);

        setTimeout(function () {
            revealPanel(last);
            fadeTrail();
            opening = false;
        }, TRAIL_TIME);
    }

    function closePanel() {
        if (opening || !isOpen()) return;

        hideHistory();

        panel.style.transformOrigin = "0px " + panel.offsetHeight + "px";
        panel.classList.remove("cb-open");

        toggle.classList.remove("cb-active");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "فتح المحادثة");

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