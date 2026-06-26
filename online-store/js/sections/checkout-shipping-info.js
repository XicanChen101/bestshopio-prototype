/* Checkout · Shipping Information (PRD §5.4) — delivery address.
   Reuses current address logic (country/state linkage, validation, shipping & tax
   refresh). This section only unifies the UI and configures placeholders. */
(function () {
  if (!window.OS) return;
  const { esc } = OS;

  OS.register('checkout-shipping-info', {
    name: 'Shipping Information', icon: 'layers',
    schema: [
      { key: 'heading', label: 'Heading', control: 'text', default: 'Delivery', placeholder: 'Delivery' },
      { key: 'first_name_placeholder', label: 'First name placeholder', control: 'text', default: 'First name' },
      { key: 'last_name_placeholder', label: 'Last name placeholder', control: 'text', default: 'Last name' },
      { key: 'address_placeholder', label: 'Address placeholder', control: 'text', default: 'Address' },
      { key: 'apartment_placeholder', label: 'Apartment placeholder', control: 'text', default: 'Apt, suite, unit, etc (optional)' },
      { key: 'state_placeholder', label: 'State placeholder', control: 'text', default: 'State/province' },
      { key: 'city_placeholder', label: 'City placeholder', control: 'text', default: 'City' },
      { key: 'zip_placeholder', label: 'ZIP placeholder', control: 'text', default: 'ZIP code' },
      { key: 'phone_placeholder', label: 'Phone placeholder', control: 'text', default: 'Phone number' },
    ],
    render(s, blocks, ctx) {
      const mock = ctx.checkout || {};
      const countries = (mock.countries || ['United States']);
      const opts = countries.map((c) => '<option' + (c === mock.country ? ' selected' : '') + '>' + esc(c) + '</option>').join('');
      const inp = (ph, type) => '<input class="ck-input" type="' + (type || 'text') + '" placeholder="' + esc(ph) + '">';
      return '<div class="cksec ck-shipinfo">' +
        '<h3 class="ck-h">' + esc(s.heading || 'Delivery') + '</h3>' +
        '<div class="ck-field"><div class="ck-selwrap"><select class="ck-input ck-select">' + opts + '</select></div></div>' +
        '<div class="ck-row2">' +
          '<div class="ck-field">' + inp(s.first_name_placeholder || 'First name') + '</div>' +
          '<div class="ck-field">' + inp(s.last_name_placeholder || 'Last name') + '</div>' +
        '</div>' +
        '<div class="ck-field">' + inp(s.address_placeholder || 'Address') + '</div>' +
        '<div class="ck-field">' + inp(s.apartment_placeholder || 'Apartment') + '</div>' +
        '<div class="ck-row3">' +
          '<div class="ck-field">' + inp(s.city_placeholder || 'City') + '</div>' +
          '<div class="ck-field">' + inp(s.state_placeholder || 'State/province') + '</div>' +
          '<div class="ck-field">' + inp(s.zip_placeholder || 'ZIP code') + '</div>' +
        '</div>' +
        '<div class="ck-field">' + inp(s.phone_placeholder || 'Phone number', 'tel') + '</div>' +
      '</div>';
    },
  });
})();
