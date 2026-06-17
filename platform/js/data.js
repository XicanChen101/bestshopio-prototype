/* BestShopio Platform Center — mock data (V1.129 Account/Menu, V1.134 Category, V1.140 Attribution).
   Mirrors reference/bestshopio-saas-frontend structure. UI copy English-only, no emoji. */
window.DATA = (function () {
  // ---- Menu + permission tree (RBAC, from mock/platform.ts) ----
  const menuTree = [
    { id: 1, title: 'Home', route: '/home', sort: 10, type: 'menu', permissions: [
      { id: 101, title: 'Dashboard view', route: '/dashboardView' },
      { id: 102, title: 'Overview export', route: '/overviewExport' } ] },
    { id: 2, title: 'Orders', route: '/order', sort: 9, type: 'menu', permissions: [
      { id: 207, title: 'Order overview', route: '/orderOverview' },
      { id: 208, title: 'Order report', route: '/orderReport' } ], children: [
      { id: 21, title: 'Order management', route: '/order/manage', sort: 9, type: 'submenu', permissions: [
        { id: 201, title: 'Order list', route: '/orderList' },
        { id: 202, title: 'Order detail', route: '/orderDetail' },
        { id: 203, title: 'Shipping', route: '/orderShipping' },
        { id: 204, title: 'Edit shipping address', route: '/orderEditShippingAddress' } ] },
      { id: 22, title: 'After sale', route: '/order/after-sale', sort: 8, type: 'submenu', permissions: [
        { id: 205, title: 'Refund', route: '/orderRefund' },
        { id: 206, title: 'Note', route: '/orderNote' } ] } ] },
    { id: 3, title: 'Products', route: '/products', sort: 8, type: 'menu', children: [
      { id: 31, title: 'Catalog', route: '/products/catalog', sort: 8, type: 'submenu', permissions: [
        { id: 301, title: 'Product list', route: '/productList' },
        { id: 302, title: 'Add product', route: '/productAdd' },
        { id: 303, title: 'Edit product', route: '/productEdit' } ] },
      { id: 32, title: 'Inventory', route: '/products/inventory', sort: 7, type: 'submenu', permissions: [
        { id: 304, title: 'Stock list', route: '/stockList' },
        { id: 305, title: 'Adjust stock', route: '/stockAdjust' } ] } ] },
    { id: 4, title: 'Collections', route: '/collections', sort: 7, type: 'menu', children: [
      { id: 41, title: 'Collection center', route: '/collections/center', sort: 7, type: 'submenu', permissions: [
        { id: 401, title: 'Collection list', route: '/collectionsList' },
        { id: 402, title: 'Add collection', route: '/collectionsAdd' } ] },
      { id: 42, title: 'Collection tags', route: '/collections/tags', sort: 6, type: 'submenu', permissions: [
        { id: 404, title: 'Tag list', route: '/collectionTagList' } ] } ] },
    { id: 5, title: 'Discounts', route: '/discounts', sort: 6, type: 'menu' },
    { id: 6, title: 'Customers', route: '/customers', sort: 5, type: 'menu' },
    { id: 7, title: 'Analytics', route: '/analytics', sort: 5, type: 'menu', permissions: [
      { id: 711, title: 'Overview', route: '/analyticsOverview' },
      { id: 712, title: 'Reports', route: '/analyticsReports' },
      { id: 713, title: 'Live View', route: '/analyticsLive' } ] },
    { id: 8, title: 'Content', route: '/content', sort: 4, type: 'menu', permissions: [
      { id: 701, title: 'Content dashboard', route: '/contentDashboard' },
      { id: 702, title: 'Banner manage', route: '/bannerManage' } ] },
    { id: 9, title: 'Google', route: '/google', sort: 3, type: 'menu' },
  ];

  // ---- Account x store access (V1.129) ----
  const accounts = [
    { account: 'ryan@bestvoy.com', storeText: 'silixwear, lovocross, folast, minilizm', status: 'Access granted' },
    { account: 'ops.amy@bestvoy.com', storeText: 'silixwear, lovocross', status: 'Access granted' },
    { account: 'data.lee@bestvoy.com', storeText: 'All stores', status: 'Access granted' },
    { account: 'mark@bestvoy.com', storeText: '- -', status: 'No access' },
    { account: 'support.kim@bestvoy.com', storeText: 'minilizm', status: 'Access granted' },
    { account: 'intern.zoe@bestvoy.com', storeText: '- -', status: 'No access' },
  ];

  // ---- Platform category tree (V1.134) ----
  const categories = [
    { id: 1, name: 'Apparel', platformId: 'cat_apparel', level: 1, children: [
      { id: 11, name: 'Leggings', platformId: 'cat_leggings', level: 2 },
      { id: 12, name: 'Tops', platformId: 'cat_tops', level: 2 },
      { id: 13, name: 'Outerwear', platformId: 'cat_outerwear', level: 2 } ] },
    { id: 2, name: 'Beauty', platformId: 'cat_beauty', level: 1, children: [
      { id: 21, name: 'Skincare', platformId: 'cat_skincare', level: 2 },
      { id: 22, name: 'Makeup', platformId: 'cat_makeup', level: 2 } ] },
    { id: 3, name: 'Home & Living', platformId: 'cat_home', level: 1, children: [
      { id: 31, name: 'Kitchen', platformId: 'cat_kitchen', level: 2 },
      { id: 32, name: 'Decor', platformId: 'cat_decor', level: 2 } ] },
    { id: 4, name: 'Electronics', platformId: 'cat_electronics', level: 1 },
    { id: 5, name: 'Accessories', platformId: 'cat_accessories', level: 1 },
  ];

  // ---- Attribution rules (V1.140) — consumed by the data warehouse ----
  // Domain dictionary = dim_referrer_domain. match: exact_host | registered_domain | prefix_wildcard
  const domains = [
    // exclude — own + payment gateway + OAuth return
    { domain: 'silixwear.com', match: 'registered_domain', type: 'exclude', platform: '', note: 'Own store domain', updatedAt: 'Jun 12' },
    { domain: 'lovocross.com', match: 'registered_domain', type: 'exclude', platform: '', note: 'Own store domain', updatedAt: 'Jun 12' },
    { domain: 'paypal.com', match: 'registered_domain', type: 'exclude', platform: '', note: 'Payment redirect', updatedAt: 'Jun 12' },
    { domain: 'checkout.stripe.com', match: 'exact_host', type: 'exclude', platform: '', note: 'Hosted checkout', updatedAt: 'Jun 12' },
    { domain: 'accounts.google.com', match: 'exact_host', type: 'exclude', platform: '', note: 'OAuth return', updatedAt: 'Jun 12' },
    // social
    { domain: 'facebook.com', match: 'registered_domain', type: 'social', platform: 'facebook', note: 'Covers m./l./lm. subdomains', updatedAt: 'Jun 13' },
    { domain: 'instagram.com', match: 'registered_domain', type: 'social', platform: 'instagram', note: '', updatedAt: 'Jun 13' },
    { domain: 't.co', match: 'registered_domain', type: 'social', platform: 'x', note: 'X short-link', updatedAt: 'Jun 13' },
    { domain: 'tiktok.com', match: 'registered_domain', type: 'social', platform: 'tiktok', note: '', updatedAt: 'Jun 11' },
    { domain: 'youtube.com', match: 'registered_domain', type: 'social', platform: 'youtube', note: '', updatedAt: 'Jun 11' },
    { domain: 'pinterest.*', match: 'prefix_wildcard', type: 'social', platform: 'pinterest', note: 'Country TLDs', updatedAt: 'Jun 11' },
    // search
    { domain: 'google.*', match: 'prefix_wildcard', type: 'search', platform: '', note: 'All country TLDs', updatedAt: 'Jun 10' },
    { domain: 'bing.com', match: 'registered_domain', type: 'search', platform: '', note: '', updatedAt: 'Jun 10' },
    { domain: 'duckduckgo.com', match: 'registered_domain', type: 'search', platform: '', note: '', updatedAt: 'Jun 10' },
    // ai (split out from search — see PRD §6 AI channel)
    { domain: 'chatgpt.com', match: 'exact_host', type: 'ai', platform: '', note: 'ChatGPT', updatedAt: 'Jun 13' },
    { domain: 'gemini.google.com', match: 'exact_host', type: 'ai', platform: '', note: 'Gemini (host-level; google.* stays search)', updatedAt: 'Jun 13' },
    { domain: 'perplexity.ai', match: 'registered_domain', type: 'ai', platform: '', note: 'Perplexity', updatedAt: 'Jun 13' },
    // email
    { domain: 'mail.google.com', match: 'exact_host', type: 'email', platform: '', note: 'Webmail', updatedAt: 'Jun 10' },
    { domain: 'gmx.net', match: 'registered_domain', type: 'email', platform: '', note: 'DE market', updatedAt: 'Jun 10' },
  ];

  const channelRules = [
    { medium: 'cpc, ppc, paid, paidsocial', channel: 'Paid' },
    { medium: 'email, newsletter', channel: 'Email' },
    { medium: 'social', channel: 'Social' },
    { medium: '(referrer in search dict)', channel: 'Search' },
    { medium: '(referrer in ai dict)', channel: 'AI' },
    { medium: '(other external referrer)', channel: 'Referral' },
    { medium: '(no referrer, no utm)', channel: 'Direct' },
  ];
  const clickIds = ['gclid', 'fbclid', 'ttclid', 'msclkid'];
  const channelPriority = ['Paid', 'Email', 'Social', 'Search', 'AI', 'Referral', 'Direct'];

  const model = { current: 'last_non_direct', clickWindow: 30, viewWindow: 1 };
  const session = { timeout: 30, maxLength: 24 };

  // Version history — published rule sets, effective-dated (data warehouse reads latest)
  const versions = [
    { v: 12, date: 'Jun 13, 2026', by: 'ops.amy', kind: 'correction', summary: 'Added chatgpt.com (search), facebook.com platform fix', recompute: 'Hot window auto-recomputed' },
    { v: 11, date: 'Jun 12, 2026', by: 'ryan', kind: 'correction', summary: 'Added PayPal / Stripe / Google OAuth exclude domains', recompute: 'Hot window auto-recomputed' },
    { v: 10, date: 'Jun 9, 2026', by: 'ryan', kind: 'definition', summary: 'Attribution model set to Last non-direct, click window 30d', recompute: 'Applied to new data only (effective Jun 9)' },
  ];

  return { menuTree, accounts, categories,
    attribution: { domains, channelRules, clickIds, channelPriority, model, session, versions } };
})();
