// ===== الإعدادات =====
const SHEET_ID = "15_zR9P-8KX_UDgNSRNQ-f58Ah2-cjDeoblAEKJEMnm8";
// يقرأ أول ورقة في الملف تلقائيًا (لا يهم اسمها)
const URL_CSV = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&headers=1`;

// أعمدة الدرجات (العد يبدأ من 0: A=0, B=1, C=2 ...)
const FIELDS = [
  { col: 2, label: "اختبار 1", max: 20, icon: "📝" },
  { col: 3, label: "المشاركة", max: 10, icon: "🙋" },
  { col: 4, label: "السلوك", max: 10, icon: "🤝" },
  { col: 5, label: "المذكرة", max: 10, icon: "📓" },
  { col: 6, label: "المهمة 1", max: 5, icon: "✏️" },
  { col: 7, label: "المهمة 2", max: 5, icon: "📌" },
  { col: 8, label: "كتابة الفقرة 2", max: 10, icon: "🖋️" },
];
const REPORT_COL = 10; // عمود التقرير التربوي (K)
const TOTAL_MAX = FIELDS.reduce((s, f) => s + f.max, 0); // 70

// مستويات الأداء (النسبة المئوية) وما يناسب كل مستوى من رسم متحرك ورسالة
const TIERS = [
  { min: 90, cls: "t1", badge: "🏆 نجم متألق", scene: "trophy", confetti: true,
    msg: "ما شاء الله! أداء استثنائي يستحق الفخر. نبارك لكم ونشجعه على مواصلة التميز." },
  { min: 80, cls: "t2", badge: "🚀 أداء ممتاز", scene: "rocket", confetti: true,
    msg: "أداء ممتاز وجهد مشكور، وهو قريب جدًا من القمة. نشجعه على مواصلة الانطلاق!" },
  { min: 70, cls: "t3", badge: "📖 جيد جدًا", scene: "book",
    msg: "أداء جيد جدًا ومستقبل واعد، ومع مزيد من الاجتهاد سيصل إلى مستويات أعلى بإذن الله." },
  { min: 55, cls: "t4", badge: "🌱 جيد ويتطور", scene: "plant",
    msg: "نتيجة جيدة وفيها مجال واضح للتحسن، والمتابعة المنتظمة ستصنع فرقًا كبيرًا." },
  { min: 0, cls: "t5", badge: "🌅 بداية الطريق", scene: "sun",
    msg: "كل رحلة نجاح تبدأ بخطوة. نثق بقدرته على التقدم بتعاون المدرسة والأسرة، والغد أجمل بإذن الله." },
];

// ===== الرسوم المتحركة (SVG) =====
const STARS = `<g fill="#fff"><text class="tw" x="22" y="30" font-size="16">✦</text><text class="tw" x="130" y="22" font-size="12" style="animation-delay:.5s">✦</text><text class="tw" x="140" y="80" font-size="14" style="animation-delay:1s">✦</text><text class="tw" x="14" y="86" font-size="11" style="animation-delay:1.3s">✦</text></g>`;
const SCENES = {
  trophy: `<svg viewBox="0 0 160 140">${STARS}<g class="bounce"><path d="M50 20h60v30a30 30 0 0 1-60 0z" fill="#FFD43B"/><path d="M50 28H32q0 28 24 32M110 28h18q0 28-24 32" fill="none" stroke="#FFD43B" stroke-width="7"/><rect x="72" y="76" width="16" height="22" fill="#e0a100"/><rect x="52" y="98" width="56" height="14" rx="4" fill="#b45309"/><text x="80" y="58" text-anchor="middle" font-size="26" fill="#fff">★</text></g></svg>`,
  rocket: `<svg viewBox="0 0 160 140">${STARS}<g class="fly"><path class="flame" d="M70 94Q80 134 90 94Z" fill="#F5B700"/><path d="M80 10C100 30 100 70 94 94H66C60 70 60 30 80 10Z" fill="#fff"/><path d="M80 10C90 20 94 30 95 40H65C66 30 70 20 80 10Z" fill="#CE1126"/><circle cx="80" cy="56" r="10" fill="#38bdf8" stroke="#1e3a8a" stroke-width="3"/><path d="M66 72L48 96L66 92ZM94 72L112 96L94 92Z" fill="#CE1126"/></g></svg>`,
  book: `<svg viewBox="0 0 160 140"><g class="glow"><circle cx="80" cy="30" r="15" fill="#FFD43B"/><rect x="74" y="43" width="12" height="7" rx="2" fill="#cbd5e1"/></g><g fill="#fff"><text class="fl" x="24" y="62" font-size="20" font-weight="900">أ</text><text class="fl" x="124" y="58" font-size="18" font-weight="900" style="animation-delay:.8s">A</text><text class="fl" x="132" y="96" font-size="16" font-weight="900" style="animation-delay:1.6s">٣</text></g><path d="M80 120C60 106 38 106 20 112V64C38 58 60 58 80 72Z" fill="#fff" stroke="#1e3a8a" stroke-width="3"/><path d="M80 120C100 106 122 106 140 112V64C122 58 100 58 80 72Z" fill="#f1f5f9" stroke="#1e3a8a" stroke-width="3"/><path d="M32 78Q56 74 70 84M32 90Q56 86 70 96M90 84Q104 74 128 78M90 96Q104 86 128 90" stroke="#94a3b8" stroke-width="2.5" fill="none"/></svg>`,
  plant: `<svg viewBox="0 0 160 140"><g class="spin"><circle cx="130" cy="28" r="14" fill="#FFD43B"/><g stroke="#FFD43B" stroke-width="3" stroke-linecap="round"><path d="M130 6v-6M130 50v6M108 28h-6M158 28h-6M114 12l-4-4M146 44l4 4M146 12l4-4M114 44l-4 4"/></g></g><g class="grow"><path d="M80 118V62" stroke="#15803d" stroke-width="6" stroke-linecap="round"/><ellipse cx="62" cy="78" rx="18" ry="9" transform="rotate(-30 62 78)" fill="#4ade80"/><ellipse cx="98" cy="66" rx="18" ry="9" transform="rotate(30 98 66)" fill="#22c55e"/><ellipse cx="80" cy="52" rx="10" ry="16" fill="#86efac"/></g><path d="M55 116h50l-6 22H61z" fill="#b45309"/><rect x="52" y="112" width="56" height="8" rx="3" fill="#92400e"/></svg>`,
  sun: `<svg viewBox="0 0 160 140"><g class="rise"><g class="spin2"><g stroke="#FFE08A" stroke-width="4" stroke-linecap="round"><path d="M80 56v-12M80 136v-12M30 96h12M118 96h12M44 60l8 8M116 132l-8-8M116 60l-8 8M44 132l8-8"/></g></g><circle cx="80" cy="96" r="26" fill="#FFD43B"/></g><path d="M0 140V112Q40 92 80 110T160 102V140Z" fill="#16a34a"/><path d="M0 140V126Q50 112 100 126T160 120V140Z" fill="#15803d"/><g fill="#fff" opacity=".9"><ellipse class="fl" cx="30" cy="40" rx="18" ry="7"/><ellipse class="fl" cx="128" cy="30" rx="14" ry="6" style="animation-delay:1.2s"/></g></svg>`,
};

// ===== أدوات =====
let rows = null;

function parseCSV(text) {
  const out = []; let row = [], cur = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { cur += '"'; i++; } else q = false; }
      else cur += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(cur); cur = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cur); out.push(row); row = []; cur = "";
    } else cur += c;
  }
  if (cur !== "" || row.length) { row.push(cur); out.push(row); }
  return out;
}
function normalize(s) {
  return String(s || "")
    .replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d))
    .replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
    .replace(/\D/g, "");
}
const esc = s => String(s).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
const num = v => { const n = parseFloat(String(v).replace(/[^\d.]/g, "")); return isNaN(n) ? null : n; };
const clean = s => String(s || "").replace(/\s+/g, " ").trim();
const fmt = n => (Math.round(n * 10) / 10).toString();


// ===== التقرير التربوي =====
// كل موضوع يُكتشف من نص المعلم ويظهر ببطاقة متحركة بلون يناسب معناه
const TOPICS = [
  { re: /مستوى أكاديمي ممتاز|مجتهد/, icon: "🏅", anim: "star", color: "#16a34a", title: "مجتهد ومتميز", text: "يبذل جهدًا مشكورًا ومستواه الأكاديمي مشرّف." },
  { re: /يُستحسن|يستحسن|العناية بالدراسة/, icon: "📚", anim: "bob", color: "#ea580c", title: "عناية أكبر بالدراسة", text: "يحتاج إلى مزيد من الاهتمام والمراجعة المنتظمة." },
  { re: /المذكر|الورك بوك|الواجبات/, icon: "✏️", anim: "write", color: "#d97706", title: "المذكرة والواجبات", text: "يُرجى متابعة حل تمارين المذكرة وإنجاز الواجبات." },
  { re: /Reading|Speaking|Teams/i, icon: "🎧", anim: "pulse", color: "#2563eb", title: "أنشطة Teams", text: "متابعة أنشطة Reading وSpeaking على منصة Teams." },
  { re: /سلوك (ممتاز|ملتزم)|حريص على الانضباط/, icon: "🌟", anim: "twinkle", color: "#16a34a", title: "سلوك مشرّف", text: "ملتزم ومنضبط ومتعاون داخل الصف." },
  { re: /سجل تحس|تحسناً ملحوظ|تحسنا ملحوظ|تحسن ملحوظ/, icon: "📈", anim: "rise", color: "#0d9488", title: "تحسّن ملحوظ", text: "سجّل تقدمًا واضحًا في الالتزام بتعليمات الصف." },
  { re: /تعزيز التركيز|المشتتات/, icon: "🎯", anim: "pulse", color: "#7c3aed", title: "تعزيز التركيز", text: "يحتاج إلى تقليل المشتتات وتوجيه طاقته نحو التحصيل." },
  { re: /المزاح|احترام لقواعد|رفض النصح|الجلوس علي المقعد/, icon: "🤝", anim: "shake", color: "#CE1126", title: "قواعد الصف", text: "يُرجى الالتزام بقواعد الحصة والتعاون مع توجيهات المعلم." },
  { re: /رفع الصوت|الصراخ/, icon: "🤫", anim: "shake", color: "#be185d", title: "الهدوء في الحصة", text: "يُرجى تجنب رفع الصوت أثناء الدرس." },
  { re: /الحمام|الاستئذان|الالحاح للخروج/, icon: "🚪", anim: "swing", color: "#64748b", title: "البقاء في الصف", text: "يُرجى تقليل الخروج المتكرر أثناء الحصة." },
];

const REPORT_CSS = `
.rbtn{display:block;width:100%;margin-top:14px;padding:16px;font:inherit;font-weight:900;font-size:1.15rem;color:#fff;border:0;border-radius:16px;cursor:pointer;background:linear-gradient(135deg,var(--a),var(--b));box-shadow:0 6px 18px color-mix(in srgb,var(--a) 50%,transparent);animation:rglow 2s ease-in-out infinite}
@keyframes rglow{50%{transform:scale(1.025);box-shadow:0 10px 26px color-mix(in srgb,var(--b) 55%,transparent)}}
.rmodal{position:fixed;inset:0;z-index:99;background:rgba(15,23,42,.6);overflow:auto;padding:12px;display:none;backdrop-filter:blur(3px)}
.rmodal.open{display:block}
.rwrap{position:relative;max-width:720px;margin:10px auto 30px;background:#fff7ed;border-radius:22px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,.4);animation:rup .45s cubic-bezier(.2,.9,.3,1.1)}
@keyframes rup{from{opacity:0;transform:translateY(60px) scale(.96)}}
.rclose{position:absolute;top:10px;left:10px;z-index:5;width:38px;height:38px;border-radius:50%;border:0;padding:0;background:rgba(0,0,0,.35);color:#fff;font-size:1.2rem;cursor:pointer;box-shadow:none;animation:none}
.rbody{padding:16px}
.rsec{background:#fff;border-radius:18px;padding:14px;margin-bottom:14px;border-right:7px solid var(--a);box-shadow:0 4px 14px rgba(0,0,0,.07);animation:pop .5s ease both}
.rsec.rb{border-color:var(--b)}
.rsec h4{margin:0 0 8px;font-weight:900;font-size:1.15rem;color:var(--navy)}
.rsec>p{margin:0 0 10px;font-weight:600;line-height:1.9;unicode-bidi:plaintext;background:#f8fafc;border-radius:12px;padding:10px 12px}
.tcards{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px}
.tc{--k:#6b7280;text-align:center;border-radius:16px;padding:12px 10px;background:color-mix(in srgb,var(--k) 11%,#fff);border:2px solid color-mix(in srgb,var(--k) 38%,#fff);animation:pop .5s ease both}
.tc .ico{display:inline-block;font-size:2.5rem;line-height:1.2}
.tc b{display:block;color:var(--k);font-weight:900;margin:2px 0}
.tc p{margin:0;font-size:.85rem;font-weight:600;color:#475569}
.r-star{animation:rstar 3s ease-in-out infinite}@keyframes rstar{50%{transform:rotate(14deg) scale(1.2)}}
.r-bob{animation:rbob 1.6s ease-in-out infinite}@keyframes rbob{50%{transform:translateY(-9px)}}
.r-write{animation:rwrite 1.2s ease-in-out infinite}@keyframes rwrite{25%{transform:translate(-5px,3px) rotate(-12deg)}75%{transform:translate(5px,-2px) rotate(8deg)}}
.r-pulse{animation:rpulse 1.5s ease-in-out infinite}@keyframes rpulse{50%{transform:scale(1.22)}}
.r-twinkle{animation:rtw 1.8s ease-in-out infinite}@keyframes rtw{50%{transform:scale(1.25) rotate(20deg);filter:brightness(1.3)}}
.r-rise{animation:rrise 2s ease-in-out infinite}@keyframes rrise{0%{transform:translate(-6px,6px)}100%{transform:translate(6px,-6px)}}
.r-shake{animation:rshake .9s ease-in-out infinite}@keyframes rshake{25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
.r-swing{animation:rswing 2s ease-in-out infinite;transform-origin:0 50%}@keyframes rswing{50%{transform:rotate(-25deg)}}
.rfoot{text-align:center;background:linear-gradient(135deg,color-mix(in srgb,var(--a) 14%,#fff),color-mix(in srgb,var(--b) 12%,#fff));border-radius:18px;padding:14px;font-weight:800}
.rfoot small{display:block;color:#64748b;font-weight:600;margin-top:4px}
.racts{display:flex;gap:8px;justify-content:center;margin-top:12px}
.racts button{padding:10px 20px;font-size:.95rem;animation:none}
.racts .gray{background:#64748b;box-shadow:none}
@media print{body>*:not(#rmodal){display:none!important}.rmodal{position:static;background:none;padding:0;display:block!important}.rclose,.racts{display:none}.rwrap{box-shadow:none;animation:none;margin:0}*{animation:none!important}}
`;

function topicCards(text) {
  const list = TOPICS.filter(t => t.re.test(text));
  if (!list.length) return "";
  return `<div class="tcards">${list.map((t, i) => `<div class="tc" style="--k:${t.color};animation-delay:${0.15 + i * 0.12}s"><span class="ico r-${t.anim}">${t.icon}</span><b>${t.title}</b><p>${t.text}</p></div>`).join("")}</div>`;
}

// يبني صفحة التقرير (null إذا لا يوجد تقرير للطالب)
function reportHTML(r, tier, name, pct) {
  const parts = String(r[REPORT_COL] || "").split("|").map(clean).filter(Boolean);
  if (!parts.length) return null;
  const sec = (icon, title, text, cls, d) => `<div class="rsec ${cls}" style="animation-delay:${d}s"><h4>${icon} ${title}</h4><p>${esc(text)}</p>${topicCards(text)}</div>`;
  const body = parts.length === 1
    ? sec("📝", "ملاحظات المعلمين", parts[0], "ra", 0.1)
    : sec("📘", "الأداء الأكاديمي", parts[0], "ra", 0.1) + sec("🌟", "الأداء السلوكي والانضباط الصفي", parts.slice(1).join(" - "), "rb", 0.3);
  return `<div class="${tier.cls}"><div class="rwrap">
    <button class="rclose" data-close aria-label="إغلاق">✕</button>
    <div class="banner"><div class="conf"></div>
      <div class="btxt"><span class="badge">📋 التقرير التربوي</span><h2>${esc(name)}</h2><span class="seat">${tier.badge} • ${pct}%</span></div>
      <div class="scene">${SCENES[tier.scene]}</div></div>
    <div class="rbody">${body}
      <div class="rfoot">${tier.msg}<small>مع تمنياتنا بدوام التوفيق والنجاح 🌹 — إدارة مدرسة البلاد القديم الابتدائية الإعدادية</small></div>
      <div class="racts"><button data-print>🖨️ طباعة / حفظ PDF</button><button class="gray" data-close>إغلاق</button></div>
    </div></div></div>`;
}

function openReport(html, tier) {
  const m = document.getElementById("rmodal");
  m.innerHTML = html;
  m.classList.add("open");
  document.body.style.overflow = "hidden";
  m.scrollTop = 0;
  if (tier.confetti) confetti(m.querySelector(".conf"));
}
function closeReport() {
  const m = document.getElementById("rmodal");
  m.classList.remove("open"); m.innerHTML = "";
  document.body.style.overflow = "";
}
function initReport() {
  const st = document.createElement("style"); st.textContent = REPORT_CSS; document.head.appendChild(st);
  const m = document.createElement("div"); m.id = "rmodal"; m.className = "rmodal"; document.body.appendChild(m);
  m.addEventListener("click", e => {
    if (e.target === m || e.target.closest("[data-close]")) closeReport();
    else if (e.target.closest("[data-print]")) window.print();
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeReport(); });
}

async function loadData() {
  if (rows) return rows;
  const res = await fetch(URL_CSV);
  if (!res.ok) throw new Error("fetch failed");
  rows = parseCSV(await res.text());
  return rows;
}

function confetti(box) {
  const colors = ["#FFD43B", "#fff", "#CE1126", "#22d3ee", "#a3e635", "#f472b6"];
  let h = "";
  for (let i = 0; i < 26; i++) {
    h += `<i class="cf" style="left:${Math.random() * 100}%;background:${colors[i % colors.length]};animation-duration:${2.4 + Math.random() * 2}s;animation-delay:${Math.random() * 3}s"></i>`;
  }
  box.innerHTML = h;
}

function animateNumber(el, ring, target, pct) {
  const t0 = performance.now(), dur = 1200;
  (function step(t) {
    const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
    el.textContent = fmt(target * e);
    ring.style.setProperty("--p", pct * e);
    if (k < 1) requestAnimationFrame(step);
  })(t0);
}

function show(r) {
  const box = document.getElementById("student");
  const name = clean(r[1]);

  // الدرجات والمجموع (يُحسب من الدرجات نفسها). النص مثل "غائب" أو "محاولة غش" يظهر كحالة ولا يُحسب
  const items = FIELDS.map(f => {
    const raw = clean(r[f.col]);
    const n = /\d/.test(raw) ? num(raw) : null;
    return { ...f, n, status: n === null ? raw : "", ratio: n === null ? 0 : Math.min(1, n / f.max) };
  });
  const total = items.reduce((s, x) => s + (x.n || 0), 0);
  const pct = Math.min(100, Math.round(total / TOTAL_MAX * 100));
  const tier = TIERS.find(t => pct >= t.min);

  // نقطة القوة وفرصة التطوير (من الدرجات المسجلة فقط)
  const valid = items.filter(x => x.n !== null);
  let chips = "";
  if (valid.length) {
    const best = valid.reduce((a, b) => (b.ratio > a.ratio ? b : a));
    const worst = valid.reduce((a, b) => (b.ratio < a.ratio ? b : a));
    if (best.ratio > 0) chips += `<span class="chip cs">⭐ نقطة القوة: ${esc(best.label)}</span>`;
    if (worst.ratio < 1 && worst !== best) chips += `<span class="chip ci2">🎯 فرصة للتطوير: ${esc(worst.label)}</span>`;
  }

  const tiles = items.map((x, i) => {
    const d = `style="animation-delay:${i * 0.08}s"`;
    if (x.status) {
      const cheat = /غش/.test(x.status);
      return `<div class="tile ${cheat ? "g3" : "g0"}" ${d}><div class="ti">${cheat ? "⚠️" : "🚫"}</div><div class="tl">${esc(x.label)}</div><div class="tv"><b style="font-size:1.15rem">${esc(x.status)}</b></div></div>`;
    }
    const cls = x.n === null ? "g0" : x.ratio >= 0.85 ? "g1" : x.ratio >= 0.6 ? "g2" : "g3";
    return `<div class="tile ${cls}" ${d}><div class="ti">${x.icon}</div><div class="tl">${esc(x.label)}</div>
      <div class="tv"><b>${x.n === null ? "-" : esc(fmt(x.n))}</b><span> / ${x.max}</span></div>
      <div class="bar"><i data-w="${x.ratio * 100}"></i></div></div>`;
  }).join("");

  const rep = reportHTML(r, tier, name, pct);

  box.innerHTML = `
  <div class="${tier.cls}">
    <div class="banner">
      <div class="conf"></div>
      <div class="btxt"><span class="badge">${tier.badge}</span><h2>${esc(name)}</h2><span class="seat">رقم الجلوس: ${esc(clean(r[0]))}</span></div>
      <div class="scene">${SCENES[tier.scene]}</div>
    </div>
    <div class="body">
      <div class="msgbox">${tier.msg}</div>
      <div class="chips">${chips}</div>
      <div class="tiles">${tiles}</div>
      <div class="totalbox">
        <div class="ring" style="--p:0"><div><span><span class="num">0</span><small>من ${TOTAL_MAX}</small></span></div></div>
        <div><h4>المجموع الكلي: ${pct}%</h4><p>${tier.badge}</p></div>
      </div>
      ${rep ? '<button class="rbtn" id="rbtn">📋 عرض التقرير التربوي للطالب</button>' : ""}
    </div>
  </div>`;
  box.classList.remove("hidden");
  if (tier.confetti) confetti(box.querySelector(".conf"));
  const rb = box.querySelector("#rbtn");
  if (rb) rb.onclick = () => openReport(rep, tier);
  box.scrollIntoView({ behavior: "smooth", block: "start" });

  requestAnimationFrame(() => requestAnimationFrame(() => {
    box.querySelectorAll(".bar i").forEach(b => (b.style.width = b.dataset.w + "%"));
    animateNumber(box.querySelector(".num"), box.querySelector(".ring"), total, pct);
  }));
}

async function search() {
  const msg = document.getElementById("msg");
  const box = document.getElementById("student");
  const btn = document.getElementById("btn");
  const seat = normalize(document.getElementById("seat").value);
  msg.textContent = ""; box.classList.add("hidden");
  if (!seat) { msg.textContent = "من فضلك أدخل رقم الجلوس."; return; }
  btn.disabled = true; btn.textContent = "جاري البحث...";
  try {
    const data = await loadData();
    const r = data.find(x => normalize(x[0]) === seat);
    if (r) show(r); else msg.textContent = "لم يتم العثور على رقم الجلوس، تأكد من الرقم وحاول مرة أخرى.";
  } catch (e) {
    msg.textContent = "تعذر تحميل البيانات. تأكد أن الملف مشارك (أي شخص لديه الرابط) وحاول لاحقًا.";
  } finally {
    btn.disabled = false; btn.textContent = "عرض الدرجات";
  }
}

initReport();
document.getElementById("btn").addEventListener("click", search);
document.getElementById("seat").addEventListener("keydown", e => { if (e.key === "Enter") search(); });
