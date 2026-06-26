/* Checkout · Header (PRD §5.1) — brand bar at the top of the checkout.
   New configuration capability; no nav / search / account (focused, trustworthy
   transaction environment). Logo falls back to store brand name (AURA). */
(function () {
  if (!window.OS) return;
  const { esc, icon } = OS;

  const LAYOUTS = [
    { value: 'logo', label: 'Logo only' },
    { value: 'logo_trust', label: 'Logo + trust text' },
    { value: 'logo_contact', label: 'Logo + contact' },
    { value: 'logo_trust_cart', label: 'Logo + trust + cart' },
  ];

  OS.register('checkout-header', {
    name: 'Header', icon: 'image',
    schema: [
      { key: 'show_header', label: 'Show header', control: 'toggle', default: true, info: 'Hides the visual header only — the checkout body is unaffected.' },
      { sub: 'Logo' },
      { key: 'logo_image', label: 'Logo image', control: 'image', default: '', info: 'JPG / PNG / WebP / SVG. Falls back to the store brand name.' },
      { key: 'logo_width', label: 'Logo width · PC', control: 'range', min: 40, max: 300, step: 1, unit: 'px', default: 120 },
      { key: 'logo_width_mobile', label: 'Logo width · Mobile', control: 'range', min: 40, max: 240, step: 1, unit: 'px', default: 100 },
      { key: 'logo_position', label: 'Logo position', control: 'select', default: 'left', options: [
        { value: 'left', label: 'Left' }, { value: 'center', label: 'Center' } ] },
      { sub: 'Layout' },
      { key: 'header_layout', label: 'Header layout', control: 'select', default: 'logo_trust', options: LAYOUTS },
      { key: 'show_cart_icon', label: 'Show cart icon', control: 'toggle', default: true },
      { key: 'trust_text', label: 'Trust text', control: 'text', default: 'Secure checkout', placeholder: 'Secure checkout' },
      { sub: 'Contact' },
      { key: 'show_contact_info', label: 'Show contact info', control: 'toggle', default: false },
      { key: 'contact_title', label: 'Contact title', control: 'text', default: 'Contact us' },
      { key: 'contact_email', label: 'Contact email', control: 'text', default: '', placeholder: 'support@store.com' },
      { key: 'contact_phone', label: 'Contact phone', control: 'text', default: '', placeholder: '+1 555 000 0000' },
      { sub: 'Colors' },
      { key: 'background_color', label: 'Background color', control: 'color', default: '', info: 'Leave empty to inherit Checkout settings → Header.' },
      { key: 'text_color', label: 'Text color', control: 'color', default: '' },
      { key: 'accent_color', label: 'Accent color', control: 'color', default: '', info: 'Cart icon, links.' },
      { key: 'show_divider', label: 'Show divider', control: 'toggle', default: true },
      { sub: 'Advanced' },
      { key: 'custom_css', label: 'Custom CSS', control: 'custom_css', default: '', info: 'Applies to this header only.' },
    ],
    render(s, blocks, ctx) {
      if (s.show_header === false) {
        return '<div class="ck-header off"><div class="ck-header-in" style="height:32px;justify-content:center;color:var(--ck-muted);font-size:12px">Header hidden — checkout body unaffected</div></div>';
      }
      const tk = ctx.tokens || {}; const L = tk.layout || {};
      const mob = ctx.mob;
      const store = (ctx.checkout && ctx.checkout.storeName) || 'AURA';
      const bg = s.background_color || 'var(--ck-h-bg)';
      const txt = s.text_color || 'var(--ck-h-text)';
      const accent = s.accent_color || 'var(--ck-h-accent)';
      const height = (mob ? (tk.header && tk.header.header_height_mobile) || 56 : (tk.header && tk.header.header_height_pc) || 64);
      const lw = (mob ? s.logo_width_mobile : s.logo_width) || 110;
      const maxw = (L.page_max_width_pc || 980);
      const layout = s.header_layout || 'logo_trust';
      const centerLogo = s.logo_position === 'center' || mob;

      const logo = s.logo_image
        ? '<img src="' + esc(s.logo_image) + '" alt="' + esc(store) + '" style="width:' + lw + 'px;max-height:' + (height - 16) + 'px;object-fit:contain">'
        : '<span class="ck-logo" style="color:' + txt + '">' + esc(store) + '</span>';

      const wantTrust = (layout === 'logo_trust' || layout === 'logo_trust_cart') && s.trust_text && !mob;
      const trust = wantTrust ? '<div class="ck-trust" style="color:' + txt + '">' + esc(s.trust_text) + '</div>' : '';

      const cartIcon = '<a class="ck-h-cart" style="color:' + accent + '">' + icon('cart') + '</a>';
      const wantContact = (layout === 'logo_contact' || s.show_contact_info) && (s.contact_email || s.contact_phone) && !mob;
      let right = '';
      if (wantContact) {
        right = '<div class="ck-h-contact" style="color:' + accent + '">' +
          (s.contact_title ? '<div style="color:' + txt + ';font-size:11px;text-transform:uppercase;letter-spacing:.08em">' + esc(s.contact_title) + '</div>' : '') +
          (s.contact_email ? '<a href="mailto:' + esc(s.contact_email) + '" style="color:' + accent + '">' + esc(s.contact_email) + '</a>' : '') +
          (s.contact_phone ? ' <a href="tel:' + esc(s.contact_phone) + '" style="color:' + accent + '">' + esc(s.contact_phone) + '</a>' : '') +
          '</div>';
      } else if (s.show_cart_icon && layout !== 'logo_contact') {
        right = cartIcon;
      } else if (mob && s.show_cart_icon) {
        right = cartIcon;
      }

      const divider = s.show_divider !== false && (tk.header ? tk.header.header_divider !== false : true);
      const inStyle = 'height:' + height + 'px;max-width:' + maxw + 'px;background:' + bg;
      let inner;
      if (centerLogo) {
        inner = '<div class="ck-header-in center" style="' + inStyle + '">' +
          '<span class="ck-h-side">' + '</span>' +
          '<span class="ck-h-mid">' + logo + '</span>' +
          '<span class="ck-h-side end">' + (mob && s.show_cart_icon ? cartIcon : '') + '</span>' +
          '</div>';
      } else {
        inner = '<div class="ck-header-in" style="' + inStyle + '">' +
          '<span class="ck-h-l">' + logo + '</span>' + trust + '<span class="ck-h-r">' + right + '</span>' +
          '</div>';
      }
      const css = s.custom_css ? '<style>' + s.custom_css + '</style>' : '';
      return '<div class="ck-header' + (divider ? ' divline' : '') + '" style="background:' + bg + ';color:' + txt + '">' + inner + css + '</div>';
    },
  });
})();
