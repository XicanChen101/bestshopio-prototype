/* Checkout · Shipping Method (PRD §5.5) — available delivery options.
   Reuses the current logistics calc; this section restyles + configures copy.
   In preview the address is treated as complete so the option list shows. */
(function () {
  if (!window.OS) return;
  const { esc, money } = OS;

  OS.register('checkout-shipping-method', {
    name: 'Shipping Method', icon: 'layers',
    schema: [
      { key: 'heading', label: 'Heading', control: 'text', default: 'Shipping method', placeholder: 'Shipping method' },
      { key: 'empty_state_text', label: 'Empty state text', control: 'textarea', default: 'Enter your shipping address to view available shipping methods.' },
      { key: 'selected_border_color', label: 'Selected border color', control: 'color', default: '', info: 'Leave empty to inherit the Accent color.' },
    ],
    render(s, blocks, ctx) {
      const mock = ctx.checkout || {};
      const methods = mock.shippingMethods || [];
      const selBorder = s.selected_border_color || 'var(--ck-accent)';
      if (!methods.length) {
        return '<div class="cksec ck-shipmethod"><h3 class="ck-h">' + esc(s.heading || 'Shipping method') + '</h3>' +
          '<div class="ck-empty">' + esc(s.empty_state_text || '') + '</div></div>';
      }
      const rows = methods.map((m, i) => {
        const sel = (m.id === mock.selectedShipping) || (i === 0 && !mock.selectedShipping);
        return '<label class="ck-radio' + (sel ? ' sel' : '') + '" data-ck-ship="' + esc(m.id) + '" style="' + (sel ? '--ck-sel-border:' + selBorder : '') + '">' +
          '<span class="dot"></span>' +
          '<span class="nm">' + esc(m.name) + '<span class="eta">' + esc(m.eta || '') + '</span></span>' +
          '<span class="pr">' + (m.price ? money(m.price) : 'Free') + '</span>' +
        '</label>';
      }).join('');
      return '<div class="cksec ck-shipmethod">' +
        '<h3 class="ck-h">' + esc(s.heading || 'Shipping method') + '</h3>' +
        '<div class="ck-radio-list" data-ck-ship-list>' + rows + '</div>' +
      '</div>';
    },
    hydrate(el) {
      const list = el.querySelector('[data-ck-ship-list]'); if (!list) return;
      list.querySelectorAll('[data-ck-ship]').forEach((row) => row.addEventListener('click', (e) => {
        e.preventDefault();
        list.querySelectorAll('[data-ck-ship]').forEach((r) => r.classList.remove('sel'));
        row.classList.add('sel');
      }));
    },
  });
})();
