/* Checkout · Order Summary (PRD §5.10) — the order confirmation surface.
   Reuses the order calculation service; amounts here are mock and illustrative.
   Children (Cart Lines / Coupon / Subtotal / Discount / Shipping / Tax / Total)
   are locked blocks — selectable & configurable but not addable / removable. */
(function () {
  if (!window.OS) return;
  const { esc, money } = OS;

  const blk = (id, html, sel) => '<div class="ck-blk' + (sel ? ' os-block-sel' : '') + '" data-block-id="' + esc(id) + '">' + html + '</div>';

  OS.register('checkout-order-summary', {
    name: 'Order Summary', icon: 'cart',
    schema: [
      { key: 'heading', label: 'Heading', control: 'text', default: 'Order summary' },
      { key: 'show_heading_pc', label: 'Show heading · PC', control: 'toggle', default: false },
      { key: 'show_heading_mobile', label: 'Show heading · Mobile', control: 'toggle', default: true },
      { key: 'mobile_default', label: 'Mobile default state', control: 'select', default: 'collapsed', options: [
        { value: 'collapsed', label: 'Collapsed' }, { value: 'expanded', label: 'Expanded' } ] },
      { sub: 'Colors' },
      { key: 'background_color', label: 'Background color', control: 'color', default: '', info: 'Leave empty to inherit Checkout settings.' },
      { key: 'text_color', label: 'Text color', control: 'color', default: '' },
      { key: 'total_color', label: 'Total color', control: 'color', default: '' },
    ],
    blocks: { kinds: {
      'cart-lines': { name: 'Cart Lines', fields: [] },
      'coupon': { name: 'Coupon', fields: [
        { key: 'show_coupon', label: 'Show coupon', control: 'toggle', default: true },
        { key: 'placeholder', label: 'Placeholder', control: 'text', default: 'Discount code' },
      ] },
      'subtotal': { name: 'Subtotal', fields: [ { key: 'row_label', label: 'Label', control: 'text', default: 'Subtotal' } ] },
      'discount': { name: 'Discount', fields: [ { key: 'row_label', label: 'Label', control: 'text', default: 'Discount' } ] },
      'shipping': { name: 'Shipping', fields: [ { key: 'row_label', label: 'Label', control: 'text', default: 'Shipping' } ] },
      'tax': { name: 'Tax', fields: [ { key: 'row_label', label: 'Label', control: 'text', default: 'Tax' } ] },
      'total': { name: 'Total', fields: [ { key: 'row_label', label: 'Label', control: 'text', default: 'Total' } ] },
    } },

    render(s, blocks, ctx) {
      const mock = ctx.checkout || {};
      const cart = mock.cart || [];
      const find = (k) => (blocks || []).find((b) => b.kind === k) || { id: '', settings: {} };
      const sel = ctx.selectedBlockId;

      const subtotal = cart.reduce((t, l) => t + l.price * l.qty, 0);
      const ship = (mock.shippingMethods || []).find((m) => m.id === mock.selectedShipping) || (mock.shippingMethods || [])[0] || { price: 0 };
      const shipPrice = ship.price || 0;
      const discount = (mock.coupon && mock.coupon.amount) || 0;
      const tax = mock.tax || 0;
      const total = subtotal - discount + shipPrice + tax;

      const bg = s.background_color || 'var(--ck-sum-bg)';
      const txt = s.text_color || 'var(--ck-sum-text)';
      const totalColor = s.total_color || txt;

      // ---- cart lines block ----
      const lb = find('cart-lines');
      const lines = cart.map((l) => {
        const cmp = l.compareAt && l.compareAt > l.price ? '<span class="ck-line-cmp">' + money(l.compareAt) + '</span>' : '';
        return '<div class="ck-line">' +
          '<div class="ck-line-img" style="background-image:url(' + esc(l.image) + ')"><span class="ck-line-qty">' + l.qty + '</span></div>' +
          '<div class="ck-line-info"><div class="ck-line-t">' + esc(l.title) + '</div><div class="ck-line-v">' + esc(l.variant || '') + '</div></div>' +
          '<div class="ck-line-pr">' + cmp + money(l.price * l.qty) + '</div>' +
        '</div>';
      }).join('');
      const linesBlk = blk(lb.id, '<div class="ck-lines">' + lines + '</div>', sel === lb.id);

      // ---- coupon block ----
      const cb = find('coupon'); const cs = cb.settings || {};
      const couponBlk = cs.show_coupon === false ? '' : blk(cb.id,
        '<div class="ck-coupon"><input class="ck-input" placeholder="' + esc(cs.placeholder || 'Discount code') + '"><button class="ck-coupon-btn" type="button" data-ck-apply>Apply</button></div>', sel === cb.id);

      // ---- totals ----
      const row = (b, val, extraCls) => {
        const bs = (b.settings || {});
        return blk(b.id, '<div class="ck-trow' + (extraCls || '') + '"><span class="lbl">' + esc(bs.row_label || b.kind) + '</span><span class="amt">' + val + '</span></div>', sel === b.id);
      };
      const sub = find('subtotal'), dis = find('discount'), shp = find('shipping'), tx = find('tax'), tot = find('total');
      const totals = '<div class="ck-totals">' +
        row(sub, money(subtotal)) +
        (discount > 0 ? row(dis, '−' + money(discount)) : '') +
        row(shp, shipPrice ? money(shipPrice) : 'Free') +
        row(tx, money(tax)) +
        blk(tot.id, '<div class="ck-trow grand" style="color:' + totalColor + '"><span class="lbl">' + esc((tot.settings || {}).row_label || 'Total') + '</span><span class="amt">' + money(total) + '</span></div>', sel === tot.id) +
      '</div>';

      // ---- mobile collapsed bar ----
      if (ctx.mob) {
        const collapsed = (s.mobile_default || 'collapsed') === 'collapsed';
        const head = s.show_heading_mobile === false ? 'Order summary' : (s.heading || 'Order summary');
        return '<div class="ck-summary mob' + (collapsed ? ' collapsed' : '') + '" data-ck-summary style="background:' + bg + ';color:' + txt + '">' +
          '<div class="ck-summary-bar" data-ck-sum-toggle><span class="lft">' + esc(head) + ' <span class="ck-chev">▾</span></span><span class="tot" style="color:' + totalColor + '">' + money(total) + '</span></div>' +
          '<div class="ck-summary-body">' + linesBlk + couponBlk + totals + '</div>' +
        '</div>';
      }

      const heading = s.show_heading_pc ? '<h3 class="ck-sum-h">' + esc(s.heading || 'Order summary') + '</h3>' : '';
      return '<div class="ck-summary" style="background:' + bg + ';color:' + txt + '">' + heading + linesBlk + couponBlk + totals + '</div>';
    },

    hydrate(el) {
      const toggle = el.querySelector('[data-ck-sum-toggle]');
      const wrap = el.querySelector('[data-ck-summary]');
      if (toggle && wrap) toggle.addEventListener('click', (e) => { e.stopPropagation(); wrap.classList.toggle('collapsed'); });
      const apply = el.querySelector('[data-ck-apply]');
      if (apply) apply.addEventListener('click', () => { apply.textContent = 'Applying…'; setTimeout(() => { apply.textContent = 'Apply'; }, 1000); });
    },
  });
})();
