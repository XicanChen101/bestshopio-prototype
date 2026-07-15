/* Checkout Theme · Post-purchase offer.
   Product, price, eligibility and one-click charge capability are read-only preview
   payloads supplied by Funnel/Offer/Payment services; Theme controls presentation. */
(function () {
  if (!window.OS) return;
  const { esc, money } = OS;

  OS.register('checkout-offer-product', {
    name: 'Offer', icon: 'cart',
    schema: [
      { info: 'Product, price, discount and payment behavior come from the Funnel offer. Theme only controls how they are displayed.' },
      { key: 'layout', label: 'Desktop layout', control: 'segmented', default: 'image_left', options: [
        { value: 'image_left', label: 'Image left' }, { value: 'image_right', label: 'Image right' } ] },
      { key: 'image_ratio', label: 'Image ratio', control: 'select', default: 'square', options: [
        { value: 'square', label: 'Square' }, { value: 'portrait', label: 'Portrait' }, { value: 'landscape', label: 'Landscape' } ] },
      { key: 'show_compare_price', label: 'Show compare-at price', control: 'toggle', default: true },
      { key: 'show_savings', label: 'Show savings', control: 'toggle', default: true },
      { key: 'show_rating', label: 'Show rating', control: 'toggle', default: true },
      { key: 'show_description', label: 'Show description', control: 'toggle', default: true },
      { key: 'show_variant', label: 'Show variant', control: 'toggle', default: true },
      { key: 'show_quantity', label: 'Show quantity', control: 'toggle', default: true },
      { key: 'quantity_label', label: 'Quantity label', control: 'text', default: 'Quantity', visibleWhen: (s) => s.show_quantity !== false },
      { key: 'show_shipping', label: 'Show shipping', control: 'toggle', default: true },
      { sub: 'Actions' },
      { key: 'accept_text', label: 'Accept button text', control: 'text', default: 'Add to my order · {amount}', info: 'Use {amount} to display the amount supplied by the offer.' },
      { key: 'decline_text', label: 'Decline link text', control: 'text', default: 'No thanks, continue' },
      { key: 'show_payment_note', label: 'Show payment reassurance', control: 'toggle', default: true },
      { key: 'payment_note', label: 'Payment reassurance', control: 'text', default: 'Uses the payment method from your completed checkout', visibleWhen: (s) => s.show_payment_note !== false },
      { sub: 'Style' },
      { key: 'card_background', label: 'Card background', control: 'color', default: '#FFFFFF' },
      { key: 'button_background', label: 'Button background', control: 'color', default: '' },
      { key: 'button_text_color', label: 'Button text', control: 'color', default: '' },
      { key: 'savings_color', label: 'Savings color', control: 'color', default: '#2E8B57' },
      { key: 'border_radius', label: 'Card radius', control: 'number', default: 0, min: 0, max: 24 },
    ],
    render(s, blocks, ctx) {
      const o = ctx.offer || {};
      const variants = Array.isArray(o.variants) ? o.variants : [];
      const selectedVariant = variants.find((v) => v.id === o.selectedVariantId) || variants[0] || {};
      const shown = Object.assign({}, o, selectedVariant);
      const cur = o.currency || 'USD';
      const acceptTemplate = String(s.accept_text || 'Add to my order · {amount}');
      const amount = money(+shown.total || +shown.price || 0) + ' ' + cur;
      const accept = acceptTemplate.replace(/\{amount\}/g, amount);
      const ratio = { portrait: '3/4', landscape: '4/3', square: '1/1' }[s.image_ratio] || '1/1';
      const compare = s.show_compare_price !== false && +shown.compareAt > +shown.price
        ? '<s class="cko-compare" data-offer-compare>' + money(shown.compareAt) + '</s>' : '';
      const savings = s.show_savings !== false && shown.savings
        ? '<span class="cko-save" data-offer-savings style="color:' + (s.savings_color || '#2E8B57') + '">(' + esc(shown.savings) + ')</span>' : '';
      const rating = s.show_rating === false ? '' : '<div class="cko-rating"><span class="stars">\u2605\u2605\u2605\u2605\u2605</span><span>' +
        esc(String(o.rating || '5.0')) + ' (' + esc(String(o.reviewCount || 0)) + ')</span></div>';
      const desc = s.show_description === false || !o.description ? '' : '<p class="cko-desc">' + esc(o.description) + '</p>';
      const variantOptions = variants.map((v) => '<option value="' + esc(v.id) + '"' +
        ' data-price="' + (+v.price || +o.price || 0) + '" data-compare="' + (+v.compareAt || 0) +
        '" data-total="' + (+v.total || +v.price || +o.total || +o.price || 0) + '" data-savings="' + esc(v.savings || '') + '"' +
        (v.id === selectedVariant.id ? ' selected' : '') + '>' + esc(v.title) + '</option>').join('');
      const variant = s.show_variant === false || !variants.length ? '' :
        '<label class="cko-choice cko-variant-choice"><span>' + esc(o.variantLabel || 'Variant') + '</span>' +
          '<select data-offer-variant>' + variantOptions + '</select></label>';
      const quantities = (o.quantityOptions || [o.quantity || 1]).map((q) =>
        '<option' + (+q === +o.quantity ? ' selected' : '') + '>' + esc(String(q)) + '</option>').join('');
      const qty = s.show_quantity === false ? '' : '<label class="cko-choice cko-qty-choice"><span>' + esc(s.quantity_label || 'Quantity') + '</span>' +
        '<select data-offer-qty>' + quantities + '</select></label>';
      const choices = variant || qty ? '<div class="cko-choices">' + variant + qty + '</div>' : '';
      const shipping = s.show_shipping === false ? '' : '<div class="cko-shipping"><span>Shipping</span><strong>' + esc(o.shippingLabel || 'Calculated by offer') + '</strong></div>';
      const paymentNote = s.show_payment_note === false ? '' : '<div class="cko-payment-note">\uD83D\uDD12 ' +
        esc(s.payment_note || 'Uses the payment method from your completed checkout') + '</div>';
      const media = '<div class="cko-media" style="aspect-ratio:' + ratio + ';background-image:url(' + esc(o.image || '') + ')"></div>';
      const info = '<div class="cko-info">' +
        '<div class="cko-titleline"><h2>' + esc(o.title || 'Preview offer product') + '</h2></div>' +
        '<div class="cko-price">' + compare + '<strong data-offer-price>' + money(+shown.price || 0) + '</strong>' + savings + '</div>' +
        rating + desc + choices + shipping +
        '<button class="cko-accept" type="button" data-offer-accept data-accept-template="' + esc(acceptTemplate) +
          '" style="background:' + (s.button_background || 'var(--ck-btn-bg)') +
          ';color:' + (s.button_text_color || 'var(--ck-btn-text)') + '">' + esc(accept) + '</button>' +
        '<button class="cko-decline" type="button" data-offer-decline>' + esc(s.decline_text || 'No thanks, continue') + '</button>' +
        paymentNote +
      '</div>';
      const reversed = s.layout === 'image_right' ? ' reverse' : '';
      return '<div class="cksec cko' + reversed + '" style="background:' + (s.card_background || '#fff') +
        ';border-radius:' + (s.border_radius == null ? 0 : s.border_radius) + 'px">' + media + info + '</div>';
    },
    hydrate(el, settings, blocks, ctx) {
      const accept = el.querySelector('[data-offer-accept]');
      const decline = el.querySelector('[data-offer-decline]');
      const variant = el.querySelector('[data-offer-variant]');
      if (variant) variant.addEventListener('change', () => {
        const option = variant.selectedOptions[0]; if (!option) return;
        const cur = (ctx.offer && ctx.offer.currency) || 'USD';
        const price = el.querySelector('[data-offer-price]');
        const compare = el.querySelector('[data-offer-compare]');
        const savings = el.querySelector('[data-offer-savings]');
        if (price) price.textContent = money(+option.dataset.price || 0);
        if (compare) compare.textContent = money(+option.dataset.compare || 0);
        if (savings) savings.textContent = option.dataset.savings ? '(' + option.dataset.savings + ')' : '';
        if (accept) {
          const amount = money(+option.dataset.total || +option.dataset.price || 0) + ' ' + cur;
          accept.textContent = String(accept.dataset.acceptTemplate || 'Add to my order · {amount}').replace(/\{amount\}/g, amount);
        }
      });
      if (accept) accept.addEventListener('click', (e) => {
        e.preventDefault();
        if (accept.disabled) return;
        accept.disabled = true; accept.textContent = 'Adding\u2026';
        setTimeout(() => OS.goCheckoutPage('thankyou'), 500);
      });
      if (decline) decline.addEventListener('click', (e) => {
        e.preventDefault();
        OS.goCheckoutPage(ctx && ctx.checkoutPage === 'upsell' ? 'downsell' : 'thankyou');
      });
    },
  });

  OS.css('ck-offer-product', `
  .cko{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.04fr);gap:34px;align-items:start;padding:0;overflow:hidden;box-sizing:border-box}
  .cko.reverse{grid-template-columns:minmax(0,1.04fr) minmax(0,1fr)}
  .cko.reverse .cko-media{order:2}.cko.reverse .cko-info{order:1}
  .cko-media{width:100%;background:#f4f4f4 center/cover no-repeat}
  .cko-info{display:flex;flex-direction:column;min-width:0;padding:2px 0}
  .cko-titleline{display:flex;align-items:center;gap:9px;flex-wrap:wrap}
  .cko-titleline h2{margin:0;font-family:var(--ck-heading-font);font-size:calc(var(--ck-heading-fs) + 3px);font-weight:var(--ck-fw-h);line-height:1.25}
  .cko-price{display:flex;align-items:baseline;gap:6px;flex-wrap:wrap;margin-top:8px}
  .cko-compare{color:var(--ck-muted);font-size:var(--ck-small-fs)}
  .cko-price strong{font-size:17px}.cko-save{font-weight:700}
  .cko-rating{display:flex;align-items:center;gap:7px;margin-top:8px;color:var(--ck-muted);font-size:var(--ck-small-fs)}
  .cko-rating .stars{color:#f5b301;letter-spacing:1px}
  .cko-desc{margin:10px 0 0;color:var(--ck-text);font-size:var(--ck-base-fs);line-height:1.45}
  .cko-choices{display:block;margin-top:12px}
  .cko-choice{display:flex;min-width:0;flex-direction:column;border:1px solid var(--ck-input-border);border-radius:var(--ck-input-radius);padding:6px 10px;box-sizing:border-box}
  .cko-variant-choice{width:100%}
  .cko-qty-choice{width:175px;margin-top:12px}
  .cko-choice span{font-size:10px;color:var(--ck-muted)}
  .cko-choice select{width:100%;border:0;outline:0;background:transparent;font:inherit;color:var(--ck-text);padding:1px 0}
  .cko-shipping{display:flex;justify-content:space-between;gap:16px;padding:14px 0;margin-top:12px;border-top:1px solid var(--ck-divider);border-bottom:1px solid var(--ck-divider)}
  .cko-shipping strong{font-weight:600}
  .cko-accept{width:100%;height:var(--ck-btn-h);margin-top:14px;border:0;border-radius:var(--ck-btn-radius);font:inherit;font-weight:700;cursor:pointer}
  .cko-accept:disabled{opacity:.72;cursor:default}
  .cko-decline{align-self:center;margin-top:11px;border:0;background:none;color:var(--ck-accent);font:inherit;font-size:var(--ck-small-fs);text-decoration:underline;cursor:pointer}
  .cko-payment-note{margin-top:12px;text-align:center;color:var(--ck-muted);font-size:10.5px;line-height:1.4}
  .ckpage.mob .cko{display:flex;flex-direction:column;gap:18px}
  .ckpage.mob .cko.reverse .cko-media,.ckpage.mob .cko.reverse .cko-info{order:initial}
  .ckpage.mob .cko-info{width:100%}
  .ckpage.mob .cko-qty-choice{width:130px}
  `);
})();
