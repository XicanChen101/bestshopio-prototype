/* Checkout Theme · Post-purchase offers.
   Products, ranking, price, eligibility and one-click charge capability are read-only preview
   payloads supplied by Funnel/Offer/Payment services; Theme controls presentation. */
(function () {
  if (!window.OS) return;
  const { esc, money } = OS;

  const getProducts = (offer) => {
    const products = Array.isArray(offer && offer.products) ? offer.products : [offer || {}];
    return products.filter(Boolean).slice(0, 4);
  };

  OS.register('checkout-offer-product', {
    name: 'Offer', icon: 'cart',
    schema: [
      { info: 'Offer rules supply 1–4 ranked products. Theme controls presentation only; product count is not configured here.' },
      { key: 'multiple_layout', label: 'Multiple products layout', control: 'segmented', default: 'stacked', options: [
        { value: 'stacked', label: 'List' }, { value: 'grid', label: '2-column grid' } ],
        info: 'Used when the Offer returns 2–4 products. A single product keeps the focused image-and-details layout.' },
      { key: 'layout', label: 'Image position · list', control: 'segmented', default: 'image_left', options: [
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
      const cur = o.currency || 'USD';
      const acceptTemplate = String(s.accept_text || 'Add to my order · {amount}');
      const ratio = { portrait: '3/4', landscape: '4/3', square: '1/1' }[s.image_ratio] || '1/1';
      const paymentNote = s.show_payment_note === false ? '' : '<div class="cko-payment-note">\uD83D\uDD12 ' +
        esc(s.payment_note || 'Uses the payment method from your completed checkout') + '</div>';
      const decline = '<button class="cko-decline" type="button" data-offer-decline>' +
        esc(s.decline_text || 'No thanks, continue') + '</button>';
      const products = getProducts(o);
      const multi = products.length > 1;
      const cardHtml = products.map((product, index) => {
        const variants = Array.isArray(product.variants) ? product.variants : [];
        const selectedVariant = variants.find((v) => v.id === product.selectedVariantId) ||
          variants.find((v) => v.available !== false) || variants[0] || {};
        const shown = Object.assign({}, product, selectedVariant);
        const amount = money(+shown.total || +shown.price || 0) + ' ' + cur;
        const accept = acceptTemplate.replace(/\{amount\}/g, amount);
        const compare = s.show_compare_price !== false && +shown.compareAt > +shown.price
          ? '<s class="cko-compare" data-offer-compare>' + money(shown.compareAt) + '</s>' : '';
        const savings = s.show_savings !== false && shown.savings
          ? '<span class="cko-save" data-offer-savings style="color:' + (s.savings_color || '#2E8B57') + '">(' + esc(shown.savings) + ')</span>' : '';
        const rating = s.show_rating === false || product.rating == null ? '' :
          '<div class="cko-rating"><span class="stars">\u2605\u2605\u2605\u2605\u2605</span><span>' +
          esc(String(product.rating)) + ' (' + esc(String(product.reviewCount || 0)) + ')</span></div>';
        const desc = s.show_description === false || !product.description ? '' :
          '<p class="cko-desc">' + esc(product.description) + '</p>';
        const variantOptions = variants.map((v) => '<option value="' + esc(v.id) + '"' +
          ' data-price="' + (+v.price || +product.price || 0) + '" data-compare="' + (+v.compareAt || 0) +
          '" data-total="' + (+v.total || +v.price || +product.total || +product.price || 0) +
          '" data-savings="' + esc(v.savings || '') + '"' +
          (v.available === false ? ' disabled' : '') +
          (v.id === selectedVariant.id ? ' selected' : '') + '>' + esc(v.title) + '</option>').join('');
        const variant = s.show_variant === false || !variants.length ? '' :
          '<label class="cko-choice cko-variant-choice"><span>' + esc(product.variantLabel || 'Variant') + '</span>' +
            '<select data-offer-variant>' + variantOptions + '</select></label>';
        const quantities = (product.quantityOptions || [product.quantity || 1]).map((q) =>
          '<option' + (+q === +product.quantity ? ' selected' : '') + '>' + esc(String(q)) + '</option>').join('');
        const qty = s.show_quantity === false ? '' :
          '<label class="cko-choice cko-qty-choice"><span>' + esc(s.quantity_label || 'Quantity') + '</span>' +
            '<select data-offer-qty>' + quantities + '</select></label>';
        const choices = variant || qty ? '<div class="cko-choices">' + variant + qty + '</div>' : '';
        const shipping = s.show_shipping === false ? '' :
          '<div class="cko-shipping"><span>Shipping</span><strong>' +
            esc(product.shippingLabel || 'Calculated by offer') + '</strong></div>';
        const media = '<div class="cko-media" role="img" aria-label="' + esc(product.title || 'Offer product') +
          '" style="aspect-ratio:' + ratio + ';background-image:url(' + esc(product.image || '') + ')"></div>';
        const singleFlowActions = multi ? '' : decline + paymentNote;
        const info = '<div class="cko-info">' +
          '<div class="cko-titleline"><h2>' + esc(product.title || 'Preview offer product') + '</h2></div>' +
          '<div class="cko-price">' + compare + '<strong data-offer-price>' + money(+shown.price || 0) + '</strong>' + savings + '</div>' +
          rating + desc + choices + shipping +
          '<button class="cko-accept" type="button" data-offer-accept data-accept-template="' + esc(acceptTemplate) +
            '" data-offer-id="' + esc(product.id || String(index + 1)) +
            '" style="background:' + (s.button_background || 'var(--ck-btn-bg)') +
            ';color:' + (s.button_text_color || 'var(--ck-btn-text)') + '">' + esc(accept) + '</button>' +
          singleFlowActions +
        '</div>';
        const reversed = s.layout === 'image_right' ? ' reverse' : '';
        return '<article class="cko-card' + reversed + '" data-offer-card style="background:' +
          (s.card_background || '#fff') + ';border-radius:' + (s.border_radius == null ? 0 : s.border_radius) +
          'px">' + media + info + '</article>';
      }).join('');
      const layout = multi && s.multiple_layout === 'grid' ? ' grid' : ' stacked';
      const sharedFlowActions = multi ? '<div class="cko-flow-actions">' + decline + paymentNote + '</div>' : '';
      return '<div class="cksec cko-offers' + (multi ? ' multi' : ' single') + layout +
        '" data-offer-count="' + products.length + '">' + cardHtml + sharedFlowActions + '</div>';
    },
    hydrate(el, settings, blocks, ctx) {
      const decline = el.querySelector('[data-offer-decline]');
      const accepts = Array.from(el.querySelectorAll('[data-offer-accept]'));
      el.querySelectorAll('[data-offer-card]').forEach((card) => {
        const accept = card.querySelector('[data-offer-accept]');
        const variant = card.querySelector('[data-offer-variant]');
        if (!variant) return;
        variant.addEventListener('change', () => {
          const option = variant.selectedOptions[0]; if (!option) return;
          const cur = (ctx.offer && ctx.offer.currency) || 'USD';
          const price = card.querySelector('[data-offer-price]');
          const compare = card.querySelector('[data-offer-compare]');
          const savings = card.querySelector('[data-offer-savings]');
          if (price) price.textContent = money(+option.dataset.price || 0);
          if (compare) compare.textContent = money(+option.dataset.compare || 0);
          if (savings) savings.textContent = option.dataset.savings ? '(' + option.dataset.savings + ')' : '';
          if (accept) {
            const amount = money(+option.dataset.total || +option.dataset.price || 0) + ' ' + cur;
            accept.textContent = String(accept.dataset.acceptTemplate || 'Add to my order · {amount}').replace(/\{amount\}/g, amount);
          }
        });
      });
      accepts.forEach((accept) => {
        accept.addEventListener('click', (e) => {
          e.preventDefault();
          if (accept.disabled) return;
          accepts.forEach((button) => { button.disabled = true; });
          accept.textContent = 'Adding\u2026';
          setTimeout(() => OS.goCheckoutPage('thankyou'), 500);
        });
      });
      if (decline) decline.addEventListener('click', (e) => {
        e.preventDefault();
        OS.goCheckoutPage(ctx && ctx.checkoutPage === 'upsell' ? 'downsell' : 'thankyou');
      });
    },
  });

  OS.css('ck-offer-product', `
  .cko-offers{display:flex;flex-direction:column;gap:0}
  .cko-card{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.04fr);gap:34px;align-items:start;padding:0;overflow:hidden;box-sizing:border-box}
  .cko-card.reverse{grid-template-columns:minmax(0,1.04fr) minmax(0,1fr)}
  .cko-card.reverse .cko-media{order:2}.cko-card.reverse .cko-info{order:1}
  .cko-offers.multi.stacked{gap:24px}
  .cko-offers.multi.stacked .cko-card{padding:18px;border:1px solid var(--ck-divider)}
  .cko-offers.multi.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}
  .cko-offers.multi.grid .cko-card{display:flex;flex-direction:column;gap:0;border:1px solid var(--ck-divider)}
  .cko-offers.multi.grid .cko-card.reverse .cko-media,.cko-offers.multi.grid .cko-card.reverse .cko-info{order:initial}
  .cko-offers.multi.grid .cko-info{width:100%;padding:18px}
  .cko-offers.multi.grid .cko-media{width:100%}
  .cko-flow-actions{grid-column:1/-1;display:flex;flex-direction:column;align-items:center;padding-top:4px}
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
  .ckpage.mob .cko-offers.multi,.ckpage.mob .cko-offers.multi.grid{display:flex;flex-direction:column;gap:18px}
  .ckpage.mob .cko-card{display:flex;flex-direction:column;gap:18px}
  .ckpage.mob .cko-card.reverse .cko-media,.ckpage.mob .cko-card.reverse .cko-info{order:initial}
  .ckpage.mob .cko-offers.multi .cko-info{width:100%;padding:16px}
  .ckpage.mob .cko-offers.single .cko-info{width:100%;padding:0}
  .ckpage.mob .cko-qty-choice{width:130px}
  `);
})();
