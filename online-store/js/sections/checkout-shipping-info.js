/* Checkout · Shipping Information (PRD §5.4) — delivery address.
   Reuses current address logic (country/state linkage, validation, shipping & tax
   refresh). This section only unifies the UI and configures placeholders. */
(function () {
  if (!window.OS) return;
  const { esc } = OS;

  // Dial code auto-derived from the selected country.
  const DIAL = { 'United States': '+1', 'Canada': '+1', 'United Kingdom': '+44', 'Australia': '+61', 'Germany': '+49', 'Japan': '+81' };

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
      // Item 1: shared signed-in flag (also driven by Contact). When signed in,
      // every field is pre-filled from the mock account with a "filled" tint.
      const signedIn = !!((OS.ckState || {})['ck-account'] || {}).signedIn;
      const acct = signedIn ? (mock.account || {}) : {};
      const activeCountry = signedIn ? (acct.country || mock.country) : mock.country;
      const filled = (v) => v ? ' ck-filled' : '';
      const countries = (mock.countries || ['United States']);
      const opts = countries.map((c) => '<option' + (c === activeCountry ? ' selected' : '') + '>' + esc(c) + '</option>').join('');
      const inp = (ph, val, type) => '<input class="ck-input' + filled(val) + '" type="' + (type || 'text') + '" placeholder="' + esc(ph) + '"' + (val ? ' value="' + esc(val) + '"' : '') + '>';
      // Placeholder-style dropdown: first option acts as the grey placeholder, turns to
      // normal text once a real value is picked (inline handler keeps it framework-free).
      // When signed in, the account value is pre-selected (added to the list if missing).
      const sel = (ph, items, val) => {
        const list = (items || []).slice();
        if (val && list.indexOf(val) === -1) list.unshift(val);
        const color = val ? '' : 'var(--ck-ph)';
        return '<div class="ck-selwrap"><select class="ck-input ck-select' + filled(val) + '" style="color:' + color + '" onchange="this.style.color=this.value?\'\':\'var(--ck-ph)\'">' +
          '<option value=""' + (val ? '' : ' selected') + '>' + esc(ph) + '</option>' +
          list.map((o) => '<option' + (o === val ? ' selected' : '') + '>' + esc(o) + '</option>').join('') +
          '</select></div>';
      };
      // Phone: a compact dial-code prefix (auto from country) sits inline, left of the input.
      const dial = DIAL[activeCountry] || '+1';
      const phone = '<div class="ck-phone">' +
        '<span class="ck-phone-cc" data-ck-dial>' + esc(dial) + '</span>' +
        '<input class="ck-input ck-phone-num' + filled(acct.phone) + '" type="tel" placeholder="' + esc(s.phone_placeholder || 'Phone number') + '"' + (acct.phone ? ' value="' + esc(acct.phone) + '"' : '') + '>' +
      '</div>';
      // Shopify-style address suggestion, only when signed in and a suggestion exists.
      const didYouMean = (signedIn && acct.suggestion)
        ? '<div class="ck-didyoumean">ⓘ Did you mean <b>' + esc(acct.suggestion) + '</b>?</div>' : '';
      return '<div class="cksec ck-shipinfo">' +
        '<h3 class="ck-h">' + esc(s.heading || 'Delivery') + '</h3>' +
        '<div class="ck-field"><div class="ck-selwrap"><select class="ck-input ck-select' + filled(signedIn && activeCountry) + '" data-ck-country>' + opts + '</select></div></div>' +
        '<div class="ck-row2">' +
          '<div class="ck-field">' + inp(s.first_name_placeholder || 'First name', acct.firstName) + '</div>' +
          '<div class="ck-field">' + inp(s.last_name_placeholder || 'Last name', acct.lastName) + '</div>' +
        '</div>' +
        '<div class="ck-field">' + inp(s.address_placeholder || 'Address', acct.address) + didYouMean + '</div>' +
        '<div class="ck-field">' + inp(s.apartment_placeholder || 'Apartment', acct.apartment) + '</div>' +
        '<div class="ck-row3">' +
          '<div class="ck-field">' + sel(s.city_placeholder || 'City', mock.cities, acct.city) + '</div>' +
          '<div class="ck-field">' + sel(s.state_placeholder || 'State/province', mock.states, acct.state) + '</div>' +
          '<div class="ck-field">' + inp(s.zip_placeholder || 'ZIP code', acct.zip) + '</div>' +
        '</div>' +
        '<div class="ck-field ck-field-phone">' + phone + '</div>' +
      '</div>';
    },
    hydrate(el) {
      const country = el.querySelector('[data-ck-country]');
      const dialEl = el.querySelector('[data-ck-dial]');
      if (country && dialEl) country.addEventListener('change', () => {
        dialEl.textContent = DIAL[country.value] || '+1';
      });
    },
  });
})();
