/* Checkout · Trustpilot Review (Content PRD §10) — Section + Review blocks.
   Static configuration only — not connected to the Trustpilot API. Make sure you have
   the right to display these reviews and ratings (PRD §19.2). */
(function () {
  if (!window.OS) return;
  const { esc } = OS;

  const STAR = '<svg viewBox="0 0 24 24" width="13" height="13" fill="#fff" stroke="none"><path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>';
  const GREEN = '#00B67A';

  function stars(n, style) {
    const green = style !== 'default';
    const fullColor = green ? GREEN : '#F5B301';
    let h = '';
    for (let i = 1; i <= 5; i++) {
      const on = n >= i - 0.25;
      h += '<span class="cktp-star" style="background:' + (on ? fullColor : '#DCDCE6') + '">' + STAR + '</span>';
    }
    return '<span class="cktp-stars">' + h + '</span>';
  }

  OS.register('checkout-trustpilot', {
    name: 'Trustpilot Review', icon: 'star',
    schema: [
      { info: 'Static reviews only. Make sure you have the right to display this review and rating.' },
      { key: 'rating_label', label: 'Rating label', control: 'text', default: 'Excellent' },
      { key: 'overall_rating', label: 'Overall rating', control: 'number', default: 5, min: 0, max: 5, step: 0.1 },
      { key: 'show_trustpilot', label: 'Show Trustpilot text', control: 'toggle', default: true },
      { key: 'trustpilot_text', label: 'Trustpilot logo / text', control: 'text', default: 'Trustpilot', visibleWhen: (s) => s.show_trustpilot },
      { key: 'star_style', label: 'Star style', control: 'select', default: 'green', options: [
        { value: 'green', label: 'Green stars' }, { value: 'default', label: 'Default stars' } ] },
      { key: 'layout', label: 'Layout', control: 'select', default: 'card', options: [
        { value: 'card', label: 'Card' }, { value: 'compact', label: 'Compact' } ] },
      { sub: 'Style' },
      { key: 'background_color', label: 'Background color', control: 'color', default: '#FFFFFF', allowTransparent: true },
      { key: 'border_color', label: 'Border color', control: 'color', default: '#E5E5E5', allowTransparent: true },
      { key: 'border_radius', label: 'Border radius', control: 'number', default: 8, min: 0, max: 24 },
      { sub: 'Advanced' },
      { key: 'custom_css', label: 'Custom CSS', control: 'custom_css', default: '' },
    ],
    defaults() { return {}; },
    blocks: {
      name: 'Review', kind: 'review', max: 20,
      fields: [
        { key: 'star_rating', label: 'Star rating', control: 'range', default: 5, min: 1, max: 5, step: 1 },
        { key: 'review_title', label: 'Review title', control: 'text', default: '' },
        { key: 'review_content', label: 'Review content', control: 'textarea', default: '' },
        { key: 'reviewer_name', label: 'Reviewer name', control: 'text', default: '' },
        { key: 'review_date', label: 'Review date', control: 'text', default: '', placeholder: 'e.g. May 12, 2026' },
        { key: 'verified_text', label: 'Verified text', control: 'text', default: '', placeholder: 'Verified customer' },
      ],
      defaults: () => ({ star_rating: 5 }),
    },
    defaultBlocks: () => ([
      { id: OS.uid('tp'), kind: 'review', hidden: false, settings: { star_rating: 5, review_title: 'Exactly as described', review_content: 'Ordering was effortless and the quality blew me away. Shipping was quick too — will definitely buy again.', reviewer_name: 'Hannah W.', review_date: 'May 18, 2026', verified_text: 'Verified customer' } },
      { id: OS.uid('tp'), kind: 'review', hidden: false, settings: { star_rating: 5, review_title: 'Great experience', review_content: 'Customer service answered all my questions fast and the product is fantastic value.', reviewer_name: 'Marco D.', review_date: 'May 9, 2026', verified_text: 'Verified customer' } },
    ]),

    render(s, blocks) {
      const style = s.star_style || 'green';
      const summary = '<div class="cktp-summary">' +
        (s.rating_label ? '<span class="cktp-label">' + esc(s.rating_label) + '</span>' : '') +
        stars(Number(s.overall_rating) || 5, style) +
        (s.show_trustpilot && s.trustpilot_text ? '<span class="cktp-brand"><span class="cktp-star cktp-brand-star" style="background:' + GREEN + '">' + STAR + '</span>' + esc(s.trustpilot_text) + '</span>' : '') +
      '</div>';
      const compact = s.layout === 'compact';
      const vis = (blocks || []).filter((b) => !b.hidden && b.settings.review_content);
      const cards = vis.map((b0) => {
        const b = b0.settings;
        return '<div class="cktp-card" data-block-id="' + esc(b0.id) + '" style="border-color:' + (OS.bgOrTransparent(s.border_color) || '#E5E5E5') + ';border-radius:' + (s.border_radius == null ? 8 : s.border_radius) + 'px">' +
          stars(Number(b.star_rating) || 5, style) +
          (b.review_title ? '<div class="cktp-rt">' + esc(b.review_title) + '</div>' : '') +
          '<div class="cktp-rc">' + esc(b.review_content) + '</div>' +
          '<div class="cktp-rmeta">' +
            (b.reviewer_name ? '<span class="cktp-rn">' + esc(b.reviewer_name) + '</span>' : '') +
            (b.verified_text ? '<span class="cktp-verified">✓ ' + esc(b.verified_text) + '</span>' : '') +
            (b.review_date ? '<span class="cktp-rd">' + esc(b.review_date) + '</span>' : '') +
          '</div>' +
        '</div>';
      }).join('');
      if (!vis.length && !s.rating_label && !s.overall_rating) return '<div class="cksec" style="display:none"></div>';
      return '<div class="cksec cktp' + (compact ? ' cktp-compact' : '') + '" style="background:' + (OS.bgOrTransparent(s.background_color) || '#fff') + ';border-radius:' + (s.border_radius == null ? 8 : s.border_radius) + 'px">' +
        summary +
        (cards ? '<div class="cktp-list">' + cards + '</div>' : '') +
        (s.custom_css ? '<style>' + s.custom_css + '</style>' : '') +
      '</div>';
    },
  });

  OS.css('cktp', `
  .cktp{padding:18px}
  .cktp-summary{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:14px}
  .cktp-label{font-weight:800;font-size:calc(var(--ck-base-fs) + 1px);color:var(--ck-text)}
  .cktp-stars{display:inline-flex;gap:3px}
  .cktp-star{width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;border-radius:3px}
  .cktp-brand{display:inline-flex;align-items:center;gap:5px;font-weight:700;font-size:var(--ck-small-fs);color:var(--ck-text)}
  .cktp-brand-star{width:16px;height:16px}
  .cktp-list{display:flex;flex-direction:column;gap:12px}
  .cktp-card{border:1px solid #E5E5E5;padding:14px;background:#fff}
  .cktp-card .cktp-stars{margin-bottom:8px}
  .cktp-rt{font-weight:700;font-size:var(--ck-base-fs);color:var(--ck-text);margin-bottom:4px}
  .cktp-rc{font-size:var(--ck-small-fs);line-height:1.6;color:var(--ck-text)}
  .cktp-rmeta{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:10px;font-size:var(--ck-small-fs);color:var(--ck-muted)}
  .cktp-rn{font-weight:600;color:var(--ck-text)}
  .cktp-verified{color:#00B67A;font-weight:600}
  .cktp-compact .cktp-card{padding:10px 0;border-left:0;border-right:0;border-top:0}
  .cktp-compact .cktp-list{gap:0}
  `);
})();
