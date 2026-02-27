function formatNGN(n) {
  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0
    }).format(n);
  } catch {
    return "₦" + String(n);
  }
}

async function loadLedger() {
  const url = document.querySelector("[data-ledger-src]")?.getAttribute("data-ledger-src") || "data/ledger.json";
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Ledger load failed");
  return await res.json();
}

function setText(sel, txt) {
  const el = document.querySelector(sel);
  if (el) el.textContent = txt;
}

function setBar(sel, pct) {
  const el = document.querySelector(sel);
  if (el) el.style.width = pct + "%";
}

function renderRows(tbodySel, rowsHtml) {
  const el = document.querySelector(tbodySel);
  if (el) el.innerHTML = rowsHtml;
}

(async function () {
  const root = document.querySelector("[data-ledger]");
  if (!root) return;

  try {
    const ledger = await loadLedger();

    const s = ledger.summary || {};
    const donations = Number(s.donationsTotal || 0);
    const spent = Number(s.expensesTreatment || 0) + Number(s.expensesOutreach || 0) + Number(s.expensesAdmin || 0);
    const balance = Math.max(0, donations - spent);
    const spendPct = donations > 0 ? Math.min(100, Math.round((spent / donations) * 100)) : 0;

    setText("[data-kpi-donations]", formatNGN(donations));
    setText("[data-kpi-treatment]", formatNGN(Number(s.expensesTreatment || 0)));
    setText("[data-kpi-outreach]", formatNGN(Number(s.expensesOutreach || 0)));
    setText("[data-kpi-admin]", formatNGN(Number(s.expensesAdmin || 0)));
    setText("[data-kpi-balance]", formatNGN(balance));
    setText("[data-last-updated]", ledger.lastUpdated || "—");

    setText("[data-spend-pct]", spendPct + "%");
    setBar("[data-spend-bar]", spendPct);

    const donationsRows = (ledger.recentDonations || []).map(d => `
      <tr>
        <td>${d.date || ""}</td>
        <td>${d.name || "Anonymous"}</td>
        <td>${d.purpose || ""}</td>
        <td style="text-align:right; font-weight:900;">${formatNGN(Number(d.amount || 0))}</td>
      </tr>
    `).join("");

    const expensesRows = (ledger.recentExpenses || []).map(e => `
      <tr>
        <td>${e.date || ""}</td>
        <td>${e.category || ""}</td>
        <td class="truncate" title="${(e.note || "").replaceAll('"', "'")}">${e.note || ""}</td>
        <td style="text-align:right; font-weight:900;">${formatNGN(Number(e.amount || 0))}</td>
      </tr>
    `).join("");

    renderRows("[data-donations-body]", donationsRows || `<tr><td colspan="4" class="small">No records yet.</td></tr>`);
    renderRows("[data-expenses-body]", expensesRows || `<tr><td colspan="4" class="small">No records yet.</td></tr>`);

  } catch (err) {
    console.error(err);
    root.innerHTML = `
      <div class="card">
        <div style="font-weight:900;">Transparency data not available</div>
        <p class="p" style="margin-top:6px;">Please confirm <code>data/ledger.json</code> exists and GitHub Pages is serving it.</p>
      </div>
    `;
  }
})();
