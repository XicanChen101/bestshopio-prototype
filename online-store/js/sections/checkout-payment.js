/* Checkout · Payment method (PRD §5.6) — credit card / PayPal.
   Reuses the current payment gateway; card fields are hosted by the gateway and
   never collected by the theme. This section restyles + configures copy only. */
(function () {
  if (!window.OS) return;
  const { esc } = OS;

  OS.register('checkout-payment', {
    name: 'Payment method', icon: 'lock',
    schema: [
      { key: 'heading', label: 'Heading', control: 'text', default: 'Payment', placeholder: 'Payment' },
      { key: 'description', label: 'Description', control: 'textarea', default: 'All transactions are secure and encrypted' },
    ],
    render(s) {
      const card =
        '<div class="ck-pay-opt sel" data-ck-pay="card">' +
          '<div class="ck-pay-head"><span class="dot"></span><span class="nm">Credit card</span>' +
            '<span class="ck-cardbrands"><span>VISA</span><span>MC</span><span>AMEX</span></span></div>' +
          '<div class="ck-pay-body">' +
            '<input class="ck-input" placeholder="Card number">' +
            '<div class="ck-row2"><input class="ck-input" placeholder="MM / YY"><input class="ck-input" placeholder="CVC"></div>' +
            '<input class="ck-input" placeholder="Name on card">' +
          '</div>' +
        '</div>';
      const paypal =
        '<div class="ck-pay-opt" data-ck-pay="paypal">' +
          '<div class="ck-pay-head"><span class="dot"></span><span class="nm">PayPal</span>' +
            '<span class="ck-cardbrands"><span style="color:#003087">PayPal</span></span></div>' +
        '</div>';
      const billing =
        '<label class="ck-check" style="margin-top:14px"><input type="checkbox" checked> Billing address same as shipping</label>';
      return '<div class="cksec ck-payment">' +
        '<h3 class="ck-h">' + esc(s.heading || 'Payment') + '</h3>' +
        (s.description ? '<div class="ck-pay-note">' + esc(s.description) + '</div>' : '') +
        '<div class="ck-pay-list" data-ck-pay-list>' + card + paypal + '</div>' + billing +
      '</div>';
    },
    hydrate(el) {
      const list = el.querySelector('[data-ck-pay-list]'); if (!list) return;
      list.querySelectorAll('[data-ck-pay]').forEach((opt) => {
        opt.querySelector('.ck-pay-head').addEventListener('click', () => {
          list.querySelectorAll('[data-ck-pay]').forEach((o) => o.classList.remove('sel'));
          opt.classList.add('sel');
        });
      });
    },
  });
})();
