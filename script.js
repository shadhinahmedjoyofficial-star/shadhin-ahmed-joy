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

  const links = () => {
    const s = d.social, out = [];
    if (has(s.linkedin)) out.push(["LinkedIn", s.linkedin]);
    if (has(s.facebook)) out.push(["Facebook", s.facebook]);
    if (has(s.instagram)) out.push(["Instagram", s.instagram]);
    if (has(s.github)) out.push(["GitHub", s.github]);
    return out;
  };

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
        has(d.social.linkedin) && h("a", { cls: "btn btn-ghost", href: d.social.linkedin, text: "LinkedIn" }),
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

  function renderContact() {
    const c = d.contact, s = d.social, box = clear($("contactInner"));
    const email = c.email || s.email, phone = c.phone || s.phone, wa = c.whatsapp || s.whatsapp;
    const rows = [];
    if (has(email)) rows.push(["Email", email, "mailto:" + email]);
    if (has(wa)) rows.push(["WhatsApp", wa, "https://wa.me/" + wa.replace(/\D/g, "")]);
    if (has(phone)) rows.push(["Phone", phone, "tel:" + phone.replace(/\s/g, "")]);
    links().forEach(([n, u]) => rows.push([n, u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""), u]));
    box.appendChild(h("div", { cls: "contact-inner" }, [
      h("h2", { text: c.heading }),
      h("p", { text: c.description }),
      h("div", { cls: "contacts" }, rows.map(([l, t, href]) => h("a", { href, attrs: {} }, [h("span", { text: l }), document.createTextNode(t)])))
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
})();
