/* ============================================================================
   ICLIMATE SYSTEM EXPLORER — RENDER + INTERACTION LOGIC
   Reads from ICLIMATE_DATA (data.js) and renders every section.
   Edit data.js to update content — this file should rarely need changes.
   ============================================================================ */

(function () {
  "use strict";

  const D = ICLIMATE_DATA;

  /* ---------------------------------------------------------------------
     Small helpers
     --------------------------------------------------------------------- */
  function el(tag, attrs, children) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.entries(attrs).forEach(([k, v]) => {
        if (k === "class") node.className = v;
        else if (k === "html") node.innerHTML = v;
        else node.setAttribute(k, v);
      });
    }
    if (children) {
      (Array.isArray(children) ? children : [children]).forEach((c) => {
        if (c == null) return;
        node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
      });
    }
    return node;
  }

  function chevronSVG() {
    return `<svg class="accordion-chevron" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }

  function buildFlowPipeline(steps) {
    const wrap = el("div", { class: "flow-pipeline" });
    steps.forEach((step, i) => {
      wrap.appendChild(el("span", { class: "flow-node" }, step));
      if (i < steps.length - 1) {
        const connector = el("span", { class: "flow-connector" });
        connector.style.setProperty("--flow-i", i);
        wrap.appendChild(connector);
      }
    });
    return wrap;
  }

  function makeAccordion({ index, title, sub, bodyBuilder }) {
    const wrap = el("div", { class: "accordion" });
    const head = el("button", { class: "accordion-head", type: "button" }, [
      index != null ? el("span", { class: "accordion-index" }, String(index).padStart(2, "0")) : null,
      el("span", { class: "accordion-title" }, title),
      sub ? el("span", { class: "accordion-sub" }, sub) : null,
    ]);
    head.insertAdjacentHTML("beforeend", chevronSVG());

    const body = el("div", { class: "accordion-body" });
    const inner = el("div", { class: "accordion-body-inner" });
    inner.appendChild(bodyBuilder());
    body.appendChild(inner);

    head.addEventListener("click", () => {
      const isOpen = wrap.classList.contains("open");
      wrap.classList.toggle("open", !isOpen);
      body.style.maxHeight = !isOpen ? body.scrollHeight + "px" : "0px";
    });

    wrap.appendChild(head);
    wrap.appendChild(body);
    wrap._recalc = () => {
      if (wrap.classList.contains("open")) body.style.maxHeight = body.scrollHeight + "px";
    };
    return wrap;
  }

  function subblock(label, bodyNode) {
    return el("div", { class: "subblock" }, [
      el("div", { class: "subblock-label" }, label),
      el("div", { class: "subblock-body" }, bodyNode),
    ]);
  }

  function listNode(items) {
    const ul = el("ul");
    items.forEach((i) => ul.appendChild(el("li", null, i)));
    return ul;
  }

  function tagRow(items, cls) {
    const row = el("div", { class: "tag-row" });
    items.forEach((t) => row.appendChild(el("span", { class: "tag " + (cls || "") }, t)));
    return row;
  }

  /* =======================================================================
     OVERVIEW
     ======================================================================= */
  function renderOverview() {
    const root = document.getElementById("section-overview");
    root.innerHTML = "";

    root.appendChild(el("div", { class: "eyebrow" }, "01 — Overview"));
    root.appendChild(el("h1", { class: "page-title" }, D.meta.name));
    root.appendChild(el("p", { class: "page-lede" }, D.meta.tagline));

    const metaGrid = el("div", { class: "overview-meta-grid" }, [
      el("div", { class: "meta-card" }, [
        el("div", { class: "meta-label" }, "Location"),
        el("div", { class: "meta-value" }, D.meta.location),
      ]),
      el("div", { class: "meta-card" }, [
        el("div", { class: "meta-label" }, "Institution"),
        el("div", { class: "meta-value" }, D.meta.school),
      ]),
    ]);
    root.appendChild(metaGrid);

    root.appendChild(el("h2", { class: "section-title" }, "What it does"));
    root.appendChild(el("p", { class: "page-lede", style: "margin-bottom:24px" }, D.meta.description));

    root.appendChild(el("h2", { class: "section-title" }, "Tech stack"));
    const stackGrid = el("div", { class: "stack-grid" });
    D.meta.stack.forEach((s) => {
      stackGrid.appendChild(el("div", { class: "stack-chip" }, [
        el("span", { class: "chip-name" }, s.name),
        el("span", { class: "chip-role" }, s.role),
      ]));
    });
    root.appendChild(stackGrid);

    root.appendChild(el("h2", { class: "section-title" }, "Key features"));
    const featGrid = el("div", { class: "feature-grid" });
    D.meta.keyFeatures.forEach((f) => featGrid.appendChild(el("div", { class: "feature-item" }, f)));
    root.appendChild(featGrid);
  }

  /* =======================================================================
     ROLES
     ======================================================================= */
  function renderRoles() {
    const root = document.getElementById("section-roles");
    root.innerHTML = "";
    root.appendChild(el("div", { class: "eyebrow" }, "02 — User Roles"));
    root.appendChild(el("h1", { class: "page-title" }, "Who uses iClimate"));
    root.appendChild(el("p", { class: "page-lede" }, "Three roles, three different views into the same system. Switch between them to see what each one can do, access, and can't touch."));

    const subtabs = el("div", { class: "subtabs" });
    const cardsWrap = el("div", null);

    D.roles.forEach((role, i) => {
      const btn = el("button", { class: "subtab-btn" + (i === 0 ? " active" : ""), type: "button", "data-role": role.id }, role.name);
      subtabs.appendChild(btn);

      const card = el("div", { class: "role-card" + (i === 0 ? " active" : ""), "data-role-card": role.id });

      card.appendChild(el("div", { class: "role-header" }, [
        el("h3", null, role.name),
        el("span", { class: "route-tag" }, role.dashboardRoute),
      ]));
      card.appendChild(el("p", { class: "role-desc" }, role.description));

      const pillRow = el("div", { class: "pill-row" });
      role.sidebar.forEach((s) => pillRow.appendChild(el("span", { class: "pill" }, s)));
      card.appendChild(pillRow);

      const tableWrap = el("div", { class: "data-table-wrap" });
      const table = el("table", { class: "data-table" });
      table.innerHTML = `
        <thead><tr><th>Action</th><th>Controller</th><th>File</th></tr></thead>
        <tbody>${role.functions.map(f => `
          <tr>
            <td>${f.action}</td>
            <td><code>${f.controller}</code></td>
            <td><code>${f.file}</code></td>
          </tr>`).join("")}
        </tbody>`;
      tableWrap.appendChild(table);
      card.appendChild(tableWrap);

      const logicAccordion = makeAccordion({
        title: "Explain role logic",
        sub: "expand for full behavior",
        bodyBuilder: () => {
          const wrap = el("div");
          wrap.appendChild(subblock("What they can do", listNode(role.logic.canDo)));
          wrap.appendChild(subblock("Data they access", listNode(role.logic.dataAccess)));
          wrap.appendChild(subblock("Restrictions", listNode(role.logic.restrictions)));
          wrap.appendChild(subblock("Interaction with other roles", el("p", null, role.logic.interactsWith)));
          wrap.appendChild(el("div", { class: "advanced-block" }, role.logic.realBehavior));
          return wrap;
        },
      });
      card.appendChild(logicAccordion);
      cardsWrap.appendChild(card);
    });

    subtabs.addEventListener("click", (e) => {
      const btn = e.target.closest(".subtab-btn");
      if (!btn) return;
      subtabs.querySelectorAll(".subtab-btn").forEach((b) => b.classList.toggle("active", b === btn));
      cardsWrap.querySelectorAll(".role-card").forEach((c) => c.classList.toggle("active", c.dataset.roleCard === btn.dataset.role));
    });

    root.appendChild(subtabs);
    root.appendChild(cardsWrap);
  }

  /* =======================================================================
     MODULES
     ======================================================================= */
  function renderModules() {
    const root = document.getElementById("section-modules");
    root.innerHTML = "";
    root.appendChild(el("div", { class: "eyebrow" }, "03 — Core Modules"));
    root.appendChild(el("h1", { class: "page-title" }, "17 modules, end to end"));
    root.appendChild(el("p", { class: "page-lede" }, "Every module below expands into what it does, how it works, where its data comes from, and the exact pipeline a request travels through."));

    const listWrap = el("div", { id: "modulesList" });
    const emptyState = el("div", { class: "empty-state", id: "modulesEmpty", style: "display:none" }, "No modules match your search.");

    D.modules.forEach((m) => {
      const acc = makeAccordion({
        index: m.id,
        title: m.name,
        sub: m.stack.join(" · "),
        bodyBuilder: () => {
          const wrap = el("div");
          wrap.appendChild(subblock("A. What it does", el("p", null, m.what)));
          wrap.appendChild(subblock("B. How it works", el("p", null, m.how)));

          const dataSourceBody = el("div");
          if (m.dataSource.apis.length) dataSourceBody.appendChild(tagRow(m.dataSource.apis, "tag-api"));
          if (m.dataSource.tables.length) dataSourceBody.appendChild(tagRow(m.dataSource.tables, "tag-table"));
          if (m.dataSource.services.length) dataSourceBody.appendChild(tagRow(m.dataSource.services, "tag-service"));
          wrap.appendChild(subblock("C. Data source / API used", dataSourceBody));

          wrap.appendChild(subblock("D. System flow", buildFlowPipeline(m.flow)));
          wrap.appendChild(subblock("E. Tech stack used", tagRow(m.stack)));

          const compBody = el("div");
          compBody.appendChild(subblock("Controllers", listNode(m.components.controllers)));
          compBody.appendChild(subblock("Models", listNode(m.components.models)));
          compBody.appendChild(subblock("Services", listNode(m.components.services)));
          compBody.appendChild(subblock("Views", listNode(m.components.views)));
          wrap.appendChild(subblock("F. Key components", compBody));

          wrap.appendChild(subblock("G. Advanced explanation", el("div", { class: "advanced-block" }, m.advanced)));
          return wrap;
        },
      });
      acc.dataset.searchable = [m.name, m.what, m.how, ...m.stack].join(" ").toLowerCase();
      listWrap.appendChild(acc);
    });

    root.appendChild(listWrap);
    root.appendChild(emptyState);
  }

  /* =======================================================================
     ARCHITECTURE
     ======================================================================= */
  function renderArchitecture() {
    const root = document.getElementById("section-architecture");
    root.innerHTML = "";
    root.appendChild(el("div", { class: "eyebrow" }, "04 — System Architecture"));
    root.appendChild(el("h1", { class: "page-title" }, "How the pieces fit together"));
    root.appendChild(el("p", { class: "page-lede" }, "iClimate splits cleanly into layers — a Laravel application, a separate Python ML service, and a set of external data sources it depends on."));

    const layersWrap = el("div", { class: "arch-layers" });
    D.architecture.layers.forEach((l) => {
      layersWrap.appendChild(el("div", { class: "arch-layer" }, [
        el("div", { class: "layer-name" }, l.name),
        el("div", { class: "layer-detail" }, l.detail),
      ]));
    });
    root.appendChild(layersWrap);

    const lifecycle = el("div", { class: "lifecycle-card" });
    lifecycle.appendChild(el("div", { class: "subblock-label" }, "Full request lifecycle"));
    lifecycle.appendChild(el("p", null, D.architecture.lifecycle));
    const flow = buildFlowPipeline(D.architecture.example);
    lifecycle.appendChild(flow);
    root.appendChild(lifecycle);
  }

  /* =======================================================================
     DATABASE
     ======================================================================= */
  function renderDatabase() {
    const root = document.getElementById("section-database");
    root.innerHTML = "";
    root.appendChild(el("div", { class: "eyebrow" }, "05 — Database"));
    root.appendChild(el("h1", { class: "page-title" }, "Where everything lives"));
    root.appendChild(el("p", { class: "page-lede" }, "Every table, its Eloquent model, and what it's for — plus how they connect across modules."));

    const tableWrap = el("div", { class: "data-table-wrap" });
    const table = el("table", { class: "data-table" });
    table.innerHTML = `
      <thead><tr><th>Table</th><th>Model</th><th>Purpose</th></tr></thead>
      <tbody>${D.database.tables.map(t => `
        <tr>
          <td><code>${t.name}</code></td>
          <td><code>${t.model}</code></td>
          <td>${t.purpose}</td>
        </tr>`).join("")}
      </tbody>`;
    tableWrap.appendChild(table);
    root.appendChild(tableWrap);

    const acc = makeAccordion({
      title: "Relationships & cross-module data flow",
      sub: "expand for full explanation",
      bodyBuilder: () => el("p", null, D.database.relationships),
    });
    root.appendChild(acc);
  }

  /* =======================================================================
     AUTOMATION
     ======================================================================= */
  function renderAutomation() {
    const root = document.getElementById("section-automation");
    root.innerHTML = "";
    root.appendChild(el("div", { class: "eyebrow" }, "06 — Automation"));
    root.appendChild(el("h1", { class: "page-title" }, "What runs while nobody's watching"));
    root.appendChild(el("p", { class: "page-lede" }, "Scheduled console commands keep climate data, predictions, and advisories fresh without manual work."));

    const tableWrap = el("div", { class: "data-table-wrap" });
    const table = el("table", { class: "data-table" });
    table.innerHTML = `
      <thead><tr><th>Command</th><th>Schedule</th><th>Purpose</th></tr></thead>
      <tbody>${D.automation.commands.map(c => `
        <tr>
          <td><code>${c.command}</code></td>
          <td>${c.schedule}</td>
          <td>${c.purpose}</td>
        </tr>`).join("")}
      </tbody>`;
    tableWrap.appendChild(table);
    root.appendChild(tableWrap);

    const acc = makeAccordion({
      title: "How automation works end to end",
      sub: "scheduler → command → service → API → DB",
      bodyBuilder: () => {
        const wrap = el("div");
        wrap.appendChild(el("p", null, D.automation.explanation));
        wrap.appendChild(buildFlowPipeline(["Scheduler", "Command", "Service", "API", "Database", "Output"]));
        return wrap;
      },
    });
    root.appendChild(acc);
  }

  /* =======================================================================
     NAVIGATION
     ======================================================================= */
  function initNav() {
    const navItems = document.querySelectorAll(".nav-item");
    const panels = document.querySelectorAll(".panel");

    navItems.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.section;
        navItems.forEach((b) => b.classList.toggle("active", b === btn));
        panels.forEach((p) => p.classList.toggle("active", p.dataset.sectionPanel === target));
        document.getElementById("content").scrollTo({ top: 0, behavior: "instant" });
        closeMobileSidebar();
      });
    });
  }

  function openMobileSidebar() {
    document.getElementById("sidebar").classList.add("open");
    document.getElementById("sidebarScrim").classList.add("open");
  }
  function closeMobileSidebar() {
    document.getElementById("sidebar").classList.remove("open");
    document.getElementById("sidebarScrim").classList.remove("open");
  }

  function initMobileMenu() {
    document.getElementById("menuToggle").addEventListener("click", openMobileSidebar);
    document.getElementById("sidebarScrim").addEventListener("click", closeMobileSidebar);
  }

  /* =======================================================================
     SEARCH
     ======================================================================= */
  function initSearch() {
    const input = document.getElementById("globalSearch");
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();

      // If searching, jump to Modules tab for a focused filtered view
      if (q.length > 0) {
        document.querySelector('.nav-item[data-section="modules"]').click();
      }

      const items = document.querySelectorAll("#modulesList .accordion");
      let visibleCount = 0;
      items.forEach((item) => {
        const match = q === "" || item.dataset.searchable.includes(q);
        item.style.display = match ? "" : "none";
        if (match) visibleCount++;
      });
      document.getElementById("modulesEmpty").style.display = visibleCount === 0 ? "block" : "none";
    });
  }

  /* =======================================================================
     INIT
     ======================================================================= */
  document.addEventListener("DOMContentLoaded", () => {
    renderOverview();
    renderRoles();
    renderModules();
    renderArchitecture();
    renderDatabase();
    renderAutomation();
    initNav();
    initMobileMenu();
    initSearch();
  });
})();