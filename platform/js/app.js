/* Platform Center — shell + router + simple views (Menu / Account / Category).
   Twin of the store admin: same chrome (.shell-root / .app-header / .app-body /
   .app-sidebar / .nav-item / #root), same theme.css component classes.
   Attribution lives in attribution.js. */
(function () {
  var D = window.DATA;

  // ---------- icons ----------
  function navico(p) { return '<svg class="nav-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>'; }
  function ico(p, sz) { sz = sz || 16; return '<svg viewBox="0 0 24 24" width="' + sz + '" height="' + sz + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + p + '</svg>'; }
  var P = {
    menu: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    account: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    category: '<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>',
    attribution: '<line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
    edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4Z"/>',
    trash: '<path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    right: '<path d="m9 18 6-6-6-6"/>', down: '<path d="m6 9 6 6 6-6"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    out: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
    history: '<path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-6.36 2.64L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3 2"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
  };

  // ---------- nav ----------
  var NAV = [
    { id: 'menu', label: 'Menu', icon: P.menu },
    { id: 'account', label: 'Account', icon: P.account },
    { id: 'category', label: 'Category', icon: P.category },
    { id: 'attribution', label: 'Attribution', icon: P.attribution },
  ];

  // ---------- shared helpers (exposed for attribution.js) ----------
  // Top-center success toast — mirrors the store admin (Ant Design message), not a bottom bar.
  function toast(msg) {
    var t = document.createElement('div');
    t.className = 'pc-toast';
    t.innerHTML = '<span class="pc-toast-ico">' + ico(P.check, 15) + '</span><span>' + msg + '</span>';
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add('pc-toast-out'); }, 2200);
    setTimeout(function () { t.remove(); }, 2560);
  }
  function modal(html, onMount) {
    var b = document.createElement('div'); b.className = 'modal-backdrop';
    b.innerHTML = '<div class="modal"><button class="modal-x" data-mx aria-label="Close">' + ico(P.close, 18) + '</button>' + html + '</div>';
    b.addEventListener('mousedown', function (e) { if (e.target === b) b.remove(); });
    b.querySelectorAll('[data-mx]').forEach(function (mx) { mx.onclick = function () { b.remove(); }; });
    document.body.appendChild(b); if (onMount) onMount(b); return b;
  }
  function drawer(html, onMount) {
    var b = document.createElement('div'); b.className = 'drawer-backdrop';
    b.innerHTML = '<div class="drawer">' + html + '</div>';
    b.addEventListener('mousedown', function (e) { if (e.target === b) b.remove(); });
    document.body.appendChild(b);
    b.querySelectorAll('[data-x]').forEach(function (x) { x.onclick = function () { b.remove(); }; });
    if (onMount) onMount(b); return b;
  }
  window.PC = { ico: ico, toast: toast, modal: modal, drawer: drawer, P: P };

  // ---------- views ----------
  var root;
  var menuOpen = { 2: true, 3: true };
  var catOpen = { 1: true, 2: true, 3: true };

  function pillType() {} // (attribution-only)

  function viewMenu() {
    var rows = [];
    function push(m, lvl) {
      var kids = (m.children && m.children.length) || (m.permissions && m.permissions.length);
      var open = menuOpen[m.id];
      rows.push('<tr><td><span class="tree" style="padding-left:' + (lvl - 1) * 20 + 'px">' +
        (kids ? '<button class="tree-tg" data-exp="' + m.id + '">' + ico(open ? P.down : P.right, 16) + '</button>' : '<span class="tree-sp"></span>') +
        (lvl === 1 ? '<span class="tree-ico">' + ico(P.menu, 16) + '</span>' : '') +
        '<span>' + m.title + '</span></span></td>' +
        '<td class="muted" style="font-family:ui-monospace,Menlo,Consolas,monospace">' + m.route + '</td>' +
        '<td><span class="pill pill-gray">' + m.type + '</span></td>' +
        '<td class="num">' + m.sort + '</td>' +
        '<td><span class="row-acts"><button class="row-ic" title="Add permission">' + ico(P.plus, 16) + '</button>' +
        '<button class="row-ic" title="Edit">' + ico(P.edit, 16) + '</button>' +
        '<button class="row-ic danger" title="Delete">' + ico(P.trash, 16) + '</button></span></td></tr>');
      if (open) {
        (m.children || []).forEach(function (c) { push(c, lvl + 1); });
        (m.permissions || []).forEach(function (p) {
          rows.push('<tr><td><span class="tree" style="padding-left:' + (lvl * 20 + 8) + 'px">' +
            '<span class="tree-sp"></span><span class="perm-tag">permission</span><span>' + p.title + '</span></span></td>' +
            '<td class="muted" style="font-family:ui-monospace,Menlo,Consolas,monospace">' + p.route + '</td><td></td><td></td>' +
            '<td><span class="row-acts"><button class="row-ic" title="Edit">' + ico(P.edit, 16) + '</button>' +
            '<button class="row-ic danger" title="Delete">' + ico(P.trash, 16) + '</button></span></td></tr>');
        });
      }
    }
    D.menuTree.forEach(function (m) { push(m, 1); });
    root.innerHTML =
      '<div class="view-wrap"><div class="pc-head"><div>' +
        '<div class="page-title">Menu</div>' +
        '<div class="pc-sub">Platform back-office menus and permission points — the RBAC catalog assigned to roles.</div></div>' +
        '<button class="btn btn-primary">' + ico(P.plus, 16) + 'Add menu</button></div>' +
      '<div class="panel" style="overflow:hidden"><table class="tbl">' +
        '<thead><tr><th>Menu title</th><th>Route</th><th>Type</th><th class="num">Sort</th><th style="width:120px">Actions</th></tr></thead>' +
        '<tbody>' + rows.join('') + '</tbody></table></div></div>';
    root.querySelectorAll('[data-exp]').forEach(function (b) { b.onclick = function () { var id = +b.getAttribute('data-exp'); menuOpen[id] = !menuOpen[id]; viewMenu(); }; });
    root.querySelectorAll('.row-ic').forEach(function (b) { b.onclick = function () { toast('Demo — action stubbed'); }; });
  }

  function viewAccount() {
    var rows = D.accounts.map(function (a) {
      var pill = a.status === 'Access granted' ? 'pill-green' : 'pill-gray';
      return '<tr><td>' + a.account + '</td><td class="muted">' + a.storeText + '</td>' +
        '<td><span class="pill ' + pill + '"><span class="dot"></span>' + a.status + '</span></td></tr>';
    }).join('');
    root.innerHTML =
      '<div class="view-wrap"><div class="pc-head"><div>' +
        '<div class="page-title">Account</div>' +
        '<div class="pc-sub">Platform staff accounts and which stores each can access.</div></div></div>' +
      '<div class="pc-filters">' +
        '<select class="filter-select"><option>Account</option><option>Store</option></select>' +
        '<span class="pc-search">' + ico(P.search, 16) + '<input class="filter-input" placeholder="Search account or store"></span>' +
        '<select class="filter-select"><option>All status</option><option>Access granted</option><option>No access</option></select></div>' +
      '<div class="panel" style="overflow:hidden"><table class="tbl">' +
        '<thead><tr><th style="width:24%">Account</th><th style="width:46%">Store</th><th>Status</th></tr></thead>' +
        '<tbody>' + rows + '</tbody></table></div></div>';
  }

  function viewCategory() {
    var rows = [];
    function push(c, lvl) {
      var kids = c.children && c.children.length;
      var open = catOpen[c.id];
      rows.push('<tr><td><span class="tree" style="padding-left:' + (lvl - 1) * 16 + 'px">' +
        (kids ? '<button class="tree-tg" data-cat="' + c.id + '">' + ico(open ? P.down : P.right, 16) + '</button>' : '<span class="tree-sp"></span>') +
        '<span>' + c.name + '</span></span></td>' +
        '<td class="muted" style="font-family:ui-monospace,Menlo,Consolas,monospace">' + c.platformId + '</td>' +
        '<td><span class="row-acts"><button class="row-ic" title="Edit">' + ico(P.edit, 16) + '</button>' +
        '<button class="row-ic danger" title="Delete">' + ico(P.trash, 16) + '</button></span></td></tr>');
      if (open && kids) c.children.forEach(function (k) { push(k, lvl + 1); });
    }
    D.categories.forEach(function (c) { push(c, 1); });
    root.innerHTML =
      '<div class="view-wrap"><div class="pc-head"><div>' +
        '<div class="page-title">Category</div>' +
        '<div class="pc-sub">Platform-wide product category standard. Pushed to all stores.</div></div>' +
        '<button class="btn btn-primary">' + ico(P.plus, 16) + 'Add category</button></div>' +
      '<div class="pc-filters"><span class="pc-search">' + ico(P.search, 16) + '<input class="filter-input" placeholder="Search category"></span></div>' +
      '<div class="panel" style="overflow:hidden"><table class="tbl">' +
        '<thead><tr><th style="width:60%">Category name</th><th>Platform ID</th><th style="width:100px">Actions</th></tr></thead>' +
        '<tbody>' + rows.join('') + '</tbody></table></div></div>';
    root.querySelectorAll('[data-cat]').forEach(function (b) { b.onclick = function () { var id = +b.getAttribute('data-cat'); catOpen[id] = !catOpen[id]; viewCategory(); }; });
    root.querySelectorAll('.row-ic').forEach(function (b) { b.onclick = function () { toast('Demo — action stubbed'); }; });
  }

  // ---------- sidebar + header chrome (mirrors store admin shell.js) ----------
  var navEl;
  function renderSidebar(active) {
    navEl.innerHTML = '<div class="nav-group-label">Platform</div>' + NAV.map(function (n) {
      return '<a class="nav-item' + (n.id === active ? ' active' : '') + '" href="#/' + n.id + '">' + navico(n.icon) + '<span>' + n.label + '</span></a>';
    }).join('');
  }
  function userMenuHtml() {
    return '<div class="hdr-menu-head">' + ico(P.user, 16) + '<span>ryan@bestvoy.com</span></div>' +
      '<div class="hdr-menu-divider"></div>' +
      '<button class="hdr-menu-item">' + ico(P.lock, 16) + 'Change password</button>' +
      '<a class="hdr-menu-item" href="signin.html">' + ico(P.out, 16) + 'Sign out</a>';
  }

  function dispatch() {
    var id = (location.hash || '').replace(/^#\/?/, '').split('/')[0] || 'menu';
    renderSidebar(id);
    if (id === 'account') viewAccount();
    else if (id === 'category') viewCategory();
    else if (id === 'attribution') window.__viewAttribution(root);
    else viewMenu();
    root.scrollTop = 0;
  }

  function build() {
    var app = document.getElementById('app');
    app.classList.add('shell-root');
    app.innerHTML =
      '<header class="app-header">' +
        '<button class="sidebar-toggle" aria-label="Menu">' + ico(P.menu, 20) + '</button>' +
        '<a class="hdr-logo" href="#/menu"><span class="brand-mark">B</span>' +
        '<span class="hdr-logo-name">Platform Center</span></a>' +
        '<div class="hdr-right"><div class="hdr-menu-wrap">' +
          '<button class="hdr-user" id="hdr-user" aria-label="Account">' + ico(P.user, 18) + '</button></div></div>' +
      '</header>' +
      '<div class="app-body">' +
        '<aside class="app-sidebar scroll-thin"><nav class="nav-scroll scroll-thin"></nav></aside>' +
        '<div class="content-col flex-1 flex flex-col min-w-0">' +
          '<main id="view" class="shell-view flex-1 overflow-auto scroll-thin"><div id="root"></div></main></div>' +
      '</div>';
    navEl = app.querySelector('.nav-scroll');
    root = document.getElementById('root');

    // user dropdown (reuse store-admin .hdr-menu pattern)
    var ub = app.querySelector('#hdr-user');
    ub.onclick = function (e) {
      e.stopPropagation();
      var wrap = ub.parentNode, exist = wrap.querySelector('.hdr-menu');
      document.querySelectorAll('.hdr-menu').forEach(function (m) { m.remove(); });
      if (exist) return;
      var pop = document.createElement('div'); pop.className = 'hdr-menu'; pop.innerHTML = userMenuHtml();
      wrap.appendChild(pop);
      setTimeout(function () { document.addEventListener('mousedown', function h(ev) { if (!ev.target.closest('.hdr-menu-wrap')) { pop.remove(); document.removeEventListener('mousedown', h); } }); }, 0);
    };
    // mobile drawer
    var bd = document.createElement('div'); bd.className = 'sidebar-backdrop'; document.body.appendChild(bd);
    var aside = app.querySelector('.app-sidebar'), tg = app.querySelector('.sidebar-toggle');
    tg.onclick = function () { aside.classList.toggle('open'); bd.classList.toggle('show'); };
    bd.onclick = function () { aside.classList.remove('open'); bd.classList.remove('show'); };
    app.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('a[href^="#/"]')) { aside.classList.remove('open'); bd.classList.remove('show'); } });

    if (!location.hash) location.replace('#/menu');
    window.addEventListener('hashchange', dispatch);
    dispatch();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
