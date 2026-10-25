/* ==========================================================================
   CELESTA | Constitution page script
   Asks for a Club ID, opens the document when it matches, and handles the
   contents list, Print and Lock buttons.

   The list of Club IDs lives in assets/js/site.js (SITE.clubIds). Edit it there.
   This is a front door for casual visitors, not real security.
   ========================================================================== */

(() => {
  const KEY = "celesta-club-id";                 // remembered for this browser tab only
  const MAX_TRIES = 5;                           // wrong tries before a short pause
  const PAUSE_SECONDS = 20;

  const gate = document.querySelector("[data-gate]");
  const panel = document.querySelector("[data-gate-panel]");
  const form = document.querySelector("[data-gate-form]");
  const input = document.querySelector("#club-id");
  const submit = form && form.querySelector("button[type='submit']");
  const message = document.querySelector("[data-gate-message]");
  const doc = document.querySelector("[data-constitution]");
  const lead = document.querySelector("[data-lead]");
  if (!gate || !panel || !form || !input || !doc) return;

  const normalize = (value) => String(value || "").trim().toLowerCase();
  // Returns the ID exactly as it is written in the list, or undefined if there is no match.
  const findId = (value) => normalize(value) && (SITE.clubIds || []).find((id) => normalize(id) === normalize(value));

  const remember = (id) => { try { sessionStorage.setItem(KEY, id); } catch (e) { /* private mode */ } };
  const recall = () => { try { return sessionStorage.getItem(KEY); } catch (e) { return null; } };
  const forget = () => { try { sessionStorage.removeItem(KEY); } catch (e) { /* private mode */ } };

  // "AradhyaHaldikar123" becomes "Aradhya"
  const firstName = (id) => id.replace(/\d+$/, "").replace(/([a-z])([A-Z])/g, "$1 $2").split(" ")[0];

  function setLead(id) {
    if (!lead) return;
    if (!id) { lead.textContent = lead.dataset.locked; return; }
    const name = firstName(id);
    lead.textContent = (name ? `Welcome, ${name}. ` : "Welcome. ") + lead.dataset.open;
  }


  /* Contents list: highlights the section you are reading. */
  let tocReady = false;
  function setUpContents() {
    if (tocReady) return;
    tocReady = true;
    const links = [...doc.querySelectorAll(".doc-toc a")];
    const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
    const mark = (id) => links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + id));
    if (sections[0]) mark(sections[0].id);
    if (!("IntersectionObserver" in window)) return;
    const watcher = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) mark(entry.target.id); });
    }, { rootMargin: "-25% 0px -65% 0px" });
    sections.forEach((section) => watcher.observe(section));
  }


  /* Open and close */
  function showDocument(animate) {
    gate.hidden = true;
    doc.hidden = false;
    if (animate && !REDUCED) doc.classList.add("is-entering");
    setUpContents();
  }

  function unlock(id) {
    remember(id);
    setLead(id);
    message.textContent = "";
    panel.classList.remove("is-error");
    panel.classList.add("is-open");                       // the padlock opens
    if (REDUCED) { showDocument(false); return; }
    setTimeout(() => gate.classList.add("is-leaving"), 750);
    setTimeout(() => showDocument(true), 1200);
  }

  function lock() {
    forget();
    doc.hidden = true;
    doc.classList.remove("is-entering");
    gate.hidden = false;
    gate.classList.remove("is-leaving");
    panel.classList.remove("is-open", "is-error");
    input.value = "";
    message.textContent = "";
    setLead(null);
    window.scrollTo({ top: 0, behavior: "instant" });
    input.focus({ preventScroll: true });
  }


  /* Wrong ID: shake, buzz (on phones that can), and say so. */
  let fails = 0;
  function reject(typed) {
    fails += 1;
    panel.classList.add("is-error");
    message.textContent = normalize(typed) ? "Club ID not found. Check it and try again." : "Enter your Club ID.";
    panel.classList.remove("is-shaking");
    void panel.offsetWidth;                               // restart the shake if it is already running
    panel.classList.add("is-shaking");
    if (navigator.vibrate) navigator.vibrate([70, 50, 70]);
    input.focus();
    input.select();
    if (fails >= MAX_TRIES) pause();
  }

  // After a few wrong tries, wait a moment before allowing more.
  function pause() {
    let left = PAUSE_SECONDS;
    input.disabled = true;
    submit.disabled = true;
    const tick = () => {
      if (left <= 0) {
        clearInterval(timer);
        input.disabled = false;
        submit.disabled = false;
        fails = 0;
        message.textContent = "";
        panel.classList.remove("is-error");
        input.focus();
        return;
      }
      message.textContent = `Too many tries. Please wait ${left}s.`;
      left -= 1;
    };
    const timer = setInterval(tick, 1000);
    tick();
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const match = findId(input.value);
    if (match) unlock(match); else reject(input.value);
  });

  input.addEventListener("input", () => {
    if (input.disabled) return;
    panel.classList.remove("is-error");
    message.textContent = "";
  });
  panel.addEventListener("animationend", () => panel.classList.remove("is-shaking"));

  doc.querySelectorAll("[data-print]").forEach((button) => button.addEventListener("click", () => window.print()));
  doc.querySelectorAll("[data-lock]").forEach((button) => button.addEventListener("click", lock));


  /* On load: stay open if this tab already unlocked it and the ID is still on the list. */
  const saved = findId(recall());
  if (saved) {
    setLead(saved);
    panel.classList.add("is-open");
    showDocument(false);
  } else {
    forget();
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) input.focus({ preventScroll: true });
  }
})();
