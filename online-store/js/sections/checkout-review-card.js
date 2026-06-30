/* Checkout · Review card (Content PRD §11) — Section + Card blocks.
   Endorsement cards (expert / doctor / media). Make sure endorsements and claims comply
   with applicable laws (PRD §19.2). */
(function () {
  if (!window.OS) return;
  const { esc } = OS;
  const IMG = (OS.sample && OS.sample.IMG) || {};

  OS.register('checkout-review-card', {
    name: 'Review card', icon: 'layers',
    schema: [
      { info: 'Make sure endorsements and claims comply with applicable laws.' },
      { key: 'layout', label: 'Layout', control: 'select', default: 'carousel', options: [
        { value: 'carousel', label: 'Carousel' }, { value: 'grid', label: 'Grid' } ] },
      { key: 'per_row_desktop', label: 'Cards per row (desktop)', control: 'number', default: 1, min: 1, max: 3, visibleWhen: (s) => s.layout === 'grid' },
      { key: 'per_row_mobile', label: 'Cards per row (mobile)', control: 'number', default: 1, min: 1, max: 2, visibleWhen: (s) => s.layout === 'grid' },
      { sub: 'Style' },
      { key: 'background_color', label: 'Background color', control: 'color', default: 'transparent', allowTransparent: true },
      { key: 'card_background', label: 'Card background', control: 'color', default: '#FFFFFF', allowTransparent: true },
      { key: 'border_color', label: 'Border color', control: 'color', default: '#E5E5E5', allowTransparent: true },
      { key: 'border_radius', label: 'Border radius', control: 'number', default: 8, min: 0, max: 24 },
      { sub: 'Advanced' },
      { key: 'custom_css', label: 'Custom CSS', control: 'custom_css', default: '' },
    ],
    defaults() { return {}; },
    blocks: {
      name: 'Card', kind: 'card', max: 12,
      fields: [
        { key: 'image', label: 'Image', control: 'image', default: '' },
        { key: 'badge_image', label: 'Badge image', control: 'image', default: '' },
        { key: 'title', label: 'Title', control: 'text', default: 'Specialist Approved' },
        { key: 'content', label: 'Content', control: 'textarea', default: '' },
        { key: 'author_name', label: 'Author name', control: 'text', default: '' },
        { key: 'author_subtitle', label: 'Author subtitle', control: 'text', default: '' },
        { key: 'image_position', label: 'Image position', control: 'select', default: 'left', options: [
          { value: 'left', label: 'Left' }, { value: 'top', label: 'Top' }, { value: 'right', label: 'Right' } ] },
      ],
      defaults: () => ({ title: 'Specialist Approved', image_position: 'left' }),
    },
    defaultBlocks: () => ([
      { id: OS.uid('rc'), kind: 'card', hidden: false, settings: { image: IMG.av2 || '', badge_image: '', title: 'Dermatologist Recommended', content: '“In my practice I look for formulas that are gentle yet effective — this is one I happily recommend to my own patients.”', author_name: 'Dr. Elena Ross', author_subtitle: 'Board-certified Dermatologist', image_position: 'left' } },
    ]),

    render(s, blocks) {
      const vis = (blocks || []).filter((b) => !b.hidden && (b.settings.title || b.settings.content || b.settings.image));
      if (!vis.length) return '<div class="cksec" style="display:none"></div>';
      const cardBg = OS.bgOrTransparent(s.card_background) || '#fff';
      const border = OS.bgOrTransparent(s.border_color) || '#E5E5E5';
      const radius = (s.border_radius == null ? 8 : s.border_radius);
      const cards = vis.map((b0) => {
        const b = b0.settings; const pos = b.image_position || 'left';
        const img = b.image ? '<div class="ckrc-img" style="background-image:url(' + esc(b.image) + ')">' +
          (b.badge_image ? '<img class="ckrc-badge" src="' + esc(b.badge_image) + '" alt="">' : '') + '</div>' : '';
        const meta = '<div class="ckrc-meta">' +
          (b.badge_image && !b.image ? '<img class="ckrc-badge inline" src="' + esc(b.badge_image) + '" alt="">' : '') +
          (b.title ? '<div class="ckrc-title">' + esc(b.title) + '</div>' : '') +
          (b.content ? '<div class="ckrc-content">' + esc(b.content) + '</div>' : '') +
          ((b.author_name || b.author_subtitle) ? '<div class="ckrc-author">' +
            (b.author_name ? '<span class="ckrc-an">' + esc(b.author_name) + '</span>' : '') +
            (b.author_subtitle ? '<span class="ckrc-as">' + esc(b.author_subtitle) + '</span>' : '') + '</div>' : '') +
        '</div>';
        return '<div class="ckrc-card ckrc-' + pos + '" data-block-id="' + esc(b0.id) + '" style="background:' + cardBg + ';border:1px solid ' + border + ';border-radius:' + radius + 'px">' + img + meta + '</div>';
      }).join('');
      const carousel = s.layout !== 'grid';
      const cols = carousel ? 1 : OS.clamp(Number(s.per_row_desktop) || 1, 1, 3, 1);
      const colsM = OS.clamp(Number(s.per_row_mobile) || 1, 1, 2, 1);
      const wrapClass = carousel ? 'ckrc-carousel' : 'ckrc-grid';
      const wrapStyle = carousel ? '' : 'grid-template-columns:repeat(' + cols + ',minmax(0,1fr));--ckrc-cols-mob:' + colsM;
      return '<div class="cksec ckrc" style="background:' + (OS.bgOrTransparent(s.background_color) || 'transparent') + '">' +
        '<div class="' + wrapClass + '" style="' + wrapStyle + '">' + cards + '</div>' +
        (s.custom_css ? '<style>' + s.custom_css + '</style>' : '') +
      '</div>';
    },
  });

  OS.css('ckrc', `
  .ckrc-grid{display:grid;gap:14px}
  .ckrc-carousel{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;padding-bottom:2px}
  .ckrc-carousel .ckrc-card{flex:0 0 100%;scroll-snap-align:start}
  .ckrc-card{padding:18px;display:flex;gap:16px;align-items:center}
  .ckrc-card.ckrc-top{flex-direction:column;align-items:flex-start}
  .ckrc-card.ckrc-right{flex-direction:row-reverse}
  .ckrc-img{flex:none;width:96px;height:96px;border-radius:10px;background-size:cover;background-position:center;position:relative}
  .ckrc-top .ckrc-img{width:100%;height:160px}
  .ckrc-badge{position:absolute;right:-8px;bottom:-8px;width:40px;height:40px;border-radius:50%;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.2);object-fit:contain;padding:3px}
  .ckrc-badge.inline{position:static;width:48px;height:48px;margin-bottom:8px;box-shadow:none}
  .ckrc-meta{min-width:0}
  .ckrc-title{font-weight:700;font-size:var(--ck-base-fs);color:var(--ck-text);margin-bottom:6px}
  .ckrc-content{font-size:var(--ck-small-fs);line-height:1.6;color:var(--ck-text)}
  .ckrc-author{margin-top:10px;display:flex;flex-direction:column;gap:1px}
  .ckrc-an{font-weight:700;font-size:var(--ck-small-fs);color:var(--ck-text)}
  .ckrc-as{font-size:var(--ck-small-fs);color:var(--ck-muted)}
  .ckpage.mob .ckrc-grid{grid-template-columns:repeat(var(--ckrc-cols-mob,1),minmax(0,1fr))!important}
  `);
})();
