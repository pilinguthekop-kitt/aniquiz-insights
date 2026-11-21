(() => {
  const Q = window.QUESTIONS;
  const STORE = "aniquiz.log.v1";
  const QUIZ_LEN = 10;
  const $ = (s) => document.querySelector(s);
  const cats = [...new Set(Q.map((q) => q.cat))];

  // ---------- storage ----------
  function loadLog() {
    try { return JSON.parse(localStorage.getItem(STORE)) || []; } catch { return []; }
  }
  function saveLog(log) {
    try { localStorage.setItem(STORE, JSON.stringify(log)); } catch {}
  }

  // ---------- helpers ----------
  function seededRandom(seed) {
    let s = 0;
    for (const ch of seed) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
    return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 2 ** 32; };
  }
  function shuffle(arr, rand = Math.random) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  const today = () => new Date().toISOString().slice(0, 10);
  const pct = (x) => (isNaN(x) ? "–" : Math.round(x * 100) + "%");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ---------- views ----------
  function show(view) {
    document.querySelectorAll(".view").forEach((v) => v.classList.add("hidden"));
    $("#view-" + view).classList.remove("hidden");
    document.querySelectorAll("nav button").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
    if (view === "stats") renderStats();
    if (view === "items") renderItems();
    if (view === "home") renderHome();
    window.scrollTo(0, 0);
  }
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-view]");
    if (b) { stopTimer(); show(b.dataset.view); }
  });

  function renderHome() {
    const log = loadLog();
    $("#cat-cards").innerHTML = cats.map((c) => {
      const rows = log.filter((r) => r.cat === c);
      const acc = rows.length ? rows.filter((r) => r.correct).length / rows.length : NaN;
      const n = Q.filter((q) => q.cat === c).length;
      return `<button class="card mode" data-mode="cat" data-cat="${esc(c)}">
        <h3>${esc(c)}</h3><p>${n} questions</p>
        <div class="meta">Your accuracy: ${pct(acc)}</div></button>`;
    }).join("");
  }
  document.addEventListener("click", (e) => {
    const m = e.target.closest(".mode");
    if (!m) return;
    let pool, label;
    if (m.dataset.mode === "daily") { pool = shuffle(Q, seededRandom(today())); label = "daily"; }
    else if (m.dataset.mode === "cat") { pool = shuffle(Q.filter((q) => q.cat === m.dataset.cat)); label = m.dataset.cat; }
    else { pool = shuffle(Q); label = "mixed"; }
    startQuiz(pool.slice(0, QUIZ_LEN), label);
  });

  // ---------- quiz ----------
  let quiz = null, timerId = null;
  function stopTimer() { clearInterval(timerId); timerId = null; }

  function startQuiz(items, mode) {
    quiz = { items, mode, i: 0, answers: [], session: Date.now() };
    show("quiz");
    renderQuestion();
  }

  function renderQuestion() {
    const q = quiz.items[quiz.i];
    $("#q-progress").textContent = `Question ${quiz.i + 1} / ${quiz.items.length}`;
    $("#q-cat").textContent = q.cat;
    $("#q-bar").style.width = (quiz.i / quiz.items.length) * 100 + "%";
    $("#q-text").textContent = q.q;
    $("#q-next").classList.add("hidden");
    // shuffle option order but keep track of the original index
    const order = shuffle(q.options.map((_, i) => i));
    $("#q-options").innerHTML = order.map((oi) =>
      `<button data-oi="${oi}">${esc(q.options[oi])}</button>`).join("");
    quiz.start = performance.now();
    stopTimer();
    $("#q-timer").textContent = "0.0s";
    timerId = setInterval(() => {
      $("#q-timer").textContent = ((performance.now() - quiz.start) / 1000).toFixed(1) + "s";
    }, 100);
  }

  $("#q-options").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b || b.disabled) return;
    stopTimer();
    const q = quiz.items[quiz.i];
    const chosen = Number(b.dataset.oi);
    const ms = Math.round(performance.now() - quiz.start);
    const correct = chosen === q.answer;
    document.querySelectorAll("#q-options button").forEach((btn) => {
      btn.disabled = true;
      if (Number(btn.dataset.oi) === q.answer) btn.classList.add("correct");
    });
    if (!correct) b.classList.add("wrong");
    quiz.answers.push({ q, chosen, correct, ms });
    const log = loadLog();
    log.push({ ts: new Date().toISOString(), session: quiz.session, mode: quiz.mode,
      qid: q.id, cat: q.cat, correct, ms });
    saveLog(log);
    $("#q-next").textContent = quiz.i + 1 < quiz.items.length ? "Next" : "See result";
    $("#q-next").classList.remove("hidden");
    $("#q-next").focus();
  });

  $("#q-next").addEventListener("click", () => {
    quiz.i++;
    if (quiz.i < quiz.items.length) renderQuestion(); else renderResult();
  });

  function renderResult() {
    const a = quiz.answers;
    const score = a.filter((x) => x.correct).length;
    const avg = a.reduce((s, x) => s + x.ms, 0) / a.length / 1000;
    $("#r-score").textContent = `You scored ${score} / ${a.length}`;
    $("#r-detail").textContent = `Average time per question: ${avg.toFixed(1)}s`;
    $("#r-review").innerHTML = a.map((x) =>
      `<li><span class="${x.correct ? "ok" : "no"}">${x.correct ? "✓" : "✗"}</span> ${esc(x.q.q)}
       <br><span class="muted">Answer: ${esc(x.q.options[x.q.answer])}${x.correct ? "" : ` · You chose: ${esc(x.q.options[x.chosen])}`}${x.q.src ? ` · <a href="${esc(x.q.src)}" target="_blank" rel="noopener">source</a>` : ""}</span></li>`).join("");
    show("result");
  }

  // ---------- stats ----------
  const charts = {};
  function chart(id, config) {
    if (!window.Chart) return;
    charts[id]?.destroy();
    charts[id] = new Chart(document.getElementById(id), config);
  }
  const css = (v) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();

  function renderStats() {
    const log = loadLog();
    const sessions = [...new Set(log.map((r) => r.session))];
    const acc = log.length ? log.filter((r) => r.correct).length / log.length : NaN;
    const avgT = log.length ? log.reduce((s, r) => s + r.ms, 0) / log.length / 1000 : NaN;
    const catAcc = cats.map((c) => {
      const rows = log.filter((r) => r.cat === c);
      return rows.length ? rows.filter((r) => r.correct).length / rows.length : NaN;
    });
    const valid = catAcc.map((v, i) => [v, cats[i]]).filter(([v]) => !isNaN(v)).sort((a, b) => a[0] - b[0]);
    const weakest = valid.length ? valid[0][1] : "–";
    $("#kpis").innerHTML = [
      [log.length, "Answers logged"], [sessions.length, "Quizzes played"],
      [pct(acc), "Overall accuracy"], [isNaN(avgT) ? "–" : avgT.toFixed(1) + "s", "Avg time / question"],
      [weakest, "Weakest category"],
    ].map(([v, l]) => `<div class="kpi"><b>${esc(v)}</b><span>${l}</span></div>`).join("");

    Chart.defaults.color = css("--muted");
    Chart.defaults.borderColor = css("--border");
    const accent = css("--accent"), accent2 = css("--accent-2");

    chart("ch-cat", {
      type: "bar",
      data: { labels: cats, datasets: [{ data: catAcc.map((v) => (isNaN(v) ? 0 : Math.round(v * 100))), backgroundColor: accent2, borderRadius: 6 }] },
      options: { plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100, ticks: { callback: (v) => v + "%" } } } },
    });

    const bins = ["<3s", "3–6s", "6–10s", "10–15s", "15s+"];
    const edges = [3000, 6000, 10000, 15000, Infinity];
    const counts = bins.map(() => 0);
    log.forEach((r) => counts[edges.findIndex((e) => r.ms < e)]++);
    chart("ch-time", {
      type: "bar",
      data: { labels: bins, datasets: [{ data: counts, backgroundColor: accent, borderRadius: 6 }] },
      options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { precision: 0 } } } },
    });

    const curve = sessions.map((s) => {
      const rows = log.filter((r) => r.session === s);
      return Math.round((rows.filter((r) => r.correct).length / rows.length) * 100);
    });
    chart("ch-curve", {
      type: "line",
      data: { labels: curve.map((_, i) => "#" + (i + 1)), datasets: [{ data: curve, borderColor: accent, backgroundColor: accent, tension: 0.3 }] },
      options: { plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 100, ticks: { callback: (v) => v + "%" } } } },
    });
  }

  $("#export-csv").addEventListener("click", () => {
    const log = loadLog();
    const head = "timestamp,session,mode,question_id,category,correct,response_ms";
    const rows = log.map((r) => [r.ts, r.session, `"${r.mode}"`, r.qid, `"${r.cat}"`, r.correct ? 1 : 0, r.ms].join(","));
    const blob = new Blob([[head, ...rows].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `aniquiz-results-${today()}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  });

  $("#reset").addEventListener("click", () => {
    if (confirm("Delete all your saved quiz results on this device?")) { saveLog([]); renderStats(); }
  });

  // ---------- item analysis ----------
  function renderItems() {
    const log = loadLog();
    const rows = Q.map((q) => {
      const r = log.filter((x) => x.qid === q.id);
      const p = r.length ? r.filter((x) => x.correct).length / r.length : NaN;
      const t = r.length ? r.reduce((s, x) => s + x.ms, 0) / r.length / 1000 : NaN;
      return { q, n: r.length, p, t };
    }).sort((a, b) => (isNaN(a.p) ? 2 : a.p) - (isNaN(b.p) ? 2 : b.p));
    const tag = (p) => isNaN(p) ? "" : p < 0.3 ? '<span class="tag hard">hard</span>' : p > 0.8 ? '<span class="tag easy">easy</span>' : '<span class="tag mid">medium</span>';
    $("#items-table").innerHTML =
      `<tr><th>Question</th><th>Category</th><th>Attempts</th><th>p</th><th>Avg time</th><th></th></tr>` +
      rows.map(({ q, n, p, t }) => `<tr><td>${esc(q.q)}</td><td>${esc(q.cat)}</td>
        <td class="num">${n}</td><td class="num">${isNaN(p) ? "–" : p.toFixed(2)}</td>
        <td class="num">${isNaN(t) ? "–" : t.toFixed(1) + "s"}</td><td>${tag(p)}</td></tr>`).join("");
  }

  renderHome();
})();
