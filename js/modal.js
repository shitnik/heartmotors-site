// ============================================================
// Модальное окно товара.
// Закрытие: крестик, затемнённый фон и клавиша Esc.
// ============================================================

function openProductModal(product) {
  const dialog = document.querySelector('#product-dialog');

  if (!dialog || !product) return;

  // Пустые значения и «не указан» отображаются как длинное тире.
  const displayValue = (value) => (
    value
      && String(value).trim()
      && String(value).toLowerCase() !== 'не указан'
      ? value
      : '—'
  );

  document.querySelector('#modal-content').innerHTML = `
    <div class="modal-inner">
      <button class="modal-close" aria-label="Закрыть">×</button>
      <div class="modal-kicker">
        ${displayValue(product.category)} · SKU ${displayValue(product.sku)}
      </div>
      ${product.image ? `
        <img
          class="modal-product-image"
          src="${product.image}"
          alt="Двигатель ${escapeHtml(product.engineCode)}"
          loading="lazy"
        >
      ` : ''}
      <h2>${escapeHtml(product.title)}</h2>
      <p class="modal-description">
        ${escapeHtml(displayValue(product.description))}
      </p>

      <dl class="spec-grid">
        <div class="spec">
          <dt>Категория</dt>
          <dd>${escapeHtml(displayValue(product.category))}</dd>
        </div>
        <div class="spec">
          <dt>Код двигателя</dt>
          <dd>${escapeHtml(displayValue(product.engineCode))}</dd>
        </div>
        <div class="spec">
          <dt>Марка автомобиля</dt>
          <dd>${escapeHtml(product.brand.join(', ') || '—')}</dd>
        </div>
        <div class="spec">
          <dt>Объём</dt>
          <dd>${escapeHtml(displayValue(product.engineVolume))}</dd>
        </div>
        <div class="spec">
          <dt>Мощность</dt>
          <dd>${escapeHtml(displayValue(product.power))}</dd>
        </div>
        <div class="spec">
          <dt>Тип привода ГРМ</dt>
          <dd>${escapeHtml(displayValue(product.timingDrive))}</dd>
        </div>
        <div class="spec">
          <dt>Совместимые модели</dt>
          <dd class="models-list">
            ${escapeHtml(product.models.join(', ') || '—')}
          </dd>
        </div>
      </dl>

      <div class="modal-price">${formatPrice(product.price)}</div>
      <button class="button button-dark" id="modal-add-cart">
        Добавить в корзину ↗
      </button>
    </div>
  `;

  document.querySelector('.modal-product-image')?.addEventListener('error', (event) => {
    event.currentTarget.remove();
  }, { once: true });

  dialog.showModal();

  document.querySelector('#modal-add-cart')
    .addEventListener('click', () => addToCart(product));

  document.querySelector('.modal-close')
    .addEventListener('click', () => dialog.close());
}

document.addEventListener('DOMContentLoaded', () => {
  const dialog = document.querySelector('#product-dialog');

  dialog?.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
});
