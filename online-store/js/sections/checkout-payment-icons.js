/* Checkout · Payment Icons (Content PRD §8) — Section + Payment Icon blocks.
   Built-in brand chips or custom uploaded images. Static trust signal only. */
(function () {
  if (!window.OS) return;
  const { esc } = OS;

  // Built-in payment badges rendered as brand-styled chips (prototype stand-in for real SVGs).
  const PAY = {
    visa: { label: 'VISA', bg: '#1A1F71', fg: '#fff', style: 'font-style:italic;font-weight:800;letter-spacing:.04em' },
    mastercard: { label: 'mastercard', bg: '#fff', fg: '#222', dots: true },
    amex: { label: 'AMEX', bg: '#2E77BC', fg: '#fff', style: 'font-weight:800' },
    discover: { label: 'DISCOVER', bg: '#fff', fg: '#222', accent: '#F76B1C' },
    paypal: { label: 'PayPal', bg: '#fff', fg: '#003087', style: 'font-style:italic;font-weight:800' },
    applepay: { label: 'Pay', bg: '#000', fg: '#fff', apple: true },
    googlepay: { label: 'Pay', bg: '#fff', fg: '#5F6368', google: true },
    shoppay: { label: 'shop', bg: '#5A31F4', fg: '#fff', style: 'font-weight:800' },
  };
  const BRANDS = [
    { value: 'visa', label: 'Visa' }, { value: 'mastercard', label: 'Mastercard' }, { value: 'amex', label: 'American Express' },
    { value: 'discover', label: 'Discover' }, { value: 'paypal', label: 'PayPal' }, { value: 'applepay', label: 'Apple Pay' },
    { value: 'googlepay', label: 'Google Pay' }, { value: 'shoppay', label: 'Shop Pay' },
  ];

  function chip(brand, size) {
    const p = PAY[brand] || PAY.visa;
    const h = Math.round(size * 0.64);
    let inner;
    if (p.apple) inner = '<span style="font-weight:600"></span><span style="font-weight:600;margin-left:1px">Pay</span>';
    else if (p.google) inner = '<span style="color:#4285F4;font-weight:700">G</span><span style="color:#5F6368;font-weight:600;margin-left:2px">Pay</span>';
    else if (p.dots) inner = '<span style="display:inline-flex;align-items:center"><i style="width:' + h + 'px;height:' + h + 'px;border-radius:50%;background:#EB001B;display:inline-block"></i><i style="width:' + h + 'px;height:' + h + 'px;border-radius:50%;background:#F79E1B;display:inline-block;margin-left:-' + Math.round(h / 2.4) + 'px;mix-blend-mode:multiply"></i></span>';
    else inner = '<span style="' + (p.style || 'font-weight:800') + (p.accent ? ';color:' + p.fg : '') + '">' + esc(p.label) + (p.accent ? '<span style="color:' + p.accent + '">·</span>' : '') + '</span>';
    return '<span class="ckpi-chip" style="width:' + size + 'px;height:' + Math.round(size * 0.66) + 'px;background:' + p.bg + ';color:' + p.fg + ';font-size:' + Math.max(8, Math.round(size * 0.26)) + 'px">' + inner + '</span>';
  }

  OS.register('checkout-payment-icons', {
    name: 'Payment Icons', icon: 'layers',
    schema: [
      { key: 'heading', label: 'Heading', control: 'text', default: '', placeholder: 'Optional title' },
      { key: 'layout', label: 'Layout', control: 'select', default: 'inline', options: [
        { value: 'inline', label: 'Inline' }, { value: 'grid', label: 'Grid' } ] },
      { key: 'per_row_desktop', label: 'Icons per row (desktop)', control: 'number', default: 5, min: 1, max: 8, visibleWhen: (s) => s.layout === 'grid' },
      { key: 'per_row_mobile', label: 'Icons per row (mobile)', control: 'number', default: 5, min: 1, max: 5, visibleWhen: (s) => s.layout === 'grid' },
      { key: 'icon_size', label: 'Icon size', control: 'number', default: 42, min: 20, max: 100 },
      { key: 'icon_gap', label: 'Icon gap', control: 'number', default: 12, min: 4, max: 32 },
      { key: 'alignment', label: 'Alignment', control: 'segmented', default: 'center', options: [
        { value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' } ] },
      { key: 'background_color', label: 'Background color', control: 'color', default: 'transparent', allowTransparent: true },
      { sub: 'Advanced' },
      { key: 'custom_css', label: 'Custom CSS', control: 'custom_css', default: '' },
    ],
    defaults() { return {}; },
    blocks: {
      name: 'Payment icon', kind: 'payicon', max: 16,
      fields: [
        { key: 'icon_source', label: 'Icon source', control: 'select', default: 'builtin', options: [
          { value: 'builtin', label: 'Built-in icon' }, { value: 'image', label: 'Custom image' } ] },
        { key: 'built_in', label: 'Built-in payment icon', control: 'select', default: 'visa', options: BRANDS, visibleWhen: (s) => s.icon_source !== 'image' },
        { key: 'custom_image', label: 'Custom image', control: 'image', default: '', visibleWhen: (s) => s.icon_source === 'image' },
        { key: 'alt_text', label: 'Alt text', control: 'text', default: '' },
      ],
      defaults: () => ({ icon_source: 'builtin', built_in: 'visa' }),
    },
    defaultBlocks: () => ['visa', 'mastercard', 'amex', 'paypal', 'applepay'].map((b) => (
      { id: OS.uid('pi'), kind: 'payicon', hidden: false, settings: { icon_source: 'builtin', built_in: b, alt_text: '' } }
    )),

    render(s, blocks) {
      const size = OS.clamp(Number(s.icon_size) || 42, 20, 100, 42);
      const gap = OS.clamp(Number(s.icon_gap) || 12, 4, 32, 12);
      const align = s.alignment || 'center';
      const justify = align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center';
      const vis = (blocks || []).filter((b) => !b.hidden && (b.settings.icon_source !== 'image' || b.settings.custom_image));
      const cells = vis.map((b0) => {
        const b = b0.settings;
        const node = (b.icon_source === 'image' && b.custom_image)
          ? '<img class="ckpi-img" src="' + esc(b.custom_image) + '" alt="' + esc(b.alt_text || '') + '" style="height:' + Math.round(size * 0.66) + 'px;max-width:' + size + 'px">'
          : chip(b.built_in || 'visa', size);
        return '<span class="ckpi-cell" data-block-id="' + esc(b0.id) + '" title="' + esc(b.alt_text || b.built_in || '') + '">' + node + '</span>';
      }).join('');
      const grid = s.layout === 'grid';
      const wrapStyle = grid
        ? 'display:grid;grid-template-columns:repeat(' + (OS.clamp(Number(s.per_row_desktop) || 5, 1, 8, 5)) + ',auto);gap:' + gap + 'px;justify-content:' + justify + ';--ckpi-cols-mob:' + (OS.clamp(Number(s.per_row_mobile) || 5, 1, 5, 5))
        : 'display:flex;flex-wrap:wrap;gap:' + gap + 'px;justify-content:' + justify;
      return '<div class="cksec ckpi" style="background:' + (OS.bgOrTransparent(s.background_color) || 'transparent') + '">' +
        (s.heading ? '<div class="cksec-h" style="text-align:' + align + '">' + esc(s.heading) + '</div>' : '') +
        '<div class="ckpi-wrap" style="' + wrapStyle + '">' + (cells || '<span style="color:var(--ck-muted);font-size:var(--ck-small-fs)">Add a payment icon.</span>') + '</div>' +
        (s.custom_css ? '<style>' + s.custom_css + '</style>' : '') +
      '</div>';
    },
  });

  OS.css('ckcontent-common', `
  .cksec-h{font-family:var(--ck-heading-font);font-size:var(--ck-heading-fs);font-weight:var(--ck-fw-h);color:var(--ck-text);margin:0 0 14px}
  .cksec-sub{font-size:var(--ck-small-fs);color:var(--ck-muted);margin:-8px 0 14px}
  `);
  OS.css('ckpi', `
  .ckpi-cell{display:inline-flex;align-items:center;justify-content:center}
  .ckpi-chip{display:inline-flex;align-items:center;justify-content:center;border-radius:5px;box-shadow:0 0 0 1px rgba(0,0,0,.08);overflow:hidden}
  .ckpi-img{object-fit:contain;display:block;border-radius:5px}
  .ckpage.mob .ckpi-wrap[style*="grid"]{grid-template-columns:repeat(var(--ckpi-cols-mob,5),auto)!important}
  `);
})();
