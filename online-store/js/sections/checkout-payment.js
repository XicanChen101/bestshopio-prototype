/* Checkout · Payment method (PRD §5.6) — credit / debit card.
   Reuses the current payment gateway; card fields are hosted by the gateway and
   never collected by the theme. This section restyles + configures copy only. */
(function () {
  if (!window.OS) return;
  const { esc, ckFloat } = OS;

  const CARD_ICON = '<svg class="ck-pay-card" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>';
  const BRANDS =
    '<span class="ckbrand visa">VISA</span>' +
    '<span class="ckbrand mc">MC</span>' +
    '<span class="ckbrand amex">AMEX</span>' +
    '<span class="ckbrand disc">DISC<span>VER</span></span>';

  OS.register('checkout-payment', {
    name: 'Payment method', icon: 'lock',
    schema: [
      { key: 'heading', label: 'Heading', control: 'text', default: 'Payment', placeholder: 'Payment' },
      { key: 'description', label: 'Description', control: 'textarea', default: '', placeholder: 'All transactions are secure and encrypted' },
    ],
    render(s) {
      const card =
        '<div class="ck-pay-opt sel">' +
          '<div class="ck-pay-head"><span class="dot"></span>' + CARD_ICON + '<span class="nm">Card</span></div>' +
          '<div class="ck-pay-body">' +
            '<div class="ck-cardnum">' + ckFloat('<input class="ck-input" placeholder="Card number">', 'Card number') + '<span class="ck-cardbrands">' + BRANDS + '</span></div>' +
            '<div class="ck-row2">' +
              ckFloat('<input class="ck-input" placeholder="MM / YY">', 'MM / YY') +
              ckFloat('<input class="ck-input" placeholder="CVC">', 'CVC') +
            '</div>' +
          '</div>' +
        '</div>';
      return '<div class="cksec ck-payment">' +
        '<h3 class="ck-h">' + esc(s.heading || 'Payment') + '</h3>' +
        (s.description ? '<div class="ck-pay-note">' + esc(s.description) + '</div>' : '') +
        '<div class="ck-pay-list">' + card + '</div>' +
      '</div>';
    },
  });
})();
