/* Checkout · Order Summary (top bar) — Shopify-style collapsible recap shown at the very
   top of the mobile checkout, right under the header. Mobile-only: on desktop the order
   summary lives in the right-hand column (see checkout-order-summary). This is a SEPARATE
   component from the bottom Order Summary so the two can be styled independently. */
(function () {
  if (!window.OS) return;
  const { esc, money } = OS;

  OS.register('checkout-order-summary-bar', {
    name: 'Order Summary (top bar)', icon: 'cart',
    schema: [
      { info: 'Shown only on mobile, pinned under the header. Desktop uses the right-column Order Summary.' },
      { key: 'heading', label: 'Heading', control: 'text', default: 'Order summary' },
      { key: 'mobile_default', label: 'Default state', control: 'select', default: 'collapsed', options: [
        { value: 'collapsed', label: 'Collapsed' }, { value: 'expanded', label: 'Expanded' } ] },
      { sub: 'Colors' },
      { key: 'background_color', label: 'Background color', control: 'color', default: '', info: 'Leave empty to inherit Checkout settings.' },
      { key: 'text_color', label: 'Text color', control: 'color', default: '' },
      { key: 'total_color', label: 'Total color', control: 'color', default: '' },
    ],

    render(s, blocks, ctx) {
      if (!ctx.mob) return ''; // top bar is mobile-only

      const mock = ctx.checkout || {};
      const cart = mock.cart || [];
      const subtotal = cart.reduce((t, l) => t + l.price * l.qty, 0);
      const ship = (mock.shippingMethods || []).find((m) => m.id === mock.selectedShipping) || (mock.shippingMethods || [])[0] || { price: 0 };
      const shipPrice = ship.price || 0;
      const discount = (mock.coupon && mock.coupon.amount) || 0;
      const tax = mock.tax || 0;
      const total = subtotal - discount + shipPrice + tax;
      const compareTotal = cart.reduce((t, l) => t + ((l.compareAt && l.compareAt > l.price ? l.compareAt : l.price) * l.qty), 0);

      const collapsed = (s.mobile_default || 'collapsed') === 'collapsed';
      const bg = s.background_color || 'var(--ck-sum-bg)';
      const txt = s.text_color || 'var(--ck-sum-text)';
      const totalColor = s.total_color || 'var(--ck-text)';
      const head = s.heading || 'Order summary';

      const lines = cart.map((l) => {
        const cmp = l.compareAt && l.compareAt > l.price ? '<span class="ck-line-cmp">' + money(l.compareAt) + '</span>' : '';
        return '<div class="ck-line">' +
          '<div class="ck-line-img" style="background-image:url(' + esc(l.image) + ')"><span class="ck-line-qty">' + l.qty + '</span></div>' +
          '<div class="ck-line-info"><div class="ck-line-t">' + esc(l.title) + '</div><div class="ck-line-v">' + esc(l.variant || '') + '</div></div>' +
          '<div class="ck-line-pr">' + cmp + money(l.price * l.qty) + '</div>' +
        '</div>';
      }).join('');
      const trow = (lbl, val) => '<div class="ck-trow"><span class="lbl">' + esc(lbl) + '</span><span class="amt">' + val + '</span></div>';
      const totals = '<div class="ck-totals">' +
        trow('Subtotal', money(subtotal)) +
        (discount > 0 ? trow('Discount', '−' + money(discount)) : '') +
        trow('Shipping', shipPrice ? money(shipPrice) : 'Free') +
        trow('Taxes', money(tax)) +
        '<div class="ck-trow grand" style="color:' + totalColor + '"><span class="lbl">Total</span><span class="amt">' + money(total) + '</span></div>' +
      '</div>';

      const cmpTop = compareTotal > total ? '<s class="ck-sumbar-cmp">' + money(compareTotal) + '</s>' : '';
      return '<div class="ck-sumbar' + (collapsed ? ' collapsed' : '') + '" data-ck-summary style="background:' + bg + ';color:' + txt + '">' +
        '<button class="ck-sumbar-head" type="button" data-ck-sum-toggle>' +
          '<span class="ck-sumbar-title">' + esc(head) + '<span class="ck-sumbar-chev">▾</span></span>' +
          '<span class="ck-sumbar-amt">' + cmpTop +
            '<span class="ck-sumbar-total" style="color:' + totalColor + '">' + money(total) + '</span>' +
          '</span>' +
        '</button>' +
        '<div class="ck-sumbar-body"><div class="ck-lines">' + lines + '</div>' + totals + '</div>' +
      '</div>';
    },

    hydrate(el) {
      const wrap = el.querySelector('[data-ck-summary]');
      if (wrap) el.querySelectorAll('[data-ck-sum-toggle]').forEach((t) => {
        t.addEventListener('click', (e) => { e.stopPropagation(); wrap.classList.toggle('collapsed'); });
      });
    },
  });

  OS.css('ck-sumbar', `
  .ck-sumbar{width:100%;border-bottom:1px solid var(--ck-divider);box-sizing:border-box}
  .ck-sumbar-head{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;
    background:none;border:0;cursor:pointer;font-family:inherit;text-align:left;
    padding:14px var(--ck-mob-pad,18px)}
  .ck-sumbar-title{display:inline-flex;align-items:center;gap:8px;font-size:var(--ck-base-fs);font-weight:500;color:var(--ck-sum-text)}
  .ck-sumbar-chev{display:inline-block;font-size:12px;transition:transform .15s}
  .ck-sumbar:not(.collapsed) .ck-sumbar-chev{transform:rotate(180deg)}
  .ck-sumbar-amt{display:flex;flex-direction:column;align-items:flex-end;line-height:1.25}
  .ck-sumbar-cmp{font-size:12px;color:var(--ck-sum-muted);text-decoration:line-through}
  .ck-sumbar-total{font-size:17px;font-weight:700}
  .ck-sumbar-body{padding:0 var(--ck-mob-pad,18px) 16px}
  .ck-sumbar.collapsed .ck-sumbar-body{display:none}
  `);
})();
