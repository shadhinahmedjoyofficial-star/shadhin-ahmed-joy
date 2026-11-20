(function () {
  const d = portfolioData;
  const $ = (id) => document.getElementById(id);

  function h(tag, opts = {}, kids = []) {
    const n = document.createElement(tag);
    if (opts.cls) n.className = opts.cls;
    if (opts.text) n.textContent = opts.text;
    if (opts.href) { n.href = opts.href; if (/^https?:/.test(opts.href)) { n.target = "_blank"; n.rel = "noopener noreferrer"; } }
    if (opts.attrs) Object.entries(opts.attrs).forEach(([k, v]) => n.setAttribute(k, v));
    [].concat(kids).forEach((k) => k && n.appendChild(k));
    return n;
  }
  const has = (v) => typeof v === "string" && v.trim() !== "";
  const clear = (n) => { while (n.firstChild) n.removeChild(n.firstChild); return n; };

  const ch = (t) => ((d.contact.channels.find((c) => c.type === t) || {}).value || "").trim();
  const links = () => [["LinkedIn", "linkedin"], ["Facebook", "facebook"]].filter(([, t]) => has(ch(t))).map(([n, t]) => [n, ch(t)]);

  function renderMeta() {
    const p = d.personal;
    document.title = p.name + " | " + p.designation;
    const set = (sel, v) => { const m = document.querySelector(sel); if (m) m.setAttribute("content", v); };
    set('meta[name="description"]', p.shortBio);
    set('meta[property="og:title"]', p.name + " | " + p.designation);
    set('meta[property="og:description"]', p.headline);
    $("brand").textContent = p.name;
  }

  function renderNav() {
    const items = [["home", "Home"], ["about", "About"], ["education", "Education"], ["skills", "Skills"], ["experience", "Experience"], ["projects", "Projects"], ["contact", "Contact"]];
    const ul = $("navLinks");
    items.forEach(([id, label]) => ul.appendChild(h("li", {}, h("a", { href: "#" + id, text: label, attrs: { "data-nav": id } }))));
  }

  function renderHero() {
    const p = d.personal, box = clear($("heroInner"));
    const info = h("div", {}, [
      h("span", { cls: "pill", text: p.location }),
      h("h1", { text: p.name }),
      h("p", { cls: "role", text: p.designation }),
      h("p", { cls: "lead", text: p.shortBio }),
      h("div", { cls: "btns" }, [
        h("a", { cls: "btn btn-primary", href: "#projects", text: "View My Work" }),
        h("a", { cls: "btn btn-ghost", href: "#contact", text: "Let’s Connect" }),
        has(ch("linkedin")) && h("a", { cls: "btn btn-ghost", href: ch("linkedin"), text: "LinkedIn" }),
        has(p.resumeLink) && h("a", { cls: "btn btn-ghost", href: p.resumeLink, text: "Résumé" })
      ])
    ]);
    box.appendChild(info);
    if (has(p.profileImage)) box.appendChild(h("img", { cls: "avatar", attrs: { src: p.profileImage, alt: "Portrait of " + p.name } }));
  }

  function renderAbout() {
    const box = clear($("aboutBody"));
    d.personal.about.forEach((t) => box.appendChild(h("p", { text: t })));
  }

  function renderEducation() {
    const box = clear($("educationList"));
    d.education.forEach((e) => {
      const years = has(e.startYear) ? e.startYear + (has(e.endYear) ? "–" + e.endYear : "") : "";
      const when = [years, e.status].filter(has).join(" · ");
      box.appendChild(h("article", { cls: "item reveal" }, [
        h("div", { cls: "when", text: when }),
        h("div", {}, [
          h("h3", { text: e.institution }),
          has(e.degree) && h("p", { cls: "sub", text: e.degree }),
          has(e.department) && h("p", { text: e.department }),
          has(e.description) && h("p", { text: e.description })
        ])
      ]));
    });
  }

  function renderSkills() {
    const box = clear($("skillsGrid"));
    d.skills.filter((g) => g.items.length).forEach((g) => {
      box.appendChild(h("div", { cls: "reveal" }, [
        h("h3", { text: g.category }),
        h("ul", { cls: "chips" }, g.items.map((i) => h("li", { cls: "chip", text: i })))
      ]));
    });
  }

  function renderExperience() {
    const box = clear($("experienceList"));
    d.experience.filter((x) => has(x.position)).forEach((x) => {
      const list = (arr) => arr && arr.length ? h("ul", {}, arr.map((t) => h("li", { text: t }))) : null;
      box.appendChild(h("article", { cls: "item reveal" }, [
        h("div", { cls: "when", text: [x.duration, x.employmentType].filter(has).join(" · ") }),
        h("div", {}, [
          h("h3", { text: x.position }),
          h("p", { cls: "sub", text: [x.company, x.location].filter(has).join(", ") }),
          has(x.description) && h("p", { text: x.description }),
          list(x.responsibilities),
          list(x.achievements)
        ])
      ]));
    });
  }

  function renderProjects() {
    const box = clear($("projectsGrid"));
    const sorted = d.projects.filter((p) => has(p.title)).sort((a, b) => !!b.featured - !!a.featured);
    sorted.forEach((p) => {
      const acts = h("div", { cls: "btns" }, [
        has(p.liveLink) && h("a", { cls: "btn btn-primary btn-sm", href: p.liveLink, text: "Live Preview", attrs: { "aria-label": "Live preview of " + p.title } }),
        has(p.repoLink) && h("a", { cls: "btn btn-ghost btn-sm", href: p.repoLink, text: "Source Code", attrs: { "aria-label": "Source code of " + p.title } })
      ]);
      box.appendChild(h("article", { cls: "card reveal" }, [
        has(p.image) && h("img", { attrs: { src: p.image, alt: p.title + " preview", loading: "lazy" } }),
        h("div", { cls: "card-body" }, [
          has(p.category) && h("p", { cls: "cat", text: p.category }),
          h("h3", { text: p.title }),
          h("p", { text: p.description }),
          acts.children.length ? acts : null
        ])
      ]));
    });
  }

  const svg = (p) => '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + "</svg>";
  const ICONS = {
    email: svg('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
    whatsapp: svg('<path d="M3 21l1.7-5A8.5 8.5 0 1 1 8 19.3L3 21z"/><path d="M9 9c0 3.200 2.800 6 6 6l1-1.600-2-1-1 .8a4 4 0 0 1-1.800-1.800l.8-1-1-2z"/>'),
    linkedin: svg('<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 11v6M8 7.500v.01M12 17v-6m0 3a3 3 0 0 1 6 0v3"/>'),
    facebook: svg('<path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8.500a.5.5 0 0 1 .5-.5z"/>'),
    phone: svg('<path d="M5 4h4l2 5-2.500 1.500a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>')
  };

  let toastTimer;
  function toast(msg) {
    let t = $("toast");
    if (!t) { t = h("div", { cls: "toast", attrs: { id: "toast", role: "status", "aria-live": "polite" } }); document.body.appendChild(t); }
    t.textContent = msg; t.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
  }
  async function copyText(v) {
    try { await navigator.clipboard.writeText(v); }
    catch (e) {
      const ta = h("textarea", { attrs: { readonly: "", style: "position:fixed;opacity:0" } });
      ta.value = v; document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); } catch (_) {}
      ta.remove();
    }
    toast("Phone number copied: " + v);
  }

  function channelNode(c) {
    const v = (c.value || "").trim();
    if (!v) return null;
    const label = c.type === "phone" ? "Copy phone number " + v : c.label;
    const base = { cls: "icon-btn", attrs: { "aria-label": label, title: label } };
    let n;
    if (c.type === "phone") {
      n = h("button", { ...base, attrs: { ...base.attrs, type: "button" } });
      n.addEventListener("click", () => copyText(v));
    } else {
      const href = c.type === "email" ? "mailto:" + v : c.type === "whatsapp" ? "https://wa.me/" + v.replace(/\D/g, "") : v;
      n = h("a", { ...base, href });
    }
    n.innerHTML = ICONS[c.type] || "";
    return n;
  }

  function renderContact() {
    const c = d.contact, box = clear($("contactInner"));
    box.appendChild(h("div", { cls: "contact-inner" }, [
      h("h2", { text: c.heading }),
      h("p", { text: c.description }),
      h("div", { cls: "icon-row" }, c.channels.map(channelNode))
    ]));
  }

  function renderFooter() {
    const p = d.personal, box = clear($("footerInner"));
    box.appendChild(h("div", {}, [
      h("p", {}, h("strong", { text: p.name })),
      h("p", { text: p.designation + " · © " + new Date().getFullYear() })
    ]));
    box.appendChild(h("div", { cls: "socials" }, links().map(([n, u]) => h("a", { href: u, text: n }))));
  }

  function initMenu() {
    const btn = $("menuBtn"), nav = document.querySelector("#nav nav");
    const close = () => { nav.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); };
    btn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  function initObservers() {
    const navLinks = document.querySelectorAll("[data-nav]");
    const sections = document.querySelectorAll("main section");
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) navLinks.forEach((a) => a.classList.toggle("active", a.dataset.nav === en.target.id));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => spy.observe(s));

    const rv = new IntersectionObserver((entries, o) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); o.unobserve(en.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((n) => rv.observe(n));
  }

  renderMeta(); renderNav(); renderHero(); renderAbout(); renderEducation();
  renderSkills(); renderExperience(); renderProjects(); renderContact(); renderFooter();
  initMenu(); initObservers();
  const onScroll = () => $("nav").classList.toggle("scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
})();
