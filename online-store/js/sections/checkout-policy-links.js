/* Checkout · Policy Links (PRD §5.11) — store policy links in the checkout.
   New configuration capability. Each link targets a page chosen from the Online
   Store Pages. Links with no page selected are hidden; if all are empty the whole
   region is hidden. Clicking opens the page (pop-up in production). */
(function () {
  if (!window.OS) return;
  const { esc } = OS;

  OS.register('checkout-policy-links', {
    name: 'Policy Links', icon: 'layers',
    schema: [
      { key: 'refund_policy_page', label: 'Refund policy page', control: 'page', default: '' },
      { key: 'privacy_policy_page', label: 'Privacy policy page', control: 'page', default: '' },
      { key: 'terms_of_service_page', label: 'Terms of service page', control: 'page', default: '' },
      { key: 'shipping_policy_page', label: 'Shipping policy page', control: 'page', default: '' },
      { key: 'contact_page', label: 'Contact page', control: 'page', default: '' },
      { sub: 'Style' },
      { key: 'link_color', label: 'Link color', control: 'color', default: '', info: 'Leave empty to inherit the Accent color.' },
      { key: 'text_size', label: 'Text size', control: 'select', default: 'small', options: [
        { value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' } ] },
    ],
    render(s, blocks, ctx) {
      const pages = (ctx.sample && ctx.sample.pages) || [];
      const has = (id) => id && pages.some((p) => p.id === id);
      const links = [
        { id: s.refund_policy_page, label: 'Refund policy' },
        { id: s.privacy_policy_page, label: 'Privacy policy' },
        { id: s.terms_of_service_page, label: 'Terms of service' },
        { id: s.shipping_policy_page, label: 'Shipping policy' },
        { id: s.contact_page, label: 'Contact us' },
      ].filter((l) => has(l.id));
      if (!links.length) {
        return '<div class="cksec ck-policy-empty">No policy pages selected — this region is hidden on the live checkout.</div>';
      }
      const color = s.link_color || 'var(--ck-accent)';
      const cls = 'ck-policy' + (s.text_size === 'medium' ? ' med' : '');
      return '<div class="cksec"><div class="' + cls + '">' +
        links.map((l) => '<a style="color:' + color + '">' + esc(l.label) + '</a>').join('') +
      '</div></div>';
    },
  });
})();
