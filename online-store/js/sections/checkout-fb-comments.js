/* Checkout · Facebook-style Comments (Content PRD §13) — Section + Comment blocks.
   Social-proof comment thread. Make sure these comments are accurate and do not mislead
   customers (PRD §19.2). */
(function () {
  if (!window.OS) return;
  const { esc } = OS;
  const IMG = (OS.sample && OS.sample.IMG) || {};
  const LIKE = '<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M2 10h4v11H2zM22 10.5a2 2 0 0 0-2-2h-5.6l.9-4.2c.1-.6-.1-1.2-.5-1.6L14 2 8.5 8.2c-.3.4-.5.9-.5 1.4V19a2 2 0 0 0 2 2h7.4a2 2 0 0 0 1.9-1.4l1.7-7.6c0-.2.1-.3.1-.5z"/></svg>';

  OS.register('checkout-fb-comments', {
    name: 'Facebook-style Comments', icon: 'layers',
    schema: [
      { info: 'Make sure these comments are accurate and do not mislead customers.' },
      { key: 'heading', label: 'Heading', control: 'text', default: '' },
      { key: 'layout', label: 'Layout', control: 'select', default: 'stack', options: [
        { value: 'stack', label: 'Stack' }, { value: 'compact', label: 'Compact' } ] },
      { sub: 'Style' },
      { key: 'background_color', label: 'Background color', control: 'color', default: 'transparent', allowTransparent: true },
      { key: 'comment_background', label: 'Comment background', control: 'color', default: '#F5F6F7', allowTransparent: true },
      { key: 'text_color', label: 'Text color', control: 'color', default: '', allowTransparent: true, info: 'Empty inherits Checkout settings.' },
      { key: 'avatar_size', label: 'Avatar size', control: 'number', default: 32, min: 24, max: 64 },
      { sub: 'Advanced' },
      { key: 'custom_css', label: 'Custom CSS', control: 'custom_css', default: '' },
    ],
    defaults() { return {}; },
    blocks: {
      name: 'Comment', kind: 'comment', max: 30,
      fields: [
        { key: 'avatar', label: 'Avatar', control: 'image', default: '' },
        { key: 'name', label: 'Name', control: 'text', default: '' },
        { key: 'comment_text', label: 'Comment text', control: 'textarea', default: '' },
        { key: 'like_text', label: 'Like text', control: 'text', default: 'Like' },
        { key: 'reply_text', label: 'Reply text', control: 'text', default: 'Reply' },
        { key: 'likes_count', label: 'Likes count', control: 'number', default: 0, min: 0, max: 999999 },
        { key: 'replies_count', label: 'Replies count', control: 'number', default: 0, min: 0, max: 999999 },
        { key: 'brand_reply_text', label: 'Brand reply (optional)', control: 'textarea', default: '' },
      ],
      defaults: () => ({ like_text: 'Like', reply_text: 'Reply', likes_count: 0, replies_count: 0 }),
    },
    defaultBlocks: () => ([
      { id: OS.uid('fc'), kind: 'comment', hidden: false, settings: { avatar: IMG.av1 || '', name: 'Jessica Allen', comment_text: 'Just got mine and I’m obsessed 😍 the quality is so much better than I expected!', like_text: 'Like', reply_text: 'Reply', likes_count: 42, replies_count: 3, brand_reply_text: 'Thank you so much Jessica! 💚 Enjoy!' } },
      { id: OS.uid('fc'), kind: 'comment', hidden: false, settings: { avatar: IMG.av3 || '', name: 'Daniel Pierce', comment_text: 'Ordered for my wife and she loves it. Fast shipping too.', like_text: 'Like', reply_text: 'Reply', likes_count: 17, replies_count: 1, brand_reply_text: '' } },
    ]),

    render(s, blocks) {
      const vis = (blocks || []).filter((b) => !b.hidden && b.settings.comment_text);
      if (!vis.length) return '<div class="cksec" style="display:none"></div>';
      const av = OS.clamp(Number(s.avatar_size) || 32, 24, 64, 32);
      const bubbleBg = OS.bgOrTransparent(s.comment_background) || '#F5F6F7';
      const txt = s.text_color || 'var(--ck-text)';
      const compact = s.layout === 'compact';
      const item = (b0) => {
        const b = b0.settings;
        const avatar = b.avatar
          ? '<div class="ckfc-av" style="width:' + av + 'px;height:' + av + 'px;background-image:url(' + esc(b.avatar) + ')"></div>'
          : '<div class="ckfc-av ckfc-av-ph" style="width:' + av + 'px;height:' + av + 'px">' + esc((b.name || '?').slice(0, 1).toUpperCase()) + '</div>';
        const counts = '<span class="ckfc-counts">' + LIKE + ' ' + (Number(b.likes_count) || 0) +
          ((Number(b.replies_count) || 0) > 0 ? ' · ' + (Number(b.replies_count)) + ' ' + ((Number(b.replies_count) === 1) ? 'reply' : 'replies') : '') + '</span>';
        const actions = '<div class="ckfc-actions"><span class="ckfc-act">' + esc(b.like_text || 'Like') + '</span><span class="ckfc-act">' + esc(b.reply_text || 'Reply') + '</span>' + counts + '</div>';
        const brand = b.brand_reply_text
          ? '<div class="ckfc-reply"><div class="ckfc-bubble ckfc-brand" style="background:' + bubbleBg + '"><div class="ckfc-name">Store <span class="ckfc-badge">✔</span></div><div class="ckfc-text">' + esc(b.brand_reply_text) + '</div></div></div>'
          : '';
        return '<div class="ckfc-item" data-block-id="' + esc(b0.id) + '">' + avatar +
          '<div class="ckfc-body"><div class="ckfc-bubble" style="background:' + bubbleBg + '">' +
            (b.name ? '<div class="ckfc-name">' + esc(b.name) + '</div>' : '') +
            '<div class="ckfc-text">' + esc(b.comment_text) + '</div></div>' + actions + brand + '</div></div>';
      };
      return '<div class="cksec ckfc' + (compact ? ' ckfc-compact' : '') + '" style="background:' + (OS.bgOrTransparent(s.background_color) || 'transparent') + ';color:' + txt + '">' +
        (s.heading ? '<div class="cksec-h">' + esc(s.heading) + '</div>' : '') +
        '<div class="ckfc-list">' + vis.map(item).join('') + '</div>' +
        (s.custom_css ? '<style>' + s.custom_css + '</style>' : '') +
      '</div>';
    },
  });

  OS.css('ckfc', `
  .ckfc-list{display:flex;flex-direction:column;gap:16px}
  .ckfc-compact .ckfc-list{gap:10px}
  .ckfc-item{display:flex;gap:10px;align-items:flex-start}
  .ckfc-av{flex:none;border-radius:50%;background-size:cover;background-position:center;background-color:#dfe3e8}
  .ckfc-av-ph{display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;background:#9aa4b2}
  .ckfc-body{min-width:0;flex:1}
  .ckfc-bubble{border-radius:16px;padding:8px 12px;display:inline-block;max-width:100%}
  .ckfc-name{font-weight:700;font-size:var(--ck-small-fs);color:var(--ck-text)}
  .ckfc-badge{color:#1877F2}
  .ckfc-text{font-size:var(--ck-small-fs);line-height:1.5;color:var(--ck-text);word-break:break-word}
  .ckfc-actions{display:flex;align-items:center;gap:14px;margin:4px 0 0 12px;font-size:11px;color:var(--ck-muted)}
  .ckfc-act{font-weight:700;cursor:pointer}
  .ckfc-counts{display:inline-flex;align-items:center;gap:3px;margin-left:auto;color:var(--ck-muted)}
  .ckfc-reply{margin-top:8px;padding-left:24px}
  .ckfc-brand{display:block}
  `);
})();
